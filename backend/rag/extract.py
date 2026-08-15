from pathlib import Path

import fitz

# backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/data/pyqs
DATASET = BASE_DIR / "data" / "pyqs"


def extract_text(pdf_path: Path) -> str:
    """Extract all text from a PDF."""

    doc = fitz.open(pdf_path)

    text = []

    for page in doc:
        page_text = page.get_text("text")

        if page_text.strip():
            text.append(page_text)

    doc.close()

    return "\n".join(text)


if __name__ == "__main__":

    pdfs = sorted(DATASET.rglob("*.pdf"))

    if not pdfs:
        print("❌ No PDF files found.")
        exit()

    sample_pdf = pdfs[0]

    print(f"\nUsing PDF:\n{sample_pdf}\n")

    extracted = extract_text(sample_pdf)

    print("=" * 80)
    print(extracted[:3000])
    print("=" * 80)

    print(f"\nCharacters: {len(extracted)}")
