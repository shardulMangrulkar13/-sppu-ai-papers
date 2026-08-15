import re

from rag.vectore_store import collection, search


def extract_question_number(query: str):
    """
    Detect question numbers such as:
    Question 1
    Q1
    Question 3(a)
    Q4(b)
    """

    patterns = [
        r"\bquestion\s*(\d+)\s*(?:\(\s*([a-z])\s*\))?",
        r"\bq\s*(\d+)\s*(?:\(\s*([a-z])\s*\))?",
    ]

    for pattern in patterns:

        match = re.search(pattern, query, re.IGNORECASE)

        if match:

            number = match.group(1)
            part = match.group(2)

            return number, part

    return None, None


def retrieve(query: str, top_k: int = 8, filepath: str | None = None):

    question_number, question_part = extract_question_number(query)

    # -----------------------------------------
    # Question-number query
    # -----------------------------------------

    if question_number and filepath:

        result = collection.get(
            where={"filepath": filepath},
            include=[
                "documents",
                "metadatas",
            ],
        )

        documents = result.get("documents", [])

        metadatas = result.get("metadatas", [])

        retrieved = []

        question_patterns = [
            rf"\bQuestion\s*{question_number}\b",
            rf"\bQ\s*{question_number}\b",
            rf"\b{question_number}\s*[\.\)]",
        ]

        if question_part:

            question_patterns.extend(
                [
                    rf"\bQuestion\s*{question_number}\s*\(\s*{question_part}\s*\)",
                    rf"\bQ\s*{question_number}\s*\(\s*{question_part}\s*\)",
                ]
            )

        for doc, meta in zip(documents, metadatas):

            if not doc:
                continue

            found = False

            for pattern in question_patterns:

                if re.search(pattern, doc, re.IGNORECASE):
                    found = True
                    break

            if not found:
                continue

            retrieved.append(
                {
                    "text": doc[:2500],
                    "metadata": meta,
                }
            )

        # If exact question matching worked,
        # return those chunks.
        if retrieved:

            return retrieved[:top_k]

    # -----------------------------------------
    # Normal semantic search
    # -----------------------------------------

    results = search(query, top_k, filepath)

    documents = results.get("documents", [[]])[0]

    metadatas = results.get("metadatas", [[]])[0]

    retrieved = []

    seen = set()

    for doc, meta in zip(documents, metadatas):

        if not doc:
            continue

        key = (
            meta.get("subject"),
            meta.get("exam"),
            doc[:120],
        )

        if key in seen:
            continue

        seen.add(key)

        retrieved.append(
            {
                "text": doc[:2500],
                "metadata": meta,
            }
        )

    return retrieved
