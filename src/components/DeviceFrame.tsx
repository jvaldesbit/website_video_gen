import type { DeviceType } from '../types/conversation';
import { useStore } from '@nanostores/preact';
import { conversationConfig, isPlaying } from '../store/conversationStore';
import type { ComponentChildren } from 'preact';
import StatusBar from './StatusBar';

interface Props {
    children: ComponentChildren;
}

export default function DeviceFrame({ children }: Props) {
    const config = useStore(conversationConfig);
    const device: DeviceType = config?.device || 'iphone15';
    const theme = config?.theme || 'whatsapp-light';

    // Base styles for the outer shell
    const deviceStyles = {
        iphone15: "w-[393px] h-[852px] rounded-[55px] border-[12px] bg-black shadow-2xl relative overflow-hidden ring-4 ring-slate-800/50",
        android: "w-[380px] h-[820px] rounded-[32px] border-[10px] bg-black shadow-xl relative overflow-hidden ring-2 ring-slate-700/50",
        tablet: "w-[820px] h-[1180px] rounded-[40px] border-[16px] border-[#1a1a1a] bg-black shadow-2xl relative overflow-hidden ring-4 ring-slate-800/50 scale-[0.65] origin-center",
        desktop: "w-[1024px] h-[700px] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-slate-800 scale-[0.85] origin-top",
    };

    // Inner screen container
    const screenStyles = {
        iphone15: "h-full w-full bg-white relative overflow-hidden rounded-[44px]",
        android: "h-full w-full bg-white relative overflow-hidden rounded-[22px]",
        tablet: "h-full w-full bg-white relative overflow-hidden rounded-[24px]",
        desktop: "h-full w-full bg-white relative overflow-hidden rounded-b-lg",
    };

    // Notch / Camera / Window Controls
    const notchStyles = {
        iphone15: (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-50 flex items-center justify-center gap-3 px-4 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-[#1a1a1a]/50"></div>
                <div className="w-16 h-16 rounded-full bg-transparent"></div>
            </div>
        ),
        android: (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-1 ring-slate-800/50 pointer-events-none"></div>
        ),
        tablet: (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-6 z-50 pointer-events-none flex justify-center">
                <div className="w-2 h-2 bg-black/80 rounded-full mt-2"></div>
            </div>
        ),
        desktop: (
            <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2 z-50 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 text-center text-xs text-slate-400 font-medium">WhatsApp Web</div>
            </div>
        ),
    };

    const borderColor = config?.settings?.borderColor || '#9333ea'; // Default to purple-600

    const playing = useStore(isPlaying);

    const roundedStyles = {
        iphone15: "rounded-[55px]",
        android: "rounded-[32px]",
        tablet: "rounded-[40px]",
        desktop: "rounded-xl",
    };

    return (
        <div className={`relative z-0 transition-all duration-500 ${playing ? 'aurora-glow' : ''} ${roundedStyles[device]}`}>
            <div
                className={`device-frame transition-all duration-500 ease-in-out ${deviceStyles[device]} mx-auto my-8 !m-0`}
                style={{ borderColor: device === 'iphone15' || device === 'android' || device === 'tablet' ? borderColor : undefined }}
            >
                {/* Hardware Buttons (iPhone/Android only) */}
                {(device === 'iphone15' || device === 'android') && (
                    <>
                        <div className="absolute top-24 -left-[14px] w-[2px] h-8 bg-slate-700 rounded-l-md"></div>
                        <div className="absolute top-40 -left-[14px] w-[2px] h-12 bg-slate-700 rounded-l-md"></div>
                        <div className="absolute top-56 -left-[14px] w-[2px] h-12 bg-slate-700 rounded-l-md"></div>
                        <div className="absolute top-32 -right-[14px] w-[2px] h-16 bg-slate-700 rounded-r-md"></div>
                    </>
                )}

                {notchStyles[device]}

                <div className={screenStyles[device]}>
                    {/* Status Bar Overlay */}
                    <StatusBar device={device} theme={theme} />

                    {/* Desktop needs padding for the top bar */}
                    <div className={`h-full w-full ${device === 'desktop' ? 'pt-8' : ''}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
