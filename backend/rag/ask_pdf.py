import sys
from pathlib import Path

# Add backend folder to Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Import from the same folder
from rag.retriever import retrieve

# Import from backend
from openrouter import ask_ai


def build_context(results):
    """
    Build context string from retrieved chunks.
    """

    context = ""

    for item in results:
        meta = item["metadata"]

        context += f"""
==================================================
Subject : {meta.get("subject", "Unknown")}
Branch  : {meta.get("branch", "Unknown")}
Pattern : {meta.get("pattern", "Unknown")}
Exam    : {meta.get("exam", "Unknown")}
Year    : {meta.get("year", "Unknown")}
==================================================

{item["text"]}

--------------------------------------------------

"""

    return context


def ask_pdf(question: str):
    """
    Answer a question using retrieved PDF chunks.
    """

    results = retrieve(question, top_k=5)

    if len(results) == 0:
        return {
            "answer": "No relevant question papers were found.",
            "sources": []
        }

    context = build_context(results)

    prompt = f"""
You are SPPU AI.

You MUST answer ONLY using the QUESTION PAPER CONTEXT below.

If the context does not contain the answer, reply exactly:

This information is not available in the uploaded SPPU question papers.

## Rules

- Never use outside knowledge.
- Never guess.
- Use simple English.
- Keep the answer concise unless the student asks for detail.
- Use Markdown headings (##).
- Use bullet points whenever possible.
- Highlight important terms using **bold**.
- If the topic appears in multiple papers or years, mention that.
- Do not repeat information.
- If the context contains multiple versions of the answer, combine them into one clear explanation.

## Answer Format

## 📘 Easy Explanation

Explain the topic in simple language.

## ⭐ Important Points

- Point 1
- Point 2
- Point 3
- Point 4

## 💡 Example

Give one simple example only if supported by the context.

## 📝 Exam Answer

Write an exam-ready answer.

## 🎯 Remember

One short takeaway.

=========================
QUESTION PAPER CONTEXT
=========================

{context}

=========================
STUDENT QUESTION
=========================

{question}
"""

    answer = ask_ai(prompt)

    sources = []

    seen = set()

    for item in results:

        meta = item["metadata"]

        key = (
            meta["subject"],
            meta["year"],
            meta["exam"],
            meta["filename"]
        )

        if key not in seen:

            seen.add(key)

            sources.append({
                "subject": meta["subject"],
                "branch": meta["branch"],
                "pattern": meta["pattern"],
                "exam": meta["exam"],
                "year": meta["year"],
                "filename": meta["filename"],
            })

    return {
        "answer": answer,
        "sources": sources
    }


if __name__ == "__main__":

    while True:

        print("\n" + "=" * 80)

        question = input("Ask Question (type 'exit' to quit): ")

        if question.lower() == "exit":
            break

        response = ask_pdf(question)

        print("\n")
        print("=" * 80)
        print("AI Answer")
        print("=" * 80)
        print(response["answer"])

        print("\n")
        print("=" * 80)
        print("Sources")
        print("=" * 80)

        for i, source in enumerate(response["sources"], start=1):

            print(f"""
{i}.
Subject : {source['subject']}
Branch  : {source['branch']}
Pattern : {source['pattern']}
Exam    : {source['exam']}
Year    : {source['year']}
File    : {source['filename']}
""")