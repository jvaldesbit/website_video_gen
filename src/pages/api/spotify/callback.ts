import type { APIRoute } from 'astro';

const client_id = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID?.trim();
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET?.trim();

export const GET: APIRoute = async ({ url, redirect }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    // Hardcoded to ensure HTTPS on tunnel
    const redirect_uri = 'https://video-gen.visabot.com.co/api/spotify/callback';

    if (!code) {
        return redirect('/?error=missing_code&details=The+callback+URL+did+not+contain+an+authorization+code');
    }

    if (!client_id || !client_secret) {
        console.error('[Spotify Callback] Missing credentials');
        return redirect('/?error=server_error&details=missing_credentials');
    }

    // if (state === null) {
    //     return redirect('/?error=state_mismatch');
    // }

    const params = new URLSearchParams();
    params.append('code', code!);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');

    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    };

    try {
        console.log('[Spotify Callback] Exchanging code for token...');
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();

        if (response.ok) {
            const { access_token, refresh_token, expires_in } = data;
            const expires_at = Date.now() + expires_in * 1000;

            // Redirect back to home with tokens in URL hash or query params
            // Using query params for simplicity in parsing on client
            const redirectParams = new URLSearchParams({
                access_token,
                refresh_token,
                expires_at: expires_at.toString()
            });

            return redirect(`/?${redirectParams.toString()}`);
        } else {
            return redirect(`/?error=invalid_token&details=${JSON.stringify(data)}`);
        }
    } catch (error) {
        return redirect(`/?error=server_error&details=${error}`);
    }
};
