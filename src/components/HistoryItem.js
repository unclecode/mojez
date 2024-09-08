// components/HistoryItem.js
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HistoryItem({ entry }) {
    const truncatedContent = entry.content.slice(0, 100) + (entry.content.length > 100 ? "..." : "");
    const formattedDate = new Date(entry.date).toLocaleDateString();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/edit/${entry.id}`}>
                <Card className="hover:bg-gray-800 transition-colors">
                    <CardHeader>
                        <CardTitle className="text-lg">{truncatedContent}</CardTitle>
                        <CardDescription>{formattedDate}</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
        </motion.div>
    );
}
