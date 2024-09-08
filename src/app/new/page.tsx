// src/app/new/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { addEntry } from "@/lib/db";
import Link from "next/link";
import TextEditor from "@/components/TextEditor";

export default function NewEntry() {
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
            <TextEditor onSave={handleSave} />
        </>
    );
}