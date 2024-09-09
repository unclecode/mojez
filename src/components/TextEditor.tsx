// src/components/TextEditor.tsx
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { condensedMessage } from "@/lib/ai-providers";

interface TextEditorProps {
    initialText?: string;
    initialResults?: { [key: string]: string }[];
    onSave: (content: string, condensed: string, thinking: string) => Promise<void>;
}

export default function TextEditor({ initialText = "", initialResults = [], onSave }: TextEditorProps) {
    const [inputText, setInputText] = useState(initialText);
    const [results, setResults] = useState(initialResults);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Use useEffect to update inputText when initialText changes
    useEffect(() => {
        setInputText(initialText);
    }, [initialText]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await condensedMessage(inputText);
            setResults([{ ...response.response, thinking: response.thinking }]);
            await onSave(inputText, response.response, response.thinking);
        } catch (_error) {
            console.error("Error generating condensed versions:", _error);
            setError("Failed to generate condensed versions. Please try again.");
            console.log(error);
        }
        setIsLoading(false);
    };

    const handleCopy = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    toast({ title: "Copied to clipboard" });
                })
                .catch((error) => {
                    console.error("Error copying to clipboard:", error);
                    toast({
                        title: "Error copying to clipboard",
                        description: "Please try copying manually.",
                        variant: "destructive",
                    });
                });
        } else {
            // Fallback method for browsers that don't support the Clipboard API
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand("copy");
                if (successful) {
                    toast({ title: "Copied to clipboard" });
                } else {
                    throw new Error("Copy command was unsuccessful");
                }
            } catch (error) {
                console.error("Fallback: Error copying to clipboard:", error);
                toast({
                    title: "Error copying to clipboard",
                    description: "Please try copying manually.",
                    variant: "destructive",
                });
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };


    const handleShare = async (text: string) => {
        if (navigator.share) {
            try {
                await navigator.share({ url: "", text: text, title: "" });
                toast({ title: "Shared successfully" });
            } catch (error) {
                console.error("Error sharing:", error);
                if (error instanceof DOMException && error.name === "AbortError") {
                    // User cancelled the share operation
                    return;
                }
                fallbackShare(text);
            }
        } 
        else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.share) {
            // iOS PWA specific sharing
            window.webkit.messageHandlers.share.postMessage({
                text: text,
                url: "",
                title: "",
            });
        } else {
            fallbackShare(text);
        }
    };

    const fallbackShare = (text: string) => {
        toast({
            title: "Share not supported",
            description: "Your device doesn't support sharing. Try copying the text instead.",
            variant: "destructive",
        });
        // Optionally, you could automatically copy to clipboard here
        handleCopy(text);
    };
    return (
        <div id="container" className="relative overflow-auto space-y-4 p-4 max-w-2xl mx-auto pb-20 h-full">
            <div className="relative">
                <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="min-h-[150px] resize-y pb-4 leading-relaxed text-gray-400 border-gray-700"
                />
                <span className="absolute bottom-2 right-2 text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
                    {inputText.length} characters
                </span>
            </div>
            <Button
                onClick={handleGenerate}
                disabled={isLoading || !inputText}
                className="w-full bg-blue-600 hover:bg-blue-700"
            >
                {isLoading ? (
                    <span className="inline-block text-lg">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse animation-delay-200">.</span>
                        <span className="animate-pulse animation-delay-400">.</span>
                    </span>
                ) : (
                    "Generate"
                )}
            </Button>
            {results.map((result, index) => (
                <Card key={index} className="mt-4 bg-gray-800 border-gray-800">
                    <Tabs defaultValue="version1" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 rounded-tr-xl rounded-tl-xl rounded-b-none bg-gray-700">
                            <TabsTrigger value="version1">V1</TabsTrigger>
                            <TabsTrigger value="version2">V2</TabsTrigger>
                            <TabsTrigger value="version3">V3</TabsTrigger>
                            <TabsTrigger value="thinking">Thinking</TabsTrigger>
                        </TabsList>
                        {Object.entries(result).map(([version, content]) => (
                            <TabsContent key={version} value={version}>
                                <CardContent className="relative pt-8">
                                    <div className="absolute top-[-5px] right-2 flex space-x-2 text-gray-500">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleCopy(content as string)}
                                            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                            onClick={() => handleShare(content as string)}
                                        >
                                            <Share className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="leading-relaxed text-gray-400 whitespace-break-spaces">
                                        {content as string}
                                    </p>
                                </CardContent>
                            </TabsContent>
                        ))}
                    </Tabs>
                </Card>
            ))}
        </div>
    );
}
