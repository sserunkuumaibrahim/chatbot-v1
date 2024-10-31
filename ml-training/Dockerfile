# Use a slim base image to reduce size
FROM python:3.10-slim AS base

# Set environment variables for production
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set working directory
WORKDIR /app

# Install dependencies separately to leverage caching
COPY requirements.txt .

# Install dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get remove -y gcc && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . .

# Set a non-root user for security
RUN adduser --disabled-password mluser && chown -R mluser /app
USER mluser

# Expose the app port
EXPOSE 8000

# Run the application with uvicorn
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
