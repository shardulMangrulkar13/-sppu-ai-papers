from pydantic import BaseModel
from typing import List


class AskRequest(BaseModel):
    question: str


class Source(BaseModel):
    subject: str
    branch: str
    pattern: str
    exam: str
    year: str
    filename: str


class AskResponse(BaseModel):
    answer: str
    sources: List[Source]