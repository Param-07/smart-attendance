from app.ai.preprocessing.image_utils import ImageUtils

image = ImageUtils.read_image("your_image_path")
ImageUtils.validate_image(image)

print(ImageUtils.get_image_size(image))