// src/app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { Home, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
interface CustomNavigator extends Navigator {
    standalone?: boolean;
}

interface CustomWebkit {
    messageHandlers?: {
        share?: {
            postMessage: (message: string) => void;
        };
    };
}

interface Window {
    navigator: CustomNavigator;
    webkit?: CustomWebkit;
}

declare global {
    interface Window {
        webkit?: CustomWebkit;
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const hideHeaderRoutes = ["/new", "/settings", "/edit"];
    const shouldHideHeader = hideHeaderRoutes.some((route) => pathname.startsWith(route));

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "standalone" in window.navigator &&
            (window.navigator as CustomNavigator).standalone
        ) {
            (window as Window).webkit = (window as Window).webkit || {};
            (window as Window).webkit!.messageHandlers = (window as Window).webkit!.messageHandlers || {};
            (window as Window).webkit!.messageHandlers!.share = {
                postMessage: function (message: string) {
                    window.location.href = "sharesheet://" + encodeURIComponent(JSON.stringify(message));
                },
            };
        }

        if (typeof window !== "undefined") {
            window.addEventListener("webcontentshared", function (e) {
                if (e.detail.file) {
                    //doSomethingWithTheFile(e.detail.file);
                } else if (e.detail.url) {
                    //doSomethingWithTheLink(e.detail.url, e.detail.title, e.detail.text);
                } else {
                    // Navigate to new page and add the text to the input
                    const sharedText = e.detail.text || "";
                    router.push(`/new?initialText=${encodeURIComponent(sharedText)}`);
                }
            });
        }
    }, []);

    // Function to simulate webcontentshared event
    const simulateWebContentShared = () => {
        const event = new CustomEvent("webcontentshared", {
            detail: {
                text: "This is a test shared text from browser simulation.",
            },
        });
        window.dispatchEvent(event);
    };

    return (
        <html lang="en">
            <head>
                {/* <link rel="manifest" href="/manifest.json" /> */}
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                <link rel="manifest" href="https://progressier.app/KgH57BZHZkXp04nVVeAd/progressier.json" />
                <script defer src="https://progressier.app/KgH57BZHZkXp04nVVeAd/script.js"></script>
                <style>{`
                    html, body {
                        touch-action: pan-x pan-y;
                        overscroll-behavior: none;
                    }
                    input, textarea, select {
                        font-size: 16px !important;
                    }
                `}</style>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        document.addEventListener('gesturestart', function(e) {
                            e.preventDefault();
                        });
                        document.addEventListener('touchmove', function(e) {
                            if (e.scale !== 1) { e.preventDefault(); }
                        }, { passive: false });
                    `,
                    }}
                />
            </head>
            <body className={`${inter.className} bg-gray-900 text-white flex flex-col h-screen overflow-hidden`}>
                {!shouldHideHeader && (
                    <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4">
                        <div className="flex justify-between items-center max-w-2xl mx-auto">
                            <h1 className="text-2xl font-semibold text-gray-400">Mojez 1.0</h1>
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={simulateWebContentShared}
                                    className="mr-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                                >
                                    Test Share
                                </Button>
                                <Link href="/new">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 active:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    >
                                        <Plus size={24} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </header>
                )}
                <main className="flex-grow h-full overflow-hidden">{children}</main>
                <footer className="bg-gray-900 border-t border-gray-600 p-4 pb-8 sticky bottom-0 z-10">
                    <nav className="flex justify-around items-center text-gray-400 max-w-2xl mx-auto">
                        <Link href="/" className="flex flex-col items-center">
                            <Home size={24} />
                            <span className="text-xs mt-1">Home</span>
                        </Link>
                        <Link href="/settings" className="flex flex-col items-center">
                            <Settings size={24} />
                            <span className="text-xs mt-1">Settings</span>
                        </Link>
                    </nav>
                </footer>
                <Toaster />
            </body>
        </html>
    );
}
