
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str
    filepath: str | None = None
    history: list[dict] = Field(default_factory=list)


class Source(BaseModel):
    subject: str
    branch: str
    pattern: str
    exam: str
    year: str
    filename: str


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]
