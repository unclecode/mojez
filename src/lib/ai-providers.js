// lib/ai-providers.js
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import OpenAI from "openai";

const getProvider = async () => {
    const provider = localStorage.getItem("aiProvider") || "claude";
    const apiKey = localStorage.getItem("apiKey");

    if (!apiKey) {
        throw new Error("API key not found. Please set it in the settings.");
    }

    switch (provider) {
        case "claude":
            return new Anthropic({ apiKey, dangerouslyAllowBrowser: true  });
        case "groq":
            return new Groq({ apiKey });
        case "openai":
            return new OpenAI({ apiKey, dangerouslyAllowBrowser: true  });
        default:
            throw new Error("Invalid AI provider");
    }
};

const getSystemPrompt = () => {
    return localStorage.getItem("systemPrompt") || "";
};

const getVersionDefinitions = () => {
    const storedVersions = localStorage.getItem('versionDefinitions');
    return storedVersions ? JSON.parse(storedVersions) : null;
};

const getExamples = () => {
    const storedExamples = localStorage.getItem('promptExamples');
    return storedExamples ? JSON.parse(storedExamples) : null;
};

const extractResponse = (content) => {
    const match = content.match(/<response>([\s\S]*?)<\/response>/);
    return match ? match[1] : null;
};

const extractThinking = (content) => {
    const match = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
    return match ? match[1] : null;
};

export const condensedMessage = async (inputText) => {
    if (!inputText.trim()) {
        throw new Error("Input text cannot be empty");
    }

    const provider = await getProvider();
    const systemPrompt = getSystemPrompt();
    const versionDefinitions = getVersionDefinitions();
    const examples = getExamples();

    let promptTemplate = `You are tasked with rewriting an input message into shorter versions while preserving its core meaning and intent. Follow these instructions carefully:

1. Use a <thinking></thinking> section as a scratchpad before providing your final answer. Within these tags:
   - Analyze the given message
   - Identify the core ideas and author's main intent
   - Consider multiple approaches for condensing the message
   - Develop a structured approach to solving the task

2. After your analysis, provide your final, refined answer wrapped in <response> tags. This should be a JSON object containing the original message and three shortened versions.

3. Here is the input message to rewrite:

<QUERY>
${inputText}
</QUERY>

4. Follow these steps to rewrite the message in 3 iterations/versions:
${versionDefinitions ? `
   - Version 1: ${versionDefinitions.version1}
   - Version 2: ${versionDefinitions.version2}
   - Version 3: ${versionDefinitions.version3}
` : `
   - Version 1: Refine the grammar, sentence structure, and overall clarity of the message without changing its core meaning or intent. Identify and remove unnecessary stop words (e.g., "the," "which," "and") or connector words that can be omitted without altering the message's meaning.
   - Version 2: Replace longer phrases or words with widely recognized abbreviations where appropriate (e.g., "in my opinion" → "IMO," "developer" → "dev").
   - Version 3: Substitute longer words with shorter, concise synonyms that maintain the message's meaning (e.g., "continuous" → "constant," "profession" → "job").
`}

5. Here are examples of expected outputs:
${examples ? examples.join('\n---\n') : `
----
Example 1:
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
</response>
----
Example 2:
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
</response>
----
Example 3:
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
</response>
----
`}

6. Now, analyze the given message and provide your final answer in the following JSON format:

<response>
{
  "version1": "...",
  "version2": "...",
  "version3": "..."
}
</response>

Remember to preserve the core meaning and intent of the original message in all versions.`;

    // if there is system prompt, append it to the prompt template
    if (systemPrompt) {
        promptTemplate += `\n\nSystem Prompt: ${systemPrompt}`;
    }

    const messages = [
        { role: "user", content: promptTemplate },
    ];

    try {
        let response;
        if (provider instanceof Anthropic) {
            response = await provider.messages.create({
                model: "claude-3-sonnet-20240229",
                max_tokens: 1000,
                messages,
            });
            const content = response.content[0].text;
            return {
                thinking: extractThinking(content),
                response: JSON.parse(extractResponse(content)),
            };
        } else if (provider instanceof Groq) {
            response = await provider.chat.completions.create({
                messages,
                model: "llama-3.1-72b-versatile",
            });
            const content = response.choices[0].message.content;
            return {
                thinking: extractThinking(content),
                response: JSON.parse(extractResponse(content)),
            };
        } else if (provider instanceof OpenAI) {
            response = await provider.chat.completions.create({
                messages,
                model: "gpt-4",
            });
            const content = response.choices[0].message.content;
            return {
                thinking: extractThinking(content),
                response: JSON.parse(extractResponse(content)),
            };
        }
    } catch (error) {
        console.error("Error in AI provider:", error);
        throw new Error("Failed to generate condensed versions. Please check your API key and try again.");
    }
};