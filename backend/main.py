from fastapi import FastAPI, File, UploadFile, Form
from typing import List
from deepface import DeepFace
import shutil, uuid, os
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# In-memory DB
# =========================
DB = {}

# =========================
# Utils
# =========================
def cosine_similarity(a, b):
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

@app.get("/")
def root():
    return {"status": "Backend running"}

# =========================================================
# REGISTER FACE
# =========================================================
@app.post("/face/register")
async def register_face(
    employeeId: str = Form(...),
    images: List[UploadFile] = File(...)
):
    embeddings = []

    for img in images:
        temp_path = f"temp_{uuid.uuid4()}.jpg"

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(img.file, buffer)

        result = DeepFace.represent(
            img_path=temp_path,
            model_name="Facenet",
            enforce_detection=False
        )

        embeddings.append(result[0]["embedding"])
        os.remove(temp_path)

    DB[employeeId] = embeddings

    return {
        "employeeId": employeeId,
        "embeddingsStored": len(embeddings),
        "vectorSize": len(embeddings[0])
    }
# =========================================================
# VERIFY FACE
# =========================================================
@app.post("/face/verify")
async def verify_face(
    image: UploadFile = File(...),
    employeeId: str = Form(...)
):
    try:
        # 1️⃣ Save image
        os.makedirs("temp", exist_ok=True)
        temp_path = f"temp/{uuid.uuid4()}.jpg"

        with open(temp_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

        # 2️⃣ Check registration
        if employeeId not in DB:
            return {"success": False, "message": "Employee not registered"}

        # 3️⃣ Generate embedding
        result = DeepFace.represent(
            img_path=temp_path,
            model_name="Facenet",
            enforce_detection=True
        )

        live_embedding = result[0]["embedding"]

        # 4️⃣ Compare with stored embeddings
        best_score = 0

        for stored_embedding in DB[employeeId]:
            score = cosine_similarity(live_embedding, stored_embedding)
            best_score = max(best_score, score)

        os.remove(temp_path)

        VERIFIED_THRESHOLD = 0.7  # cosine similarity
        verified = best_score >= VERIFIED_THRESHOLD

        return {
            "success": True,
            "verified": verified,
            "similarity": round(float(best_score), 3)
        }

    except Exception as e:
        print("❌ VERIFY ERROR:", e)
        return {"success": False, "error": str(e)}