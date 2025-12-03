import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { isPlaying, conversationConfig } from '../store/conversationStore';
import { spotifyStore, spotifyPlayer, refreshAccessToken, updateSpotifyStore } from '../store/spotifyStore';

export default function SpotifyPlayer() {
    const playing = useStore(isPlaying);
    const config = useStore(conversationConfig);
    const { accessToken, refreshToken, deviceId, isConnected } = useStore(spotifyStore);
    const playerRef = useStore(spotifyPlayer);

    // Load Spotify SDK
    useEffect(() => {
        if (!window.Spotify) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                initializePlayer();
            };
        } else if (!playerRef) {
            initializePlayer();
        }
    }, [accessToken]);

    const initializePlayer = () => {
        if (!accessToken) return;

        const player = new window.Spotify.Player({
            name: 'VideoGen Studio',
            getOAuthToken: async (cb) => {
                // Check if token is expired
                const expiresAt = spotifyStore.get().expiresAt;
                if (expiresAt && Date.now() > expiresAt) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        cb(newToken);
                    } else {
                        console.error("Failed to refresh token");
                    }
                } else {
                    cb(accessToken);
                }
            },
            volume: 0.5
        });

        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            spotifyStore.setKey('deviceId', device_id);
            spotifyStore.setKey('isConnected', true);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            spotifyStore.setKey('isConnected', false);
        });

        player.connect();
        spotifyPlayer.set(player);
    };

    // Handle Play/Pause
    useEffect(() => {
        if (!playerRef || !deviceId || !config?.music || config.music.type !== 'spotify') return;

        const handlePlayback = async () => {
            if (playing) {
                // Play
                await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ uris: [config.music!.url] }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
            } else {
                // Pause
                await playerRef.pause();
            }
        };

        handlePlayback();

    }, [playing, deviceId, config]);

    // Handle Volume
    useEffect(() => {
        if (playerRef && config?.music?.volume !== undefined) {
            playerRef.setVolume(config.music.volume);
        }
    }, [config?.music?.volume, playerRef]);

    return null;
}
