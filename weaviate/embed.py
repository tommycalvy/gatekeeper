from langchain.vectorstores.weaviate import Weaviate
from transformers import pipeline
import weaviate

client = weaviate.Client("http://localhost:8080")

vectorstore = Weaviate(client, "PodClip", "content")