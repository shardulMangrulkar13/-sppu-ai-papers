from sqlalchemy import Column, ForeignKey, Integer, String

from database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(String)
    semester = Column(String)
    subject_name = Column(String)


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    exam_year = Column(Integer)
    exam_month = Column(String)
    pdf_url = Column(String)
