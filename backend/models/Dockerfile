# Dockerfile for Python PyTorch Service
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model files and service
COPY pytorch_service.py .
COPY best_model_convnext_base_acc0.7007.pth .
COPY model_info.json* .

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:5001/health')" || exit 1

# Start the service
CMD ["python", "pytorch_service.py"]

