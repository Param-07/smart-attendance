import cv2

from app.ai.liveness.anti_spoof_model import LivenessModel
from app.services.face.face_detection_service import FaceDetectionService

image = cv2.imread(r"C:\Users\thear\OneDrive\Pictures\Screenshots\Screenshot 2026-08-02 152619.png")

detector = FaceDetectionService()

face = detector.detect_single_face(image)

model = LivenessModel()

result = model.predict(
    image=image,
    face=face,
)

print(result)