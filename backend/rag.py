from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.core import Settings

from llama_index.core.postprocessor import MetadataReplacementPostProcessor
from llama_index.core import StorageContext, load_index_from_storage

Settings.llm = Ollama(
    model="llama3",
    request_timeout=30000.0,
    temperature=0
)
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en")


storage_context = StorageContext.from_defaults(persist_dir="Manual")

sentence_index = load_index_from_storage(storage_context)


query_engine = sentence_index.as_query_engine(
    similarity_top_k=3,
    
    context_prompt=(
        "You are a chatbot who should answer the user's query without adding anything from your prior knowledge and to the point "
        "Answer  only from the given context and DO NOT USE YOUR PRIOR KNOWLEDGE IN ANY CASE! Don't say anything that is not in the context."
        "If the answer is found directly in the context, try to answer as it is without changing the wordings much" 
        "IF the answer isn't from context, just say YOU DON'T KNOW THE ANSWER and DONOT TRY TO add Additional Info!"
        "If you are unsure of the answer, just say YOU DON'T KNOW THE ANSWER and DONOT TRY TO add Additional Info!"
        "If the user says 'don't help or I don't need help', just say okay and DONOT TRY TO add Additional Info!"
        "If the user greets you you must greet him nicely"
        ),
    # the target key defaults to `window` to match the node_parser's default
    node_postprocessors=[
        MetadataReplacementPostProcessor(target_metadata_key="window")
    ],
)
