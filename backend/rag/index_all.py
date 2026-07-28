from pathlib import Path
import traceback

from rag.extract import extract_text
from rag.chunk import create_chunks
from rag.vectore_store import add_chunks

# backend/
BASE_DIR = Path(__file__).resolve().parent.parent

# backend/data/pyqs
DATASET = BASE_DIR / "data" / "pyqs"


def get_metadata(pdf: Path):

    parts = list(pdf.relative_to(DATASET).parts)

    # Ignore malformed paths
    if len(parts) < 4:
        raise ValueError(f"Invalid folder structure: {pdf}")

    filename = pdf.stem

    # Default values
    branch = "General"
    academic_year = "Unknown"
    pattern = "Unknown"
    subject = "Unknown"

    years = {"FE", "SE", "TE", "BE", "ME"}

    # -------------------------------------------------------
    # OLD STRUCTURE
    # data/pyqs/BE/2019 Pattern/Cloud Computing/file.pdf
    # -------------------------------------------------------
    if parts[0] in years:

        academic_year = parts[0]

        if len(parts) >= 2:
            pattern = parts[1]

        if len(parts) >= 3:
            subject = parts[2]

        branch = "E & TC Engineering"

    # -------------------------------------------------------
    # NEW STRUCTURE
    # data/pyqs/Computer Engineering/BE/2019 Pattern/DBMS/file.pdf
    # -------------------------------------------------------
    else:

        branch = parts[0]

        if len(parts) >= 2:
            academic_year = parts[1]

        if len(parts) >= 3:
            pattern = parts[2]

        if len(parts) >= 4:
            subject = parts[3]

    # -------------------------
    # Extract exam year
    # -------------------------

    exam_year = "Unknown"

    for word in filename.replace("_", " ").replace("-", " ").split():

        if word.isdigit() and len(word) == 4:
            exam_year = word
            break

    exam = filename.replace("_", " ").replace("-", " ")

    if exam_year != "Unknown":
        exam = exam.replace(exam_year, "").strip()

    return {
        "branch": branch,
        "pattern": pattern,
        "subject": subject,
        "exam": exam,
        "year": exam_year,
        "academic_year": academic_year,
        "filename": pdf.name,
        "filepath": str(pdf),
    }


def main():

    pdfs = sorted(DATASET.rglob("*.pdf"))

    print(f"\nFound {len(pdfs)} PDFs\n")

    success = 0
    failed = 0

    for index, pdf in enumerate(pdfs, start=1):

        print(f"[{index}/{len(pdfs)}] {pdf.name}")

        try:

            metadata = get_metadata(pdf)

            text = extract_text(pdf)

            if not text.strip():
                print("   -> Empty PDF")
                failed += 1
                continue

            chunks = create_chunks(text)

            if len(chunks) == 0:
                print("   -> No chunks")
                failed += 1
                continue

            add_chunks(chunks, metadata)

            print(f"   -> Indexed ({len(chunks)} chunks)")

            success += 1

        except Exception as e:

            failed += 1

            print(f"   -> ERROR : {e}")

            traceback.print_exc()

    print("\n==============================")
    print(f"Indexed Successfully : {success}")
    print(f"Failed               : {failed}")
    print("==============================")


if __name__ == "__main__":
    main()