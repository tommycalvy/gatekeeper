from langchain import HuggingFacePipeline
from langchain.prompts import PromptTemplate
from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter, CharacterTextSplitter
from transformers import pipeline
import os

EMB_INSTRUCTOR_XL = "hkunlp/instructor-xl"
LLM_FASTCHAT_T5_XL = "lmsys/fastchat-t5-3b-v1.0"

class RepoQA:
    question_check_template = """Given the following pieces of context, determine if the question is able to be answered by the information in the context.
Respond with 'yes' or 'no'.
{context}
Question: {question}
"""
    QUESTION_CHECK_PROMPT = PromptTemplate(
        template=question_check_template, input_variables=["context", "question"]
    )
    def __init__(self, config: dict={}):
        self.config = config
        self.embedding = None
        self.vectordb = None
        self.llm = None
        self.qa = None
    
    # The following class methods are useful to create global GPU model instances
    # This way we don't need to reload models in an interactive app,
    # and the same model instance can be used across multiple user sessions
    @classmethod
    def create_instructor_xl(cls):
        return HuggingFaceInstructEmbeddings(model_name=EMB_INSTRUCTOR_XL, model_kwargs={"device": "cuda"})

    @classmethod
    def create_fastchat_t5_xl(cls, load_in_8bit=False):
        return pipeline(
            task="text2text-generation",
            model = LLM_FASTCHAT_T5_XL,
            model_kwargs={"device_map": "auto", "load_in_8bit": load_in_8bit, "max_length": 512, "temperature": 0.}
        )
    
    def init_models(self) -> None:
        load_in_8bit = self.config["load_in_8bit"]

        if self.config["embedding"] == EMB_INSTRUCTOR_XL:
            if self.embedding is None:
                self.embedding = RepoQA.create_instructor_xl()
        else:
            raise ValueError("Invalid config")
        
        if self.config["llm"] == LLM_FASTCHAT_T5_XL:
            if self.llm is None:
                self.llm = RepoQA.create_fastchat_t5_xl(load_in_8bit=load_in_8bit)
        else:
            raise ValueError("Invalid config")
    
    def vectorize_repo(repo_path: str):
        print(repo_path)
        text_splitter = RecursiveCharacterTextSplitter(
            # Set a really small chunk size, just to show.
            chunk_size = 512,
            chunk_overlap  = 96,
            length_function = len,
        )
       
        for root, dir_names, file_names in os.walk(repo_path):
            for f in file_names:
                fname = os.path.join(root, f)
                if f.endswith('repository.go'):
                    print(fname)
                    with open(fname) as myfile:
                        doco = myfile.read()
                    texts = text_splitter.create_documents([doco])
                    for text in texts:
                        print(text, "\n\n")



    def get_answer(self, question: str) -> str:
        hf_llm = HuggingFacePipeline(pipeline=self.llm)
        self.qa = RepoQA.from_chain_type(llm=hf_llm, chain_type="stuff", retriever=self.vectordb.as_retriever(search_kwargs={"k":4}))