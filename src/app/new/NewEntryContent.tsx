// src/app/new/NewEntryContent.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { addEntry } from "@/lib/db";
import Link from "next/link";
import TextEditor from "@/components/TextEditor";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewEntryContent() {
    const searchParams = useSearchParams();
    const [initialText, setInitialText] = useState('');

    useEffect(() => {
        const text = searchParams.get('initialText');
        console.log("Received initialText:", text);
        if (text) {
            const decodedText = decodeURIComponent(text);
            console.log("Decoded initialText:", decodedText);
            setInitialText(decodedText);
        }
    }, [searchParams]);

    const handleSave = async (content: string, condensed: string, thinking: string) => {
        await addEntry({ content, condensed, thinking });
    };

    return (
        <>
            <header className="flex items-center justify-between sticky top-0 bg-gray-900 p-4 z-10">
                <Link href="/" className="text-gray-400">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-semibold">New Text</h1>
                <div className="w-6"></div>
            </header>
            <TextEditor onSave={handleSave} initialText={initialText} />
        </>
    );
}