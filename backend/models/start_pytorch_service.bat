@echo off
echo Starting PyTorch Prediction Service...
cd /d %~dp0
python pytorch_service.py
pause

