// src/components/PromptSettings.tsx
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const defaultVersions = {
    version1: `Refine the grammar, sentence structure, and overall clarity of the message without changing its core meaning or intent. Identify and remove unnecessary stop words (e.g., "the," "which," "and") or connector words that can be omitted without altering the message's meaning.`,
    version2: `Replace longer phrases or words with widely recognized abbreviations where appropriate (e.g., "in my opinion" → "IMO," "developer" → "dev").`,
    version3: `Substitute longer words with shorter, concise synonyms that maintain the message's meaning, \ (e.g., "continuous" → "constant," "profession" → "job").`,
};

const defaultExamples = [
    `Example 1:
Original message: "I'm really excited about the new project we're starting next week. It's going to be challenging, but I think it will be a great opportunity for our team to learn and grow together."

<thinking>
Core ideas: excitement, new project, start time, challenge, team growth. 
Decisions: 
1. Remove filler words "really" and "I think"
2. Abbreviate "next week" to "next wk"
3. Use emojis for "excited" and "project"
4. Condense "learn and grow together" to "grow as one"
</thinking>

<response>
{
  "version1": "I'm excited about the new project starting next week. It'll be challenging, but a great opportunity for our team to learn and grow together.",
  "version2": "Excited for new project next wk. Challenging, but great opp for team learning & growth.",
  "version3": "🎉 New project next wk. Tough, but team will grow as one."
}
</response>`,

    `Example 2:
Original message: "The annual company retreat is scheduled for next month in Hawaii. It's a fantastic opportunity for team building, strategic planning, and enjoying some well-deserved relaxation time together."

<thinking>
Core ideas: annual retreat, location, timing, purpose (team building, planning, relaxation).
Decisions:
1. Combine ideas into more concise structure
2. Use abbreviations for "next month" and "Hawaii"
3. Replace "fantastic opportunity" with shorter synonym
4. Use emojis for "retreat" and "Hawaii"
</thinking>

<response>
{
  "version1": "Our annual company retreat is next month in Hawaii. It's great for team building, strategic planning, and enjoying relaxation together.",
  "version2": "Annual company retreat next mo in HI. Great for team building, planning & relaxation.",
  "version3": "🏝️ retreat next mo in HI. Team bonds, plans & chills."
}
</response>`,
`Example 3:
Original message: "The new software update includes significant improvements to user interface design, enhanced security features, and optimized performance for faster load times across all devices."

<thinking>
Core ideas: new update, UI improvements, security enhancements, performance optimization.
Decisions:
1. Remove unnecessary words like "significant" and "enhanced"
2. Use common tech abbreviations
3. Condense phrases to their essence
4. Use emojis for key concepts
</thinking>

<response>
{
  "version1": "The new software update improves user interface design, security features, and optimizes performance for faster load times on all devices.",
  "version2": "New SW update: better UI, improved security & optimized perf for faster load times on all devices.",
  "version3": "SW update: better UI, better security, higher speed on all devices."
}
</response>`,
];

export default function PromptSettings() {
    const [versions, setVersions] = useState(defaultVersions);
    const [examples, setExamples] = useState(defaultExamples);
    

    useEffect(() => {
        const storedVersions = localStorage.getItem("versionDefinitions");
        const storedExamples = localStorage.getItem("promptExamples");

        if (storedVersions) {
            setVersions(JSON.parse(storedVersions));
        } else {
            localStorage.setItem("versionDefinitions", JSON.stringify(defaultVersions));
        }

        if (storedExamples) {
            setExamples(JSON.parse(storedExamples));
        } else {
            localStorage.setItem("promptExamples", JSON.stringify(defaultExamples));
        }
    }, []);

    const handleVersionChange = (version, value) => {
        setVersions((prev) => ({ ...prev, [version]: value }));
    };

    const restStorage = () => {
        localStorage.removeItem("versionDefinitions");
        localStorage.removeItem("promptExamples");
        // reload the page
        window.location.reload();
    }

    const handleExampleChange = (index, value) => {
        setExamples((prev) => {
            const newExamples = [...prev];
            newExamples[index] = value;
            return newExamples;
        });
    };

    const handleSave = () => {
        localStorage.setItem("versionDefinitions", JSON.stringify(versions));
        localStorage.setItem("promptExamples", JSON.stringify(examples));
        toast({
            title: "Prompt settings saved",
            description: "Your custom prompt settings have been saved successfully.",
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-200">Prompt Customization</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Version Definitions</h3>
                {Object.entries(versions).map(([version, definition]) => (
                    <div key={version} className="space-y-2">
                        <label htmlFor={version} className="block text-sm font-medium text-gray-300">
                            {version.charAt(0).toUpperCase() + version.slice(1)}
                        </label>
                        <Textarea
                            id={version}
                            value={definition}
                            onChange={(e) => handleVersionChange(version, e.target.value)}
                            className="border-gray-700 bg-gray-800 text-gray-200"
                            rows={4}
                        />
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-300">Examples</h3>
                {examples?.map((example, index) => (
                    <div key={index} className="space-y-2">
                        <label htmlFor={`example-${index}`} className="block text-sm font-medium text-gray-300">
                            Example {index + 1} 
                        </label>
                        <Textarea
                            id={`example-${index}`}
                            value={example}
                            onChange={(e) => handleExampleChange(index, e.target.value)}
                            className="border-gray-700 bg-gray-800 text-gray-200"
                            rows={20}
                        />
                    </div>
                ))}
            </div>

            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                Save Prompt Settings
            </Button>
            <Button onClick={restStorage} className="w-full bg-red-600 hover:bg-red-700">
                Reset Prompt Settings
            </Button>
        </div>
    );
}
