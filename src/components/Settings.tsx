import { useState } from 'preact/hooks';
import { loadConversation, conversationConfig } from '../store/conversationStore';
import type { ConversationConfig, DeviceType, ThemeType } from '../types/conversation';
import { IoCodeSlash, IoMoon, IoSunny, IoPhonePortrait, IoTabletPortrait, IoDesktop, IoLogoAndroid, IoLogoApple, IoDocumentText, IoCheckmark } from 'react-icons/io5';
import { spotifyStore, logoutSpotify } from '../store/spotifyStore';
import { redirectToAuthCodeFlow } from '../utils/spotifyAuth';
import { useStore } from '@nanostores/preact';

const PRESETS = [
    {
        id: 'iphone-dark-purple',
        name: 'iPhone 15 Pro (Dark)',
        desc: 'Purple Border',
        icon: IoPhonePortrait,
        config: {
            device: 'iphone15' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#9333ea' }
        }
    },
    {
        id: 'iphone-light-silver',
        name: 'iPhone 15 Pro (Light)',
        desc: 'Silver Border',
        icon: IoPhonePortrait,
        config: {
            device: 'iphone15' as DeviceType,
            theme: 'whatsapp-light' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#e2e8f0' }
        }
    },
    {
        id: 'iphone-dark-gold',
        name: 'iPhone 15 Pro (Gold)',
        desc: 'Gold Border',
        icon: IoPhonePortrait,
        config: {
            device: 'iphone15' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#fbbf24' }
        }
    },
    {
        id: 'iphone-forest',
        name: 'iPhone 15 (Forest)',
        desc: 'Dark Green Border',
        icon: IoPhonePortrait,
        config: {
            device: 'iphone15' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#14532d' }
        }
    },
    {
        id: 'android-dark-black',
        name: 'Android Pixel (Dark)',
        desc: 'Black Border',
        icon: IoPhonePortrait,
        config: {
            device: 'android' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#1a1a1a' }
        }
    },
    {
        id: 'android-light-blue',
        name: 'Android Pixel (Light)',
        desc: 'Blue Border',
        icon: IoPhonePortrait,
        config: {
            device: 'android' as DeviceType,
            theme: 'whatsapp-light' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#3b82f6' }
        }
    },
    {
        id: 'samsung-titanium',
        name: 'Samsung Galaxy',
        desc: 'Titanium Border',
        icon: IoPhonePortrait,
        config: {
            device: 'android' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#475569' }
        }
    },
    {
        id: 'android-coral',
        name: 'Android (Coral)',
        desc: 'Coral Border',
        icon: IoPhonePortrait,
        config: {
            device: 'android' as DeviceType,
            theme: 'whatsapp-light' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#f97316' }
        }
    },
    {
        id: 'ipad-light',
        name: 'iPad Pro (Light)',
        desc: 'Silver Border',
        icon: IoTabletPortrait,
        config: {
            device: 'tablet' as DeviceType,
            theme: 'whatsapp-light' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#e2e8f0' }
        }
    },
    {
        id: 'ipad-dark',
        name: 'iPad Pro (Dark)',
        desc: 'Space Gray Border',
        icon: IoTabletPortrait,
        config: {
            device: 'tablet' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#334155' }
        }
    },
    {
        id: 'desktop-light',
        name: 'Desktop / Web',
        desc: 'Light Theme',
        icon: IoDesktop,
        config: {
            device: 'desktop' as DeviceType,
            theme: 'whatsapp-light' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false }
        }
    },
    {
        id: 'desktop-dark',
        name: 'Desktop / Web',
        desc: 'Dark Theme',
        icon: IoDesktop,
        config: {
            device: 'desktop' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false }
        }
    },
    {
        id: 'formatting-showcase',
        name: 'Formatting Showcase',
        desc: 'Bold, Italic, Links, etc.',
        icon: IoDocumentText,
        config: {
            device: 'iphone15' as DeviceType,
            theme: 'whatsapp-dark' as ThemeType,
            settings: { autoplaySpeed: 1.0, showAvatar: true, showTicks: false, borderColor: '#9333ea' }
        }
    }
];

