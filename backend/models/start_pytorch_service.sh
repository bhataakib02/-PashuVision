#!/bin/bash
echo "Starting PyTorch Prediction Service..."
cd "$(dirname "$0")"
python3 pytorch_service.py

