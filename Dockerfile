#Base image with Python
FROM python:3.13-slim

#set working directory inside the container
WORKDIR /app

#copy dependency files first(for caching)
COPY pyproject.toml poetry.lock ./

#install dependencis via Poetry
RUN pip install poetry \
    && poetry install --no-dev --no-root

#copy the FastAPI code
COPY fastapi_app ./fastapi_app

#Environment variable to make logs appear imediately
ENV PYTHONBUFFERED=1

#Command to run your API
CMD ["poetry", "run", "gunicorn", "-k", "uvicorn.workers.UvicornWorker", "fastapi_app.main:app", "--bind", "0.0.0.0:8000"]