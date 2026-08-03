import onnxruntime as ort

MODEL_PATH = "backend/app/ai/models/anti_spoof.onnx"

session = ort.InferenceSession(
    MODEL_PATH,
    providers=["CPUExecutionProvider"],
)

print("=" * 60)
print("MODEL INPUTS")
print("=" * 60)

for inp in session.get_inputs():
    print(f"Name : {inp.name}")
    print(f"Shape: {inp.shape}")
    print(f"Type : {inp.type}")
    print()

print("=" * 60)
print("MODEL OUTPUTS")
print("=" * 60)

for out in session.get_outputs():
    print(f"Name : {out.name}")
    print(f"Shape: {out.shape}")
    print(f"Type : {out.type}")
    print()