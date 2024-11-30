// Change the following parameters to customize the image generation

export const access_token = " "  // your huggingface access token

// trigger word "BRUNN"and lora_name "moritz-brunnmatt" --> Moritz
// trigger word "STUUEHL" and lora_name "mia-stuehle" --> Mia
// trigger word "BOODLE" and lora_name "luisa-doodle" --> Luisa
// trigger word "YOMICS" and lora_name "yoana-comics" --> Yoana

export const trigger_word = "BOODLE" 
export const lora_name = "luisa-doodle" 
export const img_size = 1024 // keep at 1024 for better quality, 512 to speed up generation
export const num_steps = 2 // keep at 2 for faster generation, change to 4 for better quality
export const download_image = true; // set to true to download the images