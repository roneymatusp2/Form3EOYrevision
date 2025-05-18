const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1';

export const mistralService = {
    async generateResponse(prompt: string) {
        try {
            const response = await fetch(`${MISTRAL_API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-small',
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error(`Mistral API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling Mistral API:', error);
            throw error;
        }
    }
};
