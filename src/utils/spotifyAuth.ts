// Spotify PKCE Auth Flow

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const REDIRECT_URI = 'http://localhost:4321/'; // Must match Spotify Dashboard

// Generate a random string for state and code verifier
function generateRandomString(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Hash the code verifier
async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('spotify_verifier', verifier);

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', REDIRECT_URI);
    params.append('scope', 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function getAccessToken(clientId: string, code: string) {
    const verifier = localStorage.getItem('spotify_verifier');

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', verifier!);

    const result = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const { access_token, refresh_token, expires_in } = await result.json();

    // Calculate expiry time
    const expiresAt = Date.now() + expires_in * 1000;

    return { access_token, refresh_token, expires_at: expiresAt };
}

export async function refreshAccessToken(clientId: string, refreshToken: string) {
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const result = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const { access_token, refresh_token, expires_in } = await result.json();
    const expiresAt = Date.now() + expires_in * 1000;

    return {
        access_token,
        refresh_token: refresh_token || refreshToken, // Fallback if new one not provided
        expires_at: expiresAt
    };
}

export function setSpotifyToken(token: string, refresh: string, expiresAt: number) {
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_refresh_token', refresh);
    localStorage.setItem('spotify_expires_at', expiresAt.toString());
}
