from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET = BASE_DIR / "data" / "pyqs"


def extract_year(filename):
    for word in filename.replace("_", " ").replace("-", " ").split():
        if word.isdigit() and len(word) == 4:
            return word
    return ""


def get_branches():
    branches = set()

    for pdf in DATASET.rglob("*.pdf"):
        branches.add(pdf.relative_to(DATASET).parts[0])

    return sorted(branches)


def get_patterns(branch=None):
    patterns = set()

    for pdf in DATASET.rglob("*.pdf"):

        parts = pdf.relative_to(DATASET).parts

        pdf_branch = parts[0]
        pdf_pattern = parts[1]

        if branch and pdf_branch != branch:
            continue

        patterns.add(pdf_pattern)

    return sorted(patterns)


def get_subjects(branch=None, pattern=None):
    subjects = set()

    for pdf in DATASET.rglob("*.pdf"):

        parts = pdf.relative_to(DATASET).parts

        pdf_branch = parts[0]
        pdf_pattern = parts[1]
        pdf_subject = parts[2]

        if branch and pdf_branch != branch:
            continue

        if pattern and pdf_pattern != pattern:
            continue

        subjects.add(pdf_subject)

    return sorted(subjects)


def get_years(branch=None, pattern=None, subject=None):
    years = set()

    for pdf in DATASET.rglob("*.pdf"):

        parts = pdf.relative_to(DATASET).parts

        pdf_branch = parts[0]
        pdf_pattern = parts[1]
        pdf_subject = parts[2]

        if branch and pdf_branch != branch:
            continue

        if pattern and pdf_pattern != pattern:
            continue

        if subject and pdf_subject != subject:
            continue

        years.add(extract_year(pdf.stem))

    return sorted(years)


def get_papers(
    branch=None,
    pattern=None,
    subject=None,
    year=None,
):
    papers = []

    for pdf in DATASET.rglob("*.pdf"):

        parts = pdf.relative_to(DATASET).parts

        pdf_branch = parts[0]
        pdf_pattern = parts[1]
        pdf_subject = parts[2]

        pdf_year = extract_year(pdf.stem)

        if branch and pdf_branch != branch:
            continue

        if pattern and pdf_pattern != pattern:
            continue

        if subject and pdf_subject != subject:
            continue

        if year and pdf_year != year:
            continue

        papers.append(
            {
                "branch": pdf_branch,
                "pattern": pdf_pattern,
                "subject": pdf_subject,
                "year": pdf_year,
                "exam": pdf.stem.replace("_", " ").replace("-", " "),
                "filename": pdf.name,
                "path": str(pdf.relative_to(DATASET)).replace("\\", "/"),
            }
        )

    return sorted(
        papers,
        key=lambda x: (
            x["branch"],
            x["pattern"],
            x["subject"],
            x["year"],
            x["filename"],
        ),
    )