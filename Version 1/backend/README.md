# Python Backend (FastAPI)

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoint
- `POST /analyze-3d` — Upload a 3D file (.obj, .stl, etc.) and get analysis results.

## Next Steps
- Implement 3D file parsing and analysis logic in `main.py`.
