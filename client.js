import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
import { access_token, lora_name, trigger_word, img_size, num_steps, download_image } from './config.js';
let image_counter = 0;

//Initialize the client and the UI
async function init() {
    const client = await Client.connect("kratadata/fhnw-image-lora", { hf_token: access_token });
    const genInfo = document.getElementById('info')
    let result;
    document.getElementById('generate').addEventListener('click', async () => {
        const prompt = document.getElementById('prompt').value;
        genInfo.innerText = "Generating image, please wait...";
        
        try {
            result = await client.predict("/infer", { 		
                prompt: prompt + " in the style of " + trigger_word, 
                lora: "kratadata/" + lora_name, 		
                seed: 0, 		
                randomize_seed: true, 		
                width: img_size, 		
                height: img_size, 		
                num_inference_steps: num_steps, 
            });
            
        } catch (error) {
            console.error("Error occurred during prediction:", error);
            genInfo.innerText = `Error occurred: ${error.message}`;
            return; 
        }

        if (result.error) {
            console.error("Error in result:", result.error);
            genInfo.innerText = `Error in result: ${result.error}`;
            return; 
        }
        console.log(result); 

        const imageUrl = result.data[0].url; 
        if (typeof imageUrl === 'string') {

            const img = document.createElement('img');
            img.src = imageUrl; 
            document.getElementById('result').innerHTML = ''; 
            document.getElementById('result').appendChild(img);
            genInfo.innerText = "Image generated successfully!";
            addToGalery(imageUrl);

            if (download_image) {
                img.onload = () => {
                  //  downloadImage(imageUrl);
                };
            }
        } else {
            console.error("Expected a string URL but got:", imageUrl);
            genInfo.innerText = "Error: Invalid image URL."; 
        }

        
    });
}

//Automatically download the generated image
function downloadImage(imageUrl) {
    image_counter++;
    fetch(imageUrl)
        .then(response => response.blob() ) 
        .then(blob => {
            console.log(blob);
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob); 
            a.href = url;
            a.download = lora_name + '_' + image_counter + '.webp';
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a); 
            URL.revokeObjectURL(url); 
        })
        .catch(error => console.error('Error downloading the image:', error));
}

//Display all generated images
function addToGalery(imageUrl) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    const galleryImg = document.createElement('img');
    galleryImg.src = imageUrl;
    galleryItem.appendChild(galleryImg);
    document.getElementById('gallery').appendChild(galleryItem);
}

init(); 