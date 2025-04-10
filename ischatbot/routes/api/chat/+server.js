import { json } from '@sveltejs/kit';

// @ts-ignore
export async function POST({ request }) {
    try {
        const { message } = await request.json();

        const response = await fetch('http://localhost:5173/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi4',
                prompt: message,
                stream: false
            })
        });

        if (!response.ok) {
            return json({ error: 'Failed.' }, { status: response.status });
        }

        const data = await response.json();
        return json({ reply: data.response });

    } catch (error) {
        return json({ error: 'Error' }, { status: 500 });
    }
}
