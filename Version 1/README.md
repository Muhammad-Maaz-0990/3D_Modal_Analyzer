
# 3D File Analyzer App

A full-stack application with Next.js frontend and Python FastAPI backend.

## Features
- Upload 3D files (.obj, .stl)
- Analyze geometry, volume, surface area (backend placeholder)
- Attractive, professional UI

## Getting Started

### Frontend (Next.js)
1. Install dependencies:
	```bash
	npm install
	```
2. Run the frontend:
	```bash
	npm run dev
	```

### Backend (Python FastAPI)
1. Go to `backend` folder:
	```bash
	cd backend
	```
2. Install dependencies:
	```bash
	pip install -r requirements.txt
	```
3. Run the backend:
	```bash
	uvicorn main:app --reload --host 0.0.0.0 --port 8000
	```

## Usage
- Open the frontend in your browser (usually http://localhost:3000)
- Upload a 3D file and view analysis results

## Next Steps
- Implement actual 3D file analysis logic in backend
- Add authentication or more features as needed
