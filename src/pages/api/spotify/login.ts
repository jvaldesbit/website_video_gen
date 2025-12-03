import type { APIRoute } from 'astro';

const client_id = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID?.trim();

const generateRandomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export const GET: APIRoute = async ({ request, redirect }) => {
    const state = generateRandomString(16);
    const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

    // Hardcoded to ensure HTTPS on tunnel
    const redirect_uri = 'https://video-gen.visabot.com.co/api/spotify/callback';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: 'true'
    });

    return redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};
