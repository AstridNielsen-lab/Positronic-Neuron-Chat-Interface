const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAuFi5KtPsMJI5IC8c5FjvYD5IbuBdwH_U";

export async function generateThought(prompt: string, type: string): Promise<string> {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Gere uma resposta em português do Brasil com ${type === 'concrete' ? 'pensamento concreto' : 
                 type === 'abstract' ? 'pensamento abstrato' : 
                 type === 'critical' ? 'pensamento crítico' : 
                 type === 'intuitive' ? 'pensamento intuitivo' : 
                 'pensamento reflexivo'} para: ${prompt}. Mantenha a resposta concisa e focada neste tipo de pensamento.`
        }]
      }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}