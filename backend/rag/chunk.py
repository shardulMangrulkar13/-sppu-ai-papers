from langchain_text_splitters import RecursiveCharacterTextSplitter
from rag.extract import extract_text
from pathlib import Path
from rag.clean import clean_text

# backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/data/pyqs
DATASET = BASE_DIR / "data" / "pyqs"


def create_chunks(text: str):
    text = clean_text(text)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=[
            "\n\n",
            "\n",
            ". ",
            " ",
            ""
        ],
    )

    return splitter.split_text(text)


if __name__ == "__main__":

    pdfs = sorted(DATASET.rglob("*.pdf"))

    if not pdfs:
        print("No PDFs found.")
        exit()

    sample_pdf = pdfs[0]

    print(f"\nUsing PDF:\n{sample_pdf.name}\n")

    text = extract_text(sample_pdf)

    chunks = create_chunks(text)

    print("=" * 80)
    print("Total Chunks :", len(chunks))
    print("=" * 80)

    for i, chunk in enumerate(chunks[:3], start=1):
        print(f"\n------ Chunk {i} ------\n")
        print(chunk)