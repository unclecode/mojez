// src/app/settings/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ProviderSettings from "@/components/ProviderSettings";
import PromptSettings from "@/components/PromptSettings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("provider");

    const handleCheckForUpdate = () => {
        // Perform a hard reset and refresh the app
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(const registration of registrations) {
                    registration.unregister();
                }
            });
        }
        window.caches && caches.keys().then(function(names) {
            for (const name of names)
                caches.delete(name);
        });
        window.location.reload(true);
    };

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto pb-20 overflow-auto h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-200">Settings</h1>
                <Button
                    onClick={handleCheckForUpdate}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-200"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Check for Update
                </Button>
            </div>
            
            <div className="flex space-x-4 mb-6">
                <Button
                    onClick={() => setActiveTab("provider")}
                    variant={activeTab === "provider" ? "default" : "outline"}
                    className="border-gray-700 text-gray-200"
                >
                    LLM Provider
                </Button>
                <Button
                    onClick={() => setActiveTab("prompt")}
                    variant={activeTab === "prompt" ? "default" : "outline"}
                    className="border-gray-700 text-gray-200"
                >
                    Prompt Customization
                </Button>
            </div>

            {activeTab === "provider" ? <ProviderSettings /> : <PromptSettings />}
        </div>
    );
}