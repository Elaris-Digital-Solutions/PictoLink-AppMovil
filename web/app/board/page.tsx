'use client';

import { AACBoard } from '@/components/board/AACBoard';
import { SentenceBar } from '@/components/board/SentenceBar';
import { BoardHeader } from '@/components/board/BoardHeader';
import { useBoardStore } from '@/lib/store/useBoardStore';

export default function BoardPage() {
    const addWord = useBoardStore((s) => s.addWord);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden bg-[#FFF7F2]">
            {/* Sentence builder bar */}
            <SentenceBar actionMode="board" />

            {/* Navigation Header like Proloquo2Go */}
            <BoardHeader />

            {/* AAC grid */}
            <main className="flex-1 overflow-hidden">
                <AACBoard onWordAdd={addWord} />
            </main>
        </div>
    );
}
