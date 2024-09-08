// src/app/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getEntry, updateEntry } from "@/lib/db";
import Link from "next/link";
import TextEditor from "@/components/TextEditor";

export default function EditEntry({ params }: { params: { id: string } }) {
    const [initialText, setInitialText] = useState("");
    const [initialResults, setInitialResults] = useState<{ [key: string]: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEntry = async () => {
            setIsLoading(true);
            setError("");
            try {
                const loadedEntry = await getEntry(parseInt(params.id));
                setInitialText(loadedEntry.content);
                setInitialResults([{ ...loadedEntry.condensed, thinking: loadedEntry.thinking }]);
            } catch (error) {
                console.error("Error loading entry:", error);
                setError("Failed to load the entry. Please try again.");
            }
            setIsLoading(false);
        };
        loadEntry();
    }, [params.id]);

    const handleSave = async (content: string, condensed: string, thinking: string) => {
        await updateEntry(parseInt(params.id), { content, condensed, thinking });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <header className="flex items-center justify-between sticky top-0 bg-gray-900 p-4 z-10">
                <Link href="/" className="text-gray-400">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-semibold">Edit Text</h1>
                <div className="w-6"></div>
            </header>
            <TextEditor initialText={initialText} initialResults={initialResults} onSave={handleSave} />
        </>
    );
}