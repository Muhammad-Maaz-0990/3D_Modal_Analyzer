from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import tempfile
import os

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-3d")
async def analyze_3d(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    file_size = os.path.getsize(tmp_path)

    # Placeholder geometry calculations
    # In real scenario, parse the file and calculate actual values
    volume = round(file_size / 100000, 2)  # Fake volume calculation
    surface_area = round(file_size / 50000, 2)  # Fake surface area calculation
    num_faces = int(file_size / 1000)  # Fake face count
    material = "Plastic"  # Placeholder
    density = 1.2  # g/cm^3, placeholder
    cost_per_cm3 = 0.05  # USD, placeholder
    cost = round(volume * cost_per_cm3, 2)

    details = [
        {"property": "Filename", "value": file.filename},
        {"property": "File Size (bytes)", "value": file_size},
        {"property": "Volume (cm³)", "value": volume},
        {"property": "Surface Area (cm²)", "value": surface_area},
        {"property": "Number of Faces", "value": num_faces},
        {"property": "Material", "value": material},
        {"property": "Density (g/cm³)", "value": density},
        {"property": "Cost per cm³ (USD)", "value": cost_per_cm3},
        {"property": "Final Cost (USD)", "value": cost},
    ]

    # Clean up
    os.remove(tmp_path)
    return JSONResponse({
        "filename": file.filename,
        "size_bytes": file_size,
        "analysis": {
            "volume": volume,
            "surface_area": surface_area,
            "num_faces": num_faces,
            "material": material,
            "density": density,
            "cost_per_cm3": cost_per_cm3,
            "cost": cost,
            "details": details,
        }
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
