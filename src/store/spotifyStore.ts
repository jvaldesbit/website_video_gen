import { atom, map } from 'nanostores';

export interface SpotifyState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    deviceId: string | null;
    isConnected: boolean;
    user: {
        display_name?: string;
        images?: { url: string }[];
    } | null;
}

export const spotifyStore = map<SpotifyState>({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    deviceId: null,
    isConnected: false,
    user: null
});

export const spotifyPlayer = atom<Spotify.Player | null>(null);

// updateSpotifyStore replaces the old setSpotifyToken to avoid confusion
export function updateSpotifyStore(token: string, refresh: string, expiresAt: number) {
    spotifyStore.setKey('accessToken', token);
    spotifyStore.setKey('refreshToken', refresh);
    spotifyStore.setKey('expiresAt', expiresAt);

    // Persist
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_refresh_token', refresh);
    localStorage.setItem('spotify_expires_at', expiresAt.toString());
}

export function loadSpotifyTokenFromStorage() {
    const token = localStorage.getItem('spotify_access_token');
    const refresh = localStorage.getItem('spotify_refresh_token');
    const expiresAt = localStorage.getItem('spotify_expires_at');

    if (token && refresh && expiresAt) {
        spotifyStore.setKey('accessToken', token);
        spotifyStore.setKey('refreshToken', refresh);
        spotifyStore.setKey('expiresAt', parseInt(expiresAt));
        return true;
    }
    return false;
}

export async function refreshAccessToken() {
    const refreshToken = spotifyStore.get().refreshToken;
    if (!refreshToken) return null;

    try {
        const response = await fetch('/api/spotify/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            const expiresAt = Date.now() + data.expires_in * 1000;
            updateSpotifyStore(data.access_token, data.refresh_token, expiresAt);
            return data.access_token;
        }
    } catch (e) {
        console.error("Failed to refresh token", e);
    }
    return null;
}

export function logoutSpotify() {
    spotifyStore.set({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        deviceId: null,
        isConnected: false,
        user: null
    });
    spotifyPlayer.set(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_at');
}
