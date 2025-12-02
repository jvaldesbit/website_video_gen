import type { ThemeType } from '../types/conversation';
import { IoArrowBack, IoVideocam, IoCall } from 'react-icons/io5';
import { useStore } from '@nanostores/preact';
import { isTyping } from '../store/conversationStore';

interface Props {
    theme: ThemeType;
}

export default function ChatHeader({ theme }: Props) {
    const typing = useStore(isTyping);

    const isDark = theme === 'whatsapp-dark';

    return (
        <div className={`
      w-full h-[60px] flex items-center px-2 gap-2 z-20 shrink-0
      ${isDark ? 'bg-[#202c33] text-[#aebac1]' : 'bg-[#008069] text-white'}
    `}>
            <div className="flex items-center gap-1">
                <button className="p-1">
                    <IoArrowBack size={24} />
                </button>
                <div className="w-9 h-9 rounded-full bg-[#00ff9d] overflow-hidden">
                    <img src="/avatar.png" alt="VB" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center cursor-pointer">
                <span className={`font-semibold text-base leading-tight ${isDark ? 'text-[#e9edef]' : 'text-white'}`}>
                    VisaBot
                </span>
                <span className={`text-xs leading-tight ${typing ? 'text-[#00ff9d] font-medium' : 'text-slate-200/80'}`}>
                    {typing ? 'escribiendo...' : 'Business Account'}
                </span>
            </div>

            <div className="flex items-center gap-4 px-2">
                <button>
                    <IoVideocam size={24} />
                </button>
                <button>
                    <IoCall size={24} />
                </button>
            </div>
        </div>
    );
}
