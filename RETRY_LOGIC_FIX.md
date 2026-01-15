# Retry Logic & Model Loading Fix

## Problem
When the model is loading (first request), the service returns 503 "Model not loaded", but the backend immediately fails instead of waiting and retrying.

## Root Causes
1. **No retry logic** - Backend fails immediately on 503
2. **No exponential backoff** - Even if retrying, no wait time
3. **Poor error messages** - Users don't know to wait
4. **Frontend doesn't handle loading state** - Shows error immediately

## Solutions Implemented ✅

### 1. **Automatic Retry with Exponential Backoff**
- Detects "model loading" status (503 with specific error)
- Retries up to 6 times
- Exponential backoff: 5s, 10s, 20s, 20s, 20s, 20s
- Maximum total wait: 90 seconds
- 2-minute timeout per request

### 2. **Better Error Handling**
- Distinguishes between "model loading" and "service unavailable"
- Returns `retryAfter: 30` in response when model is loading
- Clear messages explaining the wait time
- Handles timeouts gracefully

### 3. **Improved User Experience**
- Error messages explain model loading takes 30-90 seconds
- Suggests waiting and retrying
- Frontend can use `retryAfter` to auto-retry

## Code Changes

### `backend/src/ai/PyTorchPredictor.js`
- Added `retryCount` parameter to `predictViaPythonService()`
- Detects model loading status from 503 responses
- Implements exponential backoff retry logic
- Handles timeouts and network errors
- Maximum 6 retries with 90s total wait

### `backend/src/server.js`
- Better error messages for model loading vs service unavailable
- Returns `retryAfter` field in 503 responses
- Distinguishes loading state from error state
- Updated both `/api/predict` and species detection

## How It Works

### First Request Flow:
1. User makes prediction request
2. Backend calls Railway service
3. Railway returns 503 "Model not loaded"
4. Backend detects loading state
5. Waits 5 seconds, retries
6. Still loading? Wait 10s, retry
7. Continues with exponential backoff
8. Model loads (30-90 seconds)
9. Request succeeds, returns predictions

### Subsequent Requests:
1. Model already loaded
2. Immediate response
3. No retries needed

## Retry Schedule

| Attempt | Wait Time | Cumulative Wait |
|---------|-----------|-----------------|
| 1       | 0s        | 0s              |
| 2       | 5s        | 5s              |
| 3       | 10s       | 15s             |
| 4       | 20s       | 35s             |
| 5       | 20s       | 55s             |
| 6       | 20s       | 75s             |
| 7       | 20s       | 95s (max)       |

**Total maximum wait: ~90 seconds**

## API Response Format

### When Model is Loading:
```json
{
  "error": "Model is loading",
  "message": "The AI model is currently loading. This happens on the first request and takes 30-90 seconds. Please wait a moment and try again.",
  "details": "Model is loading on Railway service at https://...",
  "serviceUrl": "https://...",
  "retryAfter": 30
}
```

### When Service is Unavailable:
```json
{
  "error": "AI model prediction service unavailable",
  "message": "The PyTorch model prediction service is not available.",
  "details": "Please ensure your external Python service...",
  "serviceUrl": "https://...",
  "retryAfter": null
}
```

## Frontend Integration

The frontend can now:
1. Check `retryAfter` field
2. Auto-retry after suggested time
3. Show loading indicator instead of error
4. Display progress message

Example:
```javascript
if (error.retryAfter) {
  // Model is loading, retry after retryAfter seconds
  setTimeout(() => retryRequest(), error.retryAfter * 1000);
}
```

## Testing

### Test Model Loading:
1. Deploy fresh Railway service (or restart)
2. Make first prediction request
3. Should see retry messages in logs
4. Request succeeds after 30-90 seconds

### Test Normal Operation:
1. Model already loaded
2. Make prediction request
3. Immediate response
4. No retries needed

## Monitoring

Watch for these in logs:
- `⏳ Model is loading (attempt X/6), waiting Ys before retry...`
- `✅ Model loaded successfully`
- `❌ Model prediction failed` (only after all retries exhausted)

---

**Status**: ✅ Retry logic with exponential backoff implemented
**Expected Result**: Automatic retries during model loading, better UX
**Last Updated**: 2026-01-15

