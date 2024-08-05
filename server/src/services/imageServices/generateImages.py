from openai import OpenAI
from dotenv import load_dotenv
import os
import requests

success = load_dotenv('/Users/gazirahman/projects/br.io/server/src/services/imageServices/keys.env')
client = OpenAI(api_key = os.getenv('OPENAI_API_KEY'))

def generateStoryViaOpenAI(prompt: str, model: str = 'gpt-3.5-turbo'):
    response = client.chat.completions.create(
        model = model,
        messages = [{'role': 'user', 'content': f'Generate a silly, dramatic story using 8 very simple sentences about the following prompt: "{prompt}". Strictly mark the start of each sentence with the substring "[start]".'}]
    )
    story_unstructured = response.choices[0].message.content 
    story = [sentence for sentence in story_unstructured.lower().split('[start]') if sentence]
    return story

def generateSingleImageViaOpenAI(prompt: str, model: str = 'dall-e-3'):
    response = client.images.generate(
        model = model,
        prompt = prompt,
        size = "1024x1024",
        quality = "standard",
        n = 1
    )
    image_url = response.data[0].url
    return image_url

def generateImagesViaOpenAI(story: str):
    for i in range(len(story)):
        sentence = story[i]
        prompt = f'Generate a silly, dramatic, photorealistic 3D image that depicts the following: "{sentence}"'
        image_url = generateSingleImageViaOpenAI(prompt)
        content = requests.get(image_url).content
        with open(f'/Users/gazirahman/projects/br.io/public/generated/images/image_{i+1}.jpeg', "wb") as image_file:
            image_file.write(content)
        print(sentence)
    return True

def main():
    story = generateStoryViaOpenAI('Cats')
    successful = generateImagesViaOpenAI(story)
    if successful: print("All is well")

if __name__ == "__main__":
    main()