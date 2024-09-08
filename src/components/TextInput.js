// components/TextInput.js
import { Textarea } from "@/components/ui/textarea";

export default function TextInput({ value, onChange }) {
    return (
        <Textarea
            placeholder="Paste your text here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[200px] resize-y"
        />
    );
}
