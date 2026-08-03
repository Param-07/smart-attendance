from insightface.app.common import Face
from app.ai.loaders.insightface_loader import InsightFaceLoader

class FaceDetectionService:

    def __init__(self):

        self.model = InsightFaceLoader.get_model()

    def detect_faces(self, image) -> list[Face]:

        return self.model.get(image)

    def detect_single_face(self, image) -> Face:

        faces = self.detect_faces(image)

        if len(faces) == 0:
            raise ValueError("No face detected.")

        if len(faces) > 1:
            raise ValueError("Multiple faces detected.")

        return faces[0]