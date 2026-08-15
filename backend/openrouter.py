import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

SYSTEM_PROMPT = """
You are SPPU AI.

You help engineering students using previous year question papers.

Rules:

- Use PDF context whenever available.
- If context is incomplete, use your own knowledge.
- Explain in simple English.
- Use Markdown.
- Include:
  - Explanation
  - Important Points
  - Example
  - Exam Answer
  - Summary
- Keep answers accurate and beginner friendly.
"""


def ask_ai(prompt: str):

    response = client.chat.completions.create(
        model="google/gemini-2.5-flash",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,
        max_tokens=800,
    )

    return response.choices[0].message.content
