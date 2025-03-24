import { json } from '@sveltejs/kit';

// @ts-ignore
export async function POST({ request }) {
    const { message } = await request.json();

    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'mistral',
            prompt: message,
            stream: false
        })
    });

    const data = await response.json();
    return json({ reply: data.response });
}
