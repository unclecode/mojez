// components/ResultCard.js
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function ResultCard({ version, content }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleCopy = () => {
        navigator.clipboard.writeText(editedContent);
        toast({
            title: "Copied to clipboard",
            description: "The condensed text has been copied to your clipboard.",
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Condensed Text",
                text: editedContent,
            });
        } else {
            toast({
                title: "Share not supported",
                description: "Your browser doesn't support the Web Share API.",
                variant: "destructive",
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Version {version}</CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        initial={false}
                        animate={{ height: isEditing ? "auto" : "fit-content" }}
                        transition={{ duration: 0.3 }}
                    >
                        {isEditing ? (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        ) : (
                            <p>{editedContent}</p>
                        )}
                    </motion.div>
                    <div className="flex space-x-2 mt-4">
                        <Button onClick={handleCopy}>Copy</Button>
                        <Button onClick={handleShare}>Share</Button>
                        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Save" : "Edit"}</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
