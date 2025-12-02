import { useStore } from '@nanostores/preact';
import { isPlaying, playbackSpeed, togglePlay, resetConversation, setSpeed, nextMessage, currentMessageIndex, conversationConfig } from '../store/conversationStore';
import { useEffect, useRef } from 'preact/hooks';
import { IoPlay, IoPause, IoRefresh } from 'react-icons/io5';

export default function Controls() {
    const playing = useStore(isPlaying);
    const speed = useStore(playbackSpeed);
    const currentIndex = useStore(currentMessageIndex);
    const config = useStore(conversationConfig);

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (playing) {
            const intervalTime = 2000 / speed;
            intervalRef.current = window.setInterval(() => {
                nextMessage();
            }, intervalTime);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [playing, speed]);

    const progress = config && config.conversation.length > 0
        ? ((currentIndex + 1) / config.conversation.length) * 100
        : 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Playback</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => resetConversation()}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                        title="Reset"
                    >
                        <IoRefresh size={20} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => togglePlay()}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${playing
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                >
                    {playing ? <IoPause size={24} /> : <IoPlay size={24} className="ml-1" />}
                </button>

                <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span>Speed</span>
                        <span>{speed}x</span>
                    </div>
                    <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                        {[0.5, 1, 2, 4].map((s) => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${speed === s
                                    ? 'bg-slate-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                    }`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
