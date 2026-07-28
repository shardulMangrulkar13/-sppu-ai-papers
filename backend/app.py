from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from schemas import AskRequest
from rag.ask_pdf import ask_pdf
from rag.search import (
    get_subjects,
    get_branches,
    get_patterns,
    get_years,
    get_papers,
)

app = FastAPI(
    title="SPPU AI Papers API",
    version="1.0.0",
    description="AI Powered Previous Year Question Papers API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
PDF_ROOT = BASE_DIR / "data" / "pyqs"


@app.get("/")
def home():
    return {
        "message": "SPPU AI Papers Backend Running 🚀"
    }


@app.post("/ask")
def ask(request: AskRequest):
    return ask_pdf(request.question)

@app.get("/subjects")

def subjects(

    branch: str | None = None,

    pattern: str | None = None,

):

    return get_subjects(

        branch=branch,

        pattern=pattern,

    )


@app.get("/branches")
def branches():
    return get_branches()


@app.get("/patterns")

def patterns(

    branch: str | None = None,

):

    return get_patterns(

        branch=branch,

    )


@app.get("/years")

def years(

    branch: str | None = None,

    pattern: str | None = None,

    subject: str | None = None,

):

    return get_years(

        branch=branch,

        pattern=pattern,

        subject=subject,

    )


@app.get("/papers")
def papers(
    branch: str | None = None,
    pattern: str | None = None,
    subject: str | None = None,
    year: str | None = None,
):
    return get_papers(
        branch=branch,
        pattern=pattern,
        subject=subject,
        year=year,
    )


# -----------------------------
# Preview PDF
# -----------------------------
@app.get("/preview")
def preview_pdf(path: str):

    file_path = PDF_ROOT / path

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found",
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
    )


# -----------------------------
# Download PDF
# -----------------------------
@app.get("/download")
def download_pdf(path: str):

    file_path = PDF_ROOT / path

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found",
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name,
    )