import type { ThemeType } from '../types/conversation';
import { IoAdd, IoCamera, IoMic, IoHappyOutline } from 'react-icons/io5';

interface Props {
    theme: ThemeType;
}

export default function ChatFooter({ theme }: Props) {
    const isDark = theme === 'whatsapp-dark';

    return (
        <div className={`
      w-full min-h-[60px] flex items-center px-3 gap-2 z-20 shrink-0 pb-6 pt-2
      ${isDark ? 'bg-[#202c33] text-[#8696a0]' : 'bg-[#f0f2f5] text-[#54656f]'}
    `}>
            <button className="p-1">
                <IoAdd size={30} />
            </button>

            <div className={`
        flex-1 flex items-center rounded-2xl px-4 py-2 gap-2
        ${isDark ? 'bg-[#2a3942]' : 'bg-white'}
      `}>
                <div className={`flex-1 text-[17px] leading-5 ${isDark ? 'text-[#d1d7db]' : 'text-gray-600'}`}>
                    {/* Placeholder text would go here if we had an input, using div for visual sim */}
                </div>
                <button className="text-gray-500">
                    <IoHappyOutline size={24} />
                </button>
            </div>

            <button className="p-1">
                <IoCamera size={26} />
            </button>

            <button className="p-1">
                <IoMic size={26} />
            </button>
        </div>
    );
}
