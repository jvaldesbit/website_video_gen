import type { APIRoute } from 'astro';

const client_id = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const refresh_token = body.refresh_token;

    if (!refresh_token) {
        return new Response(JSON.stringify({ error: 'Missing refresh_token' }), { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify({
                access_token: data.access_token,
                refresh_token: data.refresh_token || refresh_token, // Fallback
                expires_in: data.expires_in
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify(data), { status: response.status });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
