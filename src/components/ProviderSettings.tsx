// src/components/ProviderSettings.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function ProviderSettings() {
    const [provider, setProvider] = useState("claude");
    const [apiKey, setApiKey] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const router = useRouter();

    useEffect(() => {
        setProvider(localStorage.getItem("aiProvider") || "claude");
        setApiKey(localStorage.getItem("apiKey") || "");
        setSystemPrompt(localStorage.getItem("systemPrompt") || "");
    }, []);

    const handleSave = () => {
        localStorage.setItem("aiProvider", provider);
        localStorage.setItem("apiKey", apiKey);
        localStorage.setItem("systemPrompt", systemPrompt);
        toast({
            title: "Settings saved",
            description: "Your settings have been successfully saved.",
        });
        router.push("/");
    };

    const handleExport = () => {
        const data = {
            aiProvider: provider,
            apiKey,
            systemPrompt,
        };
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text-condenser-settings.json";
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-3">
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-300">
                        AI Provider
                    </label>
                    <Select value={provider} onValueChange={setProvider}>
                        <SelectTrigger id="provider" className="border-gray-700 bg-gray-800 text-gray-200">
                            <SelectValue placeholder="Select AI provider" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-700 bg-gray-800">
                            <SelectItem value="claude">Claude</SelectItem>
                            <SelectItem value="groq">Groq</SelectItem>
                            <SelectItem value="openai">OpenAI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-3">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">
                        API Key
                    </label>
                    <Input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="border-gray-700 bg-gray-800 text-gray-200"
                    />
                </div>
                <div className="space-y-3">
                    <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-300">
                        System Prompt
                    </label>
                    <Textarea
                        id="systemPrompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Enter custom system prompt (optional)"
                        className="border-gray-700 bg-gray-800 text-gray-200"
                    />
                </div>
            </div>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <Button onClick={handleSave} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    Save Settings
                </Button>
                <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-200 hover:bg-gray-800">
                    Export Settings
                </Button>
            </div>
        </div>
    );
}