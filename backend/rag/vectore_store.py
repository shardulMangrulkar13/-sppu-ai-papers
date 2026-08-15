import math
import re

from chromadb import PersistentClient
from sentence_transformers import CrossEncoder, SentenceTransformer

# =========================================================
# CHROMA
# =========================================================

client = PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(name="sppu_papers")


# =========================================================
# EMBEDDING MODEL
# =========================================================

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# =========================================================
# RERANKER
# =========================================================

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


# =========================================================
# EMBEDDING
# =========================================================


def get_embedding(text: str):

    return embedding_model.encode(text, normalize_embeddings=True).tolist()


# =========================================================
# SEARCHABLE TEXT
# =========================================================


def build_searchable_text(chunk: str, metadata: dict):

    return f"""
SPPU Previous Year Question Paper

Branch: {metadata['branch']}
Subject: {metadata['subject']}
Pattern: {metadata['pattern']}
Exam: {metadata['exam']}
Year: {metadata['year']}

Question Paper Content

{chunk}
"""


# =========================================================
# ADD CHUNKS
# =========================================================


def add_chunks(chunks: list[str], metadata: dict):

    documents = []
    embeddings = []
    metadatas = []
    ids = []

    for index, chunk in enumerate(chunks):

        searchable_text = build_searchable_text(chunk, metadata)

        documents.append(searchable_text)

        embeddings.append(get_embedding(searchable_text))

        ids.append(
            f"{metadata['branch']}_"
            f"{metadata['subject']}_"
            f"{metadata['year']}_"
            f"{metadata['exam']}_"
            f"{index}"
        )

        metadatas.append(
            {
                "branch": metadata["branch"],
                "pattern": metadata["pattern"],
                "subject": metadata["subject"],
                "exam": metadata["exam"],
                "year": str(metadata["year"]),
                "filename": metadata["filename"],
                "filepath": metadata["filepath"],
            }
        )

    try:

        collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    except Exception:

        # Ignore duplicate IDs
        pass


# =========================================================
# TOKENIZATION
# =========================================================


def tokenize(text: str):

    return set(re.findall(r"\b[a-zA-Z0-9]+\b", text.lower()))


# =========================================================
# KEYWORD SCORE
# =========================================================


def keyword_score(query: str, document: str):

    query_tokens = tokenize(query)
    document_tokens = tokenize(document)

    if not query_tokens:
        return 0.0

    overlap = query_tokens & document_tokens

    return len(overlap) / len(query_tokens)


# =========================================================
# NORMALIZE
# =========================================================


def normalize_scores(scores):

    if not scores:
        return []

    minimum = min(scores)
    maximum = max(scores)

    if math.isclose(minimum, maximum):

        return [1.0 for _ in scores]

    return [(score - minimum) / (maximum - minimum) for score in scores]


# =========================================================
# HYBRID SEARCH + RERANKER
# =========================================================


def search(query: str, top_k: int = 10, filepath: str | None = None):
    """
    Hybrid retrieval:

    1. Metadata filtering
    2. Vector / semantic search
    3. Keyword matching
    4. Hybrid candidate ranking
    5. CrossEncoder reranking
    """

    # -----------------------------------------------------
    # Candidate count
    # -----------------------------------------------------

    candidate_k = max(top_k * 4, 20)

    # -----------------------------------------------------
    # Enhanced semantic query
    # -----------------------------------------------------

    enhanced_query = f"""
SPPU Previous Year Question Paper

Student Question:
{query}

Find the most relevant question or answer
from the selected question paper.
"""

    query_embedding = get_embedding(enhanced_query)

    # -----------------------------------------------------
    # Metadata filtering
    # -----------------------------------------------------

    search_args = {
        "query_embeddings": [query_embedding],
        "n_results": candidate_k,
        "include": [
            "documents",
            "metadatas",
            "distances",
        ],
    }

    # IMPORTANT:
    # Search ONLY inside selected PDF

    if filepath:

        search_args["where"] = {"filepath": filepath}

    # -----------------------------------------------------
    # VECTOR SEARCH
    # -----------------------------------------------------

    results = collection.query(**search_args)

    documents = results.get("documents", [[]])[0]

    metadatas = results.get("metadatas", [[]])[0]

    distances = results.get("distances", [[]])[0]

    if not documents:

        return {
            "documents": [[]],
            "metadatas": [[]],
            "distances": [[]],
        }

    # -----------------------------------------------------
    # VECTOR SCORES
    # -----------------------------------------------------

    vector_scores = []

    for distance in distances:

        # Chroma cosine distance:
        # smaller = better

        similarity = 1.0 - distance

        vector_scores.append(similarity)

    vector_scores = normalize_scores(vector_scores)

    # -----------------------------------------------------
    # KEYWORD SCORES
    # -----------------------------------------------------

    keyword_scores = []

    for document in documents:

        score = keyword_score(query, document)

        keyword_scores.append(score)

    keyword_scores = normalize_scores(keyword_scores)

    # -----------------------------------------------------
    # HYBRID SCORE
    # -----------------------------------------------------

    candidates = []

    for index, document in enumerate(documents):

        semantic_score = vector_scores[index]

        lexical_score = keyword_scores[index]

        # Semantic gets slightly more weight.
        # Keyword matching is still important
        # for exact exam terminology.

        hybrid_score = 0.65 * semantic_score + 0.35 * lexical_score

        candidates.append(
            {
                "text": document,
                "metadata": metadatas[index],
                "vector_score": semantic_score,
                "keyword_score": lexical_score,
                "hybrid_score": hybrid_score,
            }
        )

    # -----------------------------------------------------
    # Sort hybrid candidates
    # -----------------------------------------------------

    candidates.sort(key=lambda x: x["hybrid_score"], reverse=True)

    # Keep manageable number for reranker

    candidates = candidates[:20]

    # -----------------------------------------------------
    # CROSS ENCODER RERANKER
    # -----------------------------------------------------

    pairs = []

    for candidate in candidates:

        pairs.append([query, candidate["text"]])

    reranker_scores = reranker.predict(pairs)
    print("\n===== RERANKER DEBUG =====")

    for candidate, score in zip(candidates, reranker_scores):
        print("\nScore:", float(score))

    print("Text:", candidate["text"][:300])

    print("\n==========================\n")

    # -----------------------------------------------------
    # Attach reranker scores
    # -----------------------------------------------------

    for candidate, score in zip(candidates, reranker_scores):

        candidate["reranker_score"] = float(score)

    # -----------------------------------------------------
    # Final ranking
    # -----------------------------------------------------

    candidates.sort(key=lambda x: x["reranker_score"], reverse=True)
    # -----------------------------------------------------
    # RELEVANCE GATE
    # -----------------------------------------------------

    # CrossEncoder scores can be negative.
    # Very low scores mean the retrieved content is
    # probably not relevant to the student's question.

    RELEVANCE_THRESHOLD = -8.0

    if not candidates or candidates[0]["reranker_score"] < RELEVANCE_THRESHOLD:
        return {
            "documents": [[]],
            "metadatas": [[]],
            "distances": [[]],
        }

    # -----------------------------------------------------
    # Return Chroma-like structure
    # -----------------------------------------------------

    final_candidates = candidates[:top_k]

    return {
        "documents": [[item["text"] for item in final_candidates]],
        "metadatas": [[item["metadata"] for item in final_candidates]],
        "distances": [[1.0 - item["reranker_score"] for item in final_candidates]],
    }
