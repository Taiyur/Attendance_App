from deepface import DeepFace

embedding = DeepFace.represent(
    img_path="test.jpg",
    model_name="Facenet",
    enforce_detection=False
)

print(len(embedding[0]["embedding"]))
