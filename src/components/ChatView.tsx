import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { visibleMessages, conversationConfig } from '../store/conversationStore';
import MessageBubble from './MessageBubble';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';

export default function ChatView() {
    const messages = useStore(visibleMessages);
    const config = useStore(conversationConfig);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!config) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-[#efe7dd]">
                <p>Load a JSON to start</p>
            </div>
        );
    }

    const isDark = config.theme === 'whatsapp-dark';
    const bgImage = isDark
        ? "/background-dark.png"
        : "/background-light.png";

    // Safe area padding based on device
    let paddingTop = '';
    let paddingBottom = '';

    switch (config.device) {
        case 'iphone15':
            paddingTop = 'pt-12'; // Dynamic Island
            paddingBottom = 'pb-1'; // Home Indicator
            break;
        case 'android':
            paddingTop = 'pt-8'; // Camera hole
            paddingBottom = 'pb-4'; // Navigation bar
            break;
        default:
            paddingTop = '';
            paddingBottom = '';
    }

    return (
        <div className={`chat-view w-full h-full flex flex-col relative ${isDark ? 'bg-[#0b141a]' : 'bg-[#efe7dd]'}`}>
            <div
                className="absolute inset-0 z-0"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>

            {/* Dark mode overlay to dampen the background pattern */}
            {isDark && <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none"></div>}

            <div className={`${paddingTop} ${isDark ? 'bg-[#202c33]' : 'bg-[#008069]'} transition-all relative z-10`}>
                <ChatHeader theme={config.theme} />
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 z-10 space-y-2 scroll-smooth no-scrollbar"
                ref={containerRef}
            >
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        theme={config.theme}
                        showAvatar={config.settings.showAvatar}
                        showTicks={config.settings.showTicks}
                    />
                ))}
            </div>

            <div className={`${paddingBottom} ${isDark ? 'bg-[#202c33]' : 'bg-[#f0f2f5]'} transition-all relative z-10`}>
                <ChatFooter theme={config.theme} />
            </div>
        </div>
    );
}
