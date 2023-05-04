Demarcait's Gatekeeper
=====================
The Self Hosted Enterprise Chatbot

Work in progress...  


Upcoming Features:  
- Connect to any public facing chatbot ai
- Create access roles as an administrator
- Designate data access for each chatbot
- Search saved prompts and chat history
- Regulate response from chatbots


Download a llama model compatible with llama.cpp and put it in the models folder.
Make sure the environment variable `MODEL` and `MODEL_PATH` in the docker-compose.yml file are set to the relative path of the model.

Depending on how much memory you have you can download different models with different levels of quantization.
I recommend the 7B or 13B Vicuna model which is a fine tuned version of the llama model from meta.   
 
https://huggingface.co/eachadea/ggml-vicuna-7b-1.1   
https://huggingface.co/eachadea/ggml-vicuna-13b-1.1   

Then simply:
`docker compose up`