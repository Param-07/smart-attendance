from backend.app.ai.loaders.insightface_loader import InsightFaceLoader

model = InsightFaceLoader.get_model()

print(type(model))
print("InsightFace loaded successfully.")