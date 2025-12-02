import { atom, map } from 'nanostores';
import type { ConversationConfig, Message } from '../types/conversation';

export const isPlaying = atom(false);
export const isTyping = atom(false);
export const currentMessageIndex = atom(-1);
export const playbackSpeed = atom(1);
export const conversationConfig = map<ConversationConfig | null>(null);

export const visibleMessages = atom<Message[]>([]);

// Actions
export function loadConversation(config: ConversationConfig) {
    conversationConfig.set(config);
    currentMessageIndex.set(-1);
    visibleMessages.set([]);
    isPlaying.set(false);
    isTyping.set(false);
    playbackSpeed.set(config.settings.autoplaySpeed || 1);
}

export function resetConversation() {
    currentMessageIndex.set(-1);
    visibleMessages.set([]);
    isPlaying.set(false);
    isTyping.set(false);
}

export function nextMessage() {
    const config = conversationConfig.get();
    if (!config) return;

    const currentIndex = currentMessageIndex.get();

    // 1. Show the next message (if available)
    if (currentIndex < config.conversation.length - 1) {
        const nextIndex = currentIndex + 1;
        currentMessageIndex.set(nextIndex);
        visibleMessages.set(config.conversation.slice(0, nextIndex + 1));

        // 2. Predict if the *following* message is from Vi to show typing indicator
        // We are now at nextIndex. We want to know about nextIndex + 1.
        if (nextIndex < config.conversation.length - 1) {
            const followingMessage = config.conversation[nextIndex + 1];
            if (followingMessage.sender === 'vi') {
                isTyping.set(true);
            } else {
                isTyping.set(false);
            }
        } else {
            isTyping.set(false);
        }
    } else {
        isPlaying.set(false);
        isTyping.set(false);
    }
}

export function setSpeed(speed: number) {
    playbackSpeed.set(speed);
}

export function togglePlay() {
    const playing = !isPlaying.get();
    isPlaying.set(playing);
    if (!playing) {
        isTyping.set(false);
    } else {
        // If resuming, check if we should be typing
        const config = conversationConfig.get();
        const currentIndex = currentMessageIndex.get();

        // Default to false
        let shouldType = false;

        if (config && currentIndex < config.conversation.length - 1) {
            const nextMsg = config.conversation[currentIndex + 1];
            if (nextMsg.sender === 'vi') {
                shouldType = true;
            }
        }

        isTyping.set(shouldType);
    }
}
