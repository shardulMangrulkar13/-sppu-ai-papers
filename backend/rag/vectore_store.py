from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer

# Persistent ChromaDB database
client = PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="sppu_papers"
)

# Load embedding model once
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str):
    """Generate embedding."""
    return embedding_model.encode(
        text,
        normalize_embeddings=True
    ).tolist()


def build_searchable_text(chunk: str, metadata: dict):
    """
    Create searchable document text.
    """

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


def add_chunks(chunks: list[str], metadata: dict):
    """
    Add PDF chunks to ChromaDB.
    """

    documents = []
    embeddings = []
    metadatas = []
    ids = []

    for index, chunk in enumerate(chunks):

        searchable_text = build_searchable_text(
            chunk,
            metadata
        )

        documents.append(searchable_text)

        embeddings.append(
            get_embedding(searchable_text)
        )

        ids.append(
            f"{metadata['branch']}_"
            f"{metadata['subject']}_"
            f"{metadata['year']}_"
            f"{metadata['exam']}_"
            f"{index}"
        )

        metadatas.append({
            "branch": metadata["branch"],
            "pattern": metadata["pattern"],
            "subject": metadata["subject"],
            "exam": metadata["exam"],
            "year": str(metadata["year"]),
            "filename": metadata["filename"],
            "filepath": metadata["filepath"],
        })

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


def search(query: str, top_k: int = 5):
    """
    Semantic search.
    """

    enhanced_query = f"""
SPPU Previous Year Question Papers

Student Question:
{query}

Find the most relevant subject, branch, year,
exam pattern and question paper content.
"""

    query_embedding = get_embedding(
        enhanced_query
    )

    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=[
            "documents",
            "metadatas",
            "distances",
        ],
    )