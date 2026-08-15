import io

import fitz
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google.cloud import storage

from rag.ask_pdf import ask_pdf
from rag.search import (
    get_branches,
    get_papers,
    get_patterns,
    get_subjects,
    get_years,
)
from schemas import AskRequest

app = FastAPI(
    title="SPPU AI Papers API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GCS_BUCKET = "sppu-ai-papers-pdfs"
storage_client = storage.Client()
bucket = storage_client.bucket(GCS_BUCKET)
bucket = storage_client.bucket(GCS_BUCKET)
# ----------------------------
# PDF Watermark
# ----------------------------


def add_watermark(pdf_data: bytes) -> bytes:
    """
    Add multiple repeated diagonal watermarks
    to every PDF page.
    """

    pdf = fitz.open(stream=pdf_data, filetype="pdf")

    for page in pdf:

        rect = page.rect

        # Multiple watermark positions
        positions = [
            (rect.width * 0.25, rect.height * 0.25),
            (rect.width * 0.75, rect.height * 0.25),
            (rect.width * 0.25, rect.height * 0.50),
            (rect.width * 0.75, rect.height * 0.50),
            (rect.width * 0.25, rect.height * 0.75),
            (rect.width * 0.75, rect.height * 0.75),
        ]

        for x, y in positions:

            point = fitz.Point(x, y)

            page.insert_text(
                point,
                "SPPU AI Papers",
                fontsize=24,
                fontname="helv",
                color=(0.65, 0.65, 0.65),
                fill_opacity=0.18,
                stroke_opacity=0,
                rotate=0,
            )

    output = io.BytesIO()

    pdf.save(
        output,
        garbage=4,
        deflate=True,
    )

    pdf.close()

    output.seek(0)

    return output.read()


@app.get("/")
def home():
    return {"message": "SPPU AI Papers Backend Running 🚀"}


# ----------------------------
# AI Assistant
# ----------------------------
@app.post("/ask")
def ask(request: AskRequest):
    return ask_pdf(request.question, request.filepath, request.history)


# ----------------------------
# Branch
# ----------------------------


@app.get("/branches")
def branches():
    return get_branches()


# ----------------------------
# Academic Year
# ----------------------------


@app.get("/years")
def years(
    branch: str | None = None,
):
    return get_years(branch)


# ----------------------------
# Pattern
# ----------------------------


@app.get("/patterns")
def patterns(
    branch: str | None = None,
    year: str | None = None,
):
    return get_patterns(
        branch,
        year,
    )


# ----------------------------
# Subject
# ----------------------------


@app.get("/subjects")
def subjects(
    branch: str | None = None,
    year: str | None = None,
    pattern: str | None = None,
):
    return get_subjects(
        branch,
        year,
        pattern,
    )


# ----------------------------
# Papers
# ----------------------------


@app.get("/papers")
def papers(
    branch: str | None = None,
    year: str | None = None,
    pattern: str | None = None,
    subject: str | None = None,
):
    return get_papers(
        branch,
        year,
        pattern,
        subject,
    )


@app.get("/preview")
def preview(path: str):

    blob = bucket.blob(path)

    if not blob.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found",
        )

    # Get original PDF from GCS
    pdf_data = blob.download_as_bytes()

    # Add watermark
    watermarked_pdf = add_watermark(pdf_data)

    return StreamingResponse(
        io.BytesIO(watermarked_pdf),
        media_type="application/pdf",
        headers={"Content-Disposition": "inline"},
    )


# ----------------------------
# Download PDF
# ----------------------------
@app.get("/download")
def download(path: str):

    blob = bucket.blob(path)

    if not blob.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found",
        )

    # Get original PDF from GCS
    pdf_data = blob.download_as_bytes()

    # Add watermark
    watermarked_pdf = add_watermark(pdf_data)

    filename = path.split("/")[-1]

    return StreamingResponse(
        io.BytesIO(watermarked_pdf),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
