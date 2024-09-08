// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import { getAllEntries } from "@/lib/db";
import Link from "next/link";
import { setTimeout } from "timers";

const ITEMS_PER_PAGE = 10;

export default function Home() {
    const [entries, setEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { ref, inView } = useInView();

    useEffect(() => {
        loadEntries();
    }, []);

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreEntries();
        }
    }, [inView, hasMore]);

    const loadEntries = async () => {
        setIsLoading(true);
        try {
            const allEntries = await getAllEntries();
            console.log("Loaded entries:", allEntries); // Debug log
            setTimeout(() => {
                setEntries(allEntries.slice(0, ITEMS_PER_PAGE));
                setHasMore(allEntries.length > ITEMS_PER_PAGE);
                setIsLoading(false);
            }, 100);
            // setEntries(allEntries.slice(0, ITEMS_PER_PAGE));
            // setHasMore(allEntries.length > ITEMS_PER_PAGE);
        } catch (error) {
            console.error("Error loading entries:", error);
        } finally {
            
        }
    };

    const loadMoreEntries = async () => {
        const allEntries = await getAllEntries();
        const newEntries = allEntries.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
        setEntries([...entries, ...newEntries]);
        setPage(page + 1);
        setHasMore(allEntries.length > (page + 1) * ITEMS_PER_PAGE);
    };

    const handleRefresh = async () => {
        setPage(1);
        await loadEntries();
    };

    const filteredEntries = entries.filter((entry) => entry.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-4 p-4 max-w-2xl mx-auto overflow-auto h-full pb-20">
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="text"
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {isLoading ? (
                <div className="text-center text-gray-400 py-8">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        Loading entries...
                    </motion.div>
                </div>
            ) : (
                <AnimatePresence>
                    {filteredEntries.length === 0 && !isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-400 py-8"
                        >
                            No entries found. Create a new one!
                        </motion.div>
                    ) : (
                        filteredEntries.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/edit/${entry.id}`}>
                                    <Card className="bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer border-none">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-gray-400 mb-2">{formatDate(entry.date)}</p>
                                            <p className="line-clamp-3 text-gray-200">{entry.content}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            )}

            {hasMore && (
                <div ref={ref} className="py-4 text-center">
                    <Button onClick={loadMoreEntries} variant="outline">
                        Load More
                    </Button>
                </div>
            )}

            <Button onClick={handleRefresh} className="fixed bottom-[110px] right-4 rounded-full" variant="secondary">
                Refresh
            </Button>
        </div>
    );
}
