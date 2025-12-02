import type { Message, ThemeType } from '../types/conversation';
import { formatMessageText } from '../utils/textFormatter';

interface Props {
    message: Message;
    theme: ThemeType;
    showAvatar?: boolean;
    showTicks?: boolean;
}

export default function MessageBubble({ message, theme, showAvatar = true, showTicks = false }: Props) {
    const isUser = message.sender === 'user';
    const isVi = message.sender === 'vi';
    const isDark = theme === 'whatsapp-dark';

    let bubbleClass = "";
    let textClass = "";
    let timeClass = "";

    if (isDark) {
        // Dark Mode
        if (isUser) {
            bubbleClass = "bg-[#005c4b] self-end rounded-tr-none"; // Dark Green
            textClass = "text-[#e9edef]";
            timeClass = "text-[#8696a0]";
        } else {
            bubbleClass = "bg-[#202c33] self-start rounded-tl-none"; // Dark Gray
            textClass = "text-[#e9edef]";
            timeClass = "text-[#8696a0]";
        }
    } else {
        // Light Mode
        if (isUser) {
            bubbleClass = "bg-[#d9fdd3] self-end rounded-tr-none"; // Light Green
            textClass = "text-[#111b21]";
            timeClass = "text-[#667781]";
        } else {
            bubbleClass = "bg-white self-start rounded-tl-none"; // White
            textClass = "text-[#111b21]";
            timeClass = "text-[#667781]";
        }
    }

    const alignClass = isUser ? "flex-row-reverse" : "flex-row";

    return (
        <div className={`flex ${alignClass} items-end mb-2 gap-2 px-2 animate-pop-in`}>
            {showAvatar && isVi && (
                <div className="w-8 h-8 rounded-full bg-[#00ff9d] overflow-hidden shrink-0">
                    <img src="/avatar.png" alt="VB" className="w-full h-full object-cover" />
                </div>
            )}

            <div className={`relative max-w-[80%] p-2 rounded-lg shadow-sm text-sm ${bubbleClass} ${textClass}`}>
                {message.image && (
                    <img src={message.image} alt="Sent image" className="rounded-lg mb-1 w-full h-auto object-cover max-h-64" />
                )}

                {message.text && (
                    <p
                        className="whitespace-pre-wrap break-words leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                    />
                )}

                <div className="flex justify-end items-center gap-1 mt-1">
                    <span className={`text-[10px] ${timeClass}`}>
                        {message.timestamp.split(' ')[1]}
                    </span>
                    {isUser && showTicks && (
                        <span className={`text-[10px] ${isDark ? 'text-[#53bdeb]' : 'text-[#53bdeb]'}`}>✓✓</span>
                    )}
                </div>
            </div>
        </div>
    );
}
