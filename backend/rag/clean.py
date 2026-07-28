import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text before chunking.
    """

    # Remove IP addresses
    text = re.sub(
        r"\b\d{1,3}(?:\.\d{1,3}){3}\b",
        "",
        text,
    )

    # Remove Seat No.
    text = re.sub(
        r"SEAT\s*No\.?\s*:?",
        "",
        text,
        flags=re.IGNORECASE,
    )

    # Remove repeated exam codes like CEGP013091
    text = re.sub(
        r"\b[A-Z]{2,}\d+\b",
        "",
        text,
    )

    # Remove standalone page numbers
    text = re.sub(
        r"\n\s*\d+\s*\n",
        "\n",
        text,
    )

    # Remove extra blank lines
    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text,
    )

    # Remove repeated spaces
    text = re.sub(
        r"[ \t]+",
        " ",
        text,
    )

    return text.strip()