from app.ai.loaders.liveness_loader import LivenessLoader

session = LivenessLoader.get_session()

print(session.get_inputs())
print(session.get_outputs())