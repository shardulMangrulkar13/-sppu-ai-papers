from rag.vectore_store import search


def retrieve(query: str, top_k: int = 5):
    """
    Retrieve the most relevant chunks from ChromaDB.
    Removes duplicate chunks and ignores empty results.
    """

    results = search(query, top_k)

    retrieved = []

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    seen = set()

    for doc, meta in zip(documents, metadatas):

        if not doc or not meta:
            continue

        text = doc.strip()

        if len(text) < 20:
            continue

        key = (
            meta.get("subject", ""),
            meta.get("branch", ""),
            meta.get("pattern", ""),
            meta.get("exam", ""),
            meta.get("year", ""),
            text[:150]
        )

        if key in seen:
            continue

        seen.add(key)

        retrieved.append({
            "text": text,
            "metadata": meta
        })

    return retrieved


if __name__ == "__main__":

    while True:

        query = input("\nAsk Question (type 'exit' to quit): ")

        if query.lower() == "exit":
            break

        results = retrieve(query)

        print("\n" + "=" * 80)

        if not results:
            print("No results found.")
            continue

        for i, item in enumerate(results, start=1):

            meta = item["metadata"]

            print(f"""
Result {i}
{"-" * 80}
Subject : {meta.get("subject")}
Branch  : {meta.get("branch")}
Pattern : {meta.get("pattern")}
Exam    : {meta.get("exam")}
Year    : {meta.get("year")}
{"-" * 80}

{item["text"][:1000]}
""")