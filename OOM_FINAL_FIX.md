# Final OOM Fix - Model Size Validation

## Critical Issue
The model file is **1003 MB (1GB)**, which exceeds Railway's **512MB RAM limit**. This causes Out of Memory (OOM) errors and worker crashes.

## Root Cause
- Railway free tier: **512MB RAM**
- Model file: **1003 MB (1GB)**
- Even with optimizations, a 1GB model cannot load into 512MB RAM
- Downloading 1GB also uses significant memory

## Permanent Solutions Implemented ✅

### 1. **Model Size Validation** ✅
- **Maximum model size: 350MB** (leaves ~150MB for system/PyTorch)
- Rejects models larger than 350MB with clear error
- Prevents OOM before attempting to load

### 2. **Streaming Download** ✅
- Downloads in **8MB chunks** instead of loading entire file
- Reduces memory usage during download
- Shows progress every 100MB
- 5-minute timeout for large files

### 3. **Memory Checks Before Loading** ✅
- Checks available memory before loading
- Validates model size before attempting load
- Warns if insufficient memory
- Prevents crashes with clear error messages

### 4. **Better Error Messages** ✅
- Clear explanation of size limits
- Suggests solutions (quantization, upgrade plan)
- Provides actionable next steps

## Code Changes

### `backend/models/pytorch_service.py`
- Added 350MB size limit check
- Streaming download in 8MB chunks
- Memory validation before loading
- Clear error messages with solutions

## What Happens Now

### If Model > 350MB:
1. Download completes successfully
2. Size validation fails
3. Clear error message shown
4. File removed automatically
5. Service continues running (predictions unavailable)

### If Model < 350MB:
1. Download completes
2. Size validation passes
3. Model loads successfully
4. Predictions work

## Solutions for 1GB Model

### Option 1: Quantize the Model (Recommended)
```python
# Quantize model to reduce size by 4x
model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)
torch.save(model.state_dict(), 'model_quantized.pth')
```

### Option 2: Use Smaller Architecture
- Switch to ConvNeXt Tiny (already implemented)
- Use MobileNet or EfficientNet
- Reduce model parameters

### Option 3: Upgrade Railway Plan
- **Hobby Plan**: $5/month, **1GB RAM** (can handle 1GB model)
- **Pro Plan**: $20/month, **2GB RAM** (plenty of room)

### Option 4: External Model Hosting
- Host model on separate service with more memory
- Use model serving API (TensorFlow Serving, TorchServe)
- Call via HTTP API

## Expected Behavior

### Current Model (1GB):
- ✅ Download succeeds (streaming)
- ❌ Size validation fails (>350MB)
- ✅ Clear error message
- ✅ Service stays running
- ❌ Predictions unavailable (model too large)

### After Fix (Quantized Model <350MB):
- ✅ Download succeeds
- ✅ Size validation passes
- ✅ Model loads successfully
- ✅ Predictions work

## Next Steps

1. **Quantize the existing model** to reduce size
2. **OR** upgrade Railway to Hobby plan ($5/month)
3. **OR** use a smaller model architecture
4. **OR** host model externally

---

**Status**: ✅ Model size validation implemented
**Result**: Prevents OOM by rejecting oversized models
**Action Required**: Quantize model or upgrade Railway plan
**Last Updated**: 2026-01-15

