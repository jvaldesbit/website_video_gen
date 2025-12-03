import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { isPlaying, conversationConfig } from '../store/conversationStore';

export default function AudioPlayer() {
    const playing = useStore(isPlaying);
    const config = useStore(conversationConfig);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }
    }, []);

    // Handle config changes (source and volume)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !config?.music) return;

        // Only play if type is 'file' (or undefined for backward compatibility)
        if (config.music.type && config.music.type !== 'file') {
            audio.pause();
            return;
        }

        if (!config.music.url) return;

        // Only update src if it changed to avoid reloading
        if (audio.src !== config.music.url) {
            audio.src = config.music.url;
        }

        audio.volume = config.music.volume ?? 0.5;
    }, [config]);

    // Handle play/pause state
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !config?.music) return;

        if (config.music.type && config.music.type !== 'file') return;

        if (playing && config.music.url) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio playback failed:", error);
                });
            }
        } else {
            audio.pause();
        }
    }, [playing, config]);

    return null; // Headless component
}
