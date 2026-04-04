'use client';

import { AACBoard } from '@/components/board/AACBoard';
import { SentenceBar } from '@/components/board/SentenceBar';
import { useBoardStore } from '@/lib/store/useBoardStore';

export default function BoardPage() {
    const addWord = useBoardStore((s) => s.addWord);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden bg-[#FFF7F2]">
            {/* Sentence builder bar — shows chips, speak button, delete */}
            <SentenceBar actionMode="board" />

            {/* AAC grid — pushes words into the SentenceBar when tapped */}
            <main className="flex-1 overflow-hidden">
                <AACBoard
                    onWordAdd={addWord}
                    onNavigate={(target) => {
                        console.log('Navigation requested to:', target);
                    }}
                />
            </main>
        </div>
    );
}
