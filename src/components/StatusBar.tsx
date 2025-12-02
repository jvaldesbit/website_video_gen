import { useState, useEffect } from 'preact/hooks';
import type { DeviceType, ThemeType } from '../types/conversation';
import { IoWifi, IoCellular, IoBatteryFull } from 'react-icons/io5';

interface Props {
    device: DeviceType;
    theme: ThemeType;
}

export default function StatusBar({ device, theme }: Props) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const isDark = theme === 'whatsapp-dark';
    const textColor = isDark ? 'text-white' : 'text-black'; // Usually status bar adapts or is white on dark header

    // Android Specific Layout
    if (device === 'android') {
        return (
            <div className={`absolute top-0 left-0 w-full h-8 flex items-center justify-between px-4 z-50 text-xs font-medium ${textColor}`}>
                <div className="flex items-center gap-2">
                    <span>{time}</span>
                    <div className="flex items-center gap-1 text-[10px] opacity-80">
                        <IoWifi size={14} />
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <IoCellular size={14} />
                    <div className="rotate-90 flex items-center justify-center">
                        <IoBatteryFull size={16} />
                    </div>
                    <span className="text-[10px]">85%</span>
                </div>
            </div>
        );
    }

    // iPhone Specific Layout
    if (device === 'iphone15') {
        return (
            <div className={`absolute top-0 left-0 w-full h-12 flex items-center justify-between px-6 z-50 text-sm font-semibold ${textColor}`}>
                <div className="w-[100px] flex justify-center translate-y-1">
                    {time}
                </div>
                <div className="w-[100px] flex justify-center gap-1.5 translate-y-1">
                    <IoCellular size={16} />
                    <IoWifi size={16} />
                    <IoBatteryFull size={20} />
                </div>
            </div>
        );
    }

    return null; // No status bar for tablet/desktop for now or simple one
}