export default function Settings() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'input' | 'presets'>('presets');
    const [borderColor, setBorderColor] = useState('#9333ea');

    const handleColorChange = (color: string) => {
        setBorderColor(color);
        try {
            const currentConfig = JSON.parse(jsonInput || '{}');
            if (currentConfig.settings) {
                currentConfig.settings.borderColor = color;
                const newJson = JSON.stringify(currentConfig, null, 2);
                setJsonInput(newJson);
                loadConversation(currentConfig);
            }
        } catch (e) {
            // Ignore
        }
    };

    const handleLoad = () => {
        try {
            const config: ConversationConfig = JSON.parse(jsonInput);
            if (!config.conversation || !Array.isArray(config.conversation)) {
                throw new Error("Invalid JSON: 'conversation' array is missing.");
            }
            loadConversation(config);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const loadPreset = (presetId: string) => {
        const preset = PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        let conversation = [
            { id: 1, sender: "user" as const, text: "Hola, Vi 👋 ¿me ayudas con mi cita?", timestamp: "2025-01-15 08:32" },
            { id: 2, sender: "vi" as const, text: "¡Hola! Claro que sí 😊 Envíame tu correo y país.", timestamp: "2025-01-15 08:33" },
            { id: 3, sender: "user" as const, image: "https://placehold.co/600x400", timestamp: "2025-01-15 08:34" },
            { id: 4, sender: "vi" as const, text: "Perfecto. Esta es tu actualización 👉 https://visabot.com.co", timestamp: "2025-01-15 08:35" }
        ];

        if (presetId === 'formatting-showcase') {
            conversation = [
                { id: 1, sender: "user" as const, text: "Hola Vi, ¿qué formatos de texto soportas?", timestamp: "10:00" },
                { id: 2, sender: "vi" as const, text: "¡Hola! Soporta varios formatos:\n\n*Texto en Negrita*\n_Texto en Cursiva_\n~Texto Tachado~\n```Código Monospace```\n\nY también enlaces: https://visabot.com.co", timestamp: "10:01" },
                { id: 3, sender: "user" as const, text: "¿Y combinados? *Like this?*", timestamp: "10:02" },
                { id: 4, sender: "vi" as const, text: "Sí, claro. _*Negrita y Cursiva*_ funciona perfecto.", timestamp: "10:02" }
            ];
        }

        const config: ConversationConfig = {
            ...preset.config,
            conversation: conversation
        };

        const jsonStr = JSON.stringify(config, null, 2);
        setJsonInput(jsonStr);
        if (config.settings?.borderColor) {
            setBorderColor(config.settings.borderColor);
        }
        loadConversation(config);
    };

    const spotifyState = useStore(spotifyStore);
    const isConnected = spotifyState.isConnected;

    const handleSpotifyLogin = () => {
        window.location.href = '/api/spotify/login';
    };

    const handleSpotifyLogout = () => {
        logoutSpotify();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configuration</h2>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 mb-4">
                <label className="text-xs text-slate-400 font-medium mb-2 block">Device Border Color</label>
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => handleColorChange((e.target as HTMLInputElement).value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-slate-300 font-mono">{borderColor}</span>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[500px]">
                <div className="flex border-b border-slate-800 shrink-0">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'input' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <IoCodeSlash size={16} /> JSON Input
                    </button>
                    <button
                        onClick={() => setActiveTab('presets')}
                        className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'presets' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <IoDocumentText size={16} /> Presets
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {activeTab === 'input' && (
                        <div className="space-y-3 h-full flex flex-col">
                            <textarea
                                className="w-full flex-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                value={jsonInput}
                                onInput={(e) => setJsonInput((e.target as HTMLTextAreaElement).value)}
                                placeholder='Paste your JSON configuration here...'
                            />

                            {error && (
                                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs shrink-0">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleLoad}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shrink-0"
                            >
                                <IoCheckmark size={16} /> Apply Configuration
                            </button>
                        </div>
                    )}

                    {activeTab === 'presets' && (
                        <div className="grid grid-cols-1 gap-3">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => loadPreset(preset.id)}
                                    className="w-full p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-left transition-all group flex items-center gap-3"
                                >
                                    <div className="p-2 bg-slate-700 rounded-lg text-slate-300 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                                        <preset.icon size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{preset.name}</div>
                                        <div className="text-xs text-slate-400 group-hover:text-slate-300">{preset.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spotify</h3>
                {!isConnected ? (
                    <button
                        onClick={handleSpotifyLogin}
                        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Connect Spotify
                    </button>
                ) : (
                    <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                        <span className="text-sm text-green-400 font-medium">Connected</span>
                        <button
                            onClick={handleSpotifyLogout}
                            className="text-xs text-slate-400 hover:text-white"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
