from supabase import Client
from werkzeug.datastructures import FileStorage

from app.extensions import supabase


class StorageService:

    def __init__(self):
        self.client: Client = supabase

    def upload_file(self, bucket_name: str, file_path: str, file: FileStorage, content_type: str | None = None) -> str:

        file.stream.seek(0)

        self.client.storage.from_(bucket_name).upload(
            path= file_path,
            file= file.stream,
            file_options= {
                "content-type": content_type or file.content_type,
                "upsert": False
            }
        )

        return file_path

    def delete_file(self, bucket_name: str, file_path: str) -> None:

        self.client.storage.from_(bucket_name).remove(
            [file_path]
        )

    def get_public_url(self, bucket_name:str, file_path: str) -> str:

        return (
            self.client.storage.from_(bucket_name)
                .get_public_url(file_path)
        )