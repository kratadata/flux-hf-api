import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
import { secret_token, keyword, img_size, num_steps } from './config.js';

async function init() {
    const client = await Client.connect("kratadata/fhnw-image-lora", { hf_token: secret_token });
    const display = document.getElementById('display')

    document.getElementById('generate').addEventListener('click', async () => {
        const prompt = document.getElementById('prompt').value;
        let result;
        display.innerText = " ";
        
        try {
            result = await client.predict("/infer", { 		
                prompt: prompt + " in the style of " + keyword, 		
                seed: 0, 		
                randomize_seed: true, 		
                width: img_size, 		
                height: img_size, 		
                num_inference_steps: num_steps, 
            });
        } catch (error) {
            console.error("Error occurred during prediction:", error);
            display.innerText = `Error occurred: ${error.message}`;
            return; // Exit if there's an error
        }

        // Check for errors in the result
        if (result.error) {
            console.error("Error in result:", result.error);
            return; // Exit if there's an error in the result
        }

        // Start the timer only if no error occurred
        const startTime = new Date();
        let elapsedTime = 0;
        // Update the timer every second
        const timerInterval = setInterval(() => {
            elapsedTime = Math.round((new Date() - startTime) / 1000); // Calculate elapsed time in seconds
            display.innerText = `Elapsed time: ${elapsedTime} seconds`; // Update the display
        }, 1000);

        // Log the result and elapsed time
        console.log(result); // Log the entire result to inspect its structure

        const imageUrl = result.data[0].url; 
        if (typeof imageUrl === 'string') {
            // Stop the timer
            clearInterval(timerInterval);

            // Display the generated image
            const img = document.createElement('img');
            img.src = imageUrl; 
            document.getElementById('result').innerHTML = ''; 
            document.getElementById('result').appendChild(img);
        } else {
            console.error("Expected a string URL but got:", imageUrl);
        }

        // Stop the timer after processing the result
        clearInterval(timerInterval);
    });
}

init(); 