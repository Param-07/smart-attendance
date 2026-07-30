from app.ai.loaders.antispoof_loader import AntiSpoofLoader

session = AntiSpoofLoader.get_session()

print("=" * 60)
print("INPUTS")
print("=" * 60)

for inp in session.get_inputs():
    print(f"Name : {inp.name}")
    print(f"Shape: {inp.shape}")
    print(f"Type : {inp.type}")

print()

print("=" * 60)
print("OUTPUTS")
print("=" * 60)

for out in session.get_outputs():
    print(f"Name : {out.name}")
    print(f"Shape: {out.shape}")
    print(f"Type : {out.type}")