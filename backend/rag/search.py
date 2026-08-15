import json
from pathlib import Path

from google.cloud import storage

BASE_DIR = Path(__file__).resolve().parent.parent
METADATA_FILE = BASE_DIR / "metadata.json"

BUCKET_NAME = "sppu-ai-papers-pdfs"
BRANCH_CACHE_TTL = 3600  # Cache branches for 1 hour (in seconds)

BRANCH_CACHE = None
BRANCH_CACHE_TIME = 0

storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)


def extract_exam_year(filename):
    filename = filename.replace("_", " ").replace("-", " ")

    for word in filename.split():
        if word.isdigit() and len(word) == 4:
            return word

    return ""


def get_pdfs(prefix=""):
    """Return PDF blob names from Google Cloud Storage."""

    for blob in storage_client.list_blobs(
        BUCKET_NAME,
        prefix=prefix,
    ):
        if blob.name.lower().endswith(".pdf"):
            yield blob.name


def get_parts(path):
    """Split GCS PDF path into its folder components."""

    return path.split("/")


# ---------------------------------------
# Branches
# ---------------------------------------


def get_branches():

    try:

        with open(METADATA_FILE, "r", encoding="utf-8") as file:

            metadata = json.load(file)

        return metadata.get("branches", [])

    except Exception as error:

        print("Metadata loading failed:", error)

        # Fallback to GCS
        branches = set()

        for path in get_pdfs():

            parts = get_parts(path)

            if len(parts) < 5:
                continue

            branches.add(parts[0])

        return sorted(branches)


# ---------------------------------------
# Academic Year
# FE / SE / TE / BE / ME
# ---------------------------------------


def get_years(branch=None):

    years = set()

    prefix = f"{branch}/" if branch else ""

    for path in get_pdfs(prefix):

        parts = get_parts(path)

        if len(parts) < 5:
            continue

        pdf_branch = parts[0]
        academic_year = parts[1]

        if branch and pdf_branch != branch:
            continue

        years.add(academic_year)

    order = ["FE", "SE", "TE", "BE", "ME"]

    return [y for y in order if y in years]


# ---------------------------------------
# Patterns
# ---------------------------------------


def get_patterns(branch=None, year=None):

    patterns = set()

    if branch and year:
        prefix = f"{branch}/{year}/"
    elif branch:
        prefix = f"{branch}/"
    else:
        prefix = ""

    for path in get_pdfs(prefix):

        parts = get_parts(path)

        if len(parts) < 5:
            continue

        pdf_branch = parts[0]
        academic_year = parts[1]
        pattern = parts[2]

        if branch and pdf_branch != branch:
            continue

        if year and academic_year != year:
            continue

        patterns.add(pattern)

    return sorted(patterns)


# ---------------------------------------
# Subjects
# ---------------------------------------


def get_subjects(
    branch=None,
    year=None,
    pattern=None,
):

    subjects = set()

    if branch and year and pattern:
        prefix = f"{branch}/{year}/{pattern}/"
    elif branch and year:
        prefix = f"{branch}/{year}/"
    elif branch:
        prefix = f"{branch}/"
    else:
        prefix = ""

    for path in get_pdfs(prefix):

        parts = get_parts(path)

        if len(parts) < 5:
            continue

        pdf_branch = parts[0]
        academic_year = parts[1]
        pdf_pattern = parts[2]
        subject = parts[3]

        if branch and pdf_branch != branch:
            continue

        if year and academic_year != year:
            continue

        if pattern and pdf_pattern != pattern:
            continue

        subjects.add(subject)

    return sorted(subjects)


# ---------------------------------------
# Papers
# ---------------------------------------


def get_papers(
    branch=None,
    year=None,
    pattern=None,
    subject=None,
):

    papers = []

    if branch and year and pattern and subject:
        prefix = f"{branch}/{year}/{pattern}/{subject}/"
    elif branch and year and pattern:
        prefix = f"{branch}/{year}/{pattern}/"
    elif branch and year:
        prefix = f"{branch}/{year}/"
    elif branch:
        prefix = f"{branch}/"
    else:
        prefix = ""

    for path in get_pdfs(prefix):

        parts = get_parts(path)

        if len(parts) < 5:
            continue

        pdf_branch = parts[0]
        academic_year = parts[1]
        pdf_pattern = parts[2]
        pdf_subject = parts[3]

        if branch and pdf_branch != branch:
            continue

        if year and academic_year != year:
            continue

        if pattern and pdf_pattern != pattern:
            continue

        if subject and pdf_subject != subject:
            continue

        filename = parts[-1]
        stem = filename.rsplit(".", 1)[0]

        papers.append(
            {
                "branch": pdf_branch,
                "academic_year": academic_year,
                "pattern": pdf_pattern,
                "subject": pdf_subject,
                "exam_year": extract_exam_year(stem),
                "exam": stem.replace("_", " ").replace("-", " "),
                "filename": filename,
                "path": path,
            }
        )

    papers.sort(
        key=lambda x: (
            x["exam_year"],
            x["filename"],
        ),
        reverse=True,
    )

    return papers
