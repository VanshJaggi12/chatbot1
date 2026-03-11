const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function sendToGemini(message){

  try{

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          contents:[
            {
              parts:[
                { text: message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  }
  catch(error){

    console.error(error);
    return "Error fetching response.";

  }

}