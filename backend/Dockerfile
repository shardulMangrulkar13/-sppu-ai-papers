FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir --default-timeout=300 --retries=5 -r requirements.txt

# Copy only the backend files required by the application
COPY app.py .
COPY database.py .
COPY models.py .
COPY schemas.py .
COPY openrouter.py .

# Copy RAG code
COPY rag ./rag

# Copy existing ChromaDB index
COPY chroma_db ./chroma_db

# Cloud Run uses port 8080
EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]