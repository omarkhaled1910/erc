import "./globals.css"
import type { Metadata } from "next"
import { type ReactNode } from "react"
import Header from "@/components/Header"
import { Providers } from "@/app/providers"
import Sidebar from "@/components/Sidebar"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
    title: "TSender",
    description: "Hyper gas-optimized bulk ERC20 token transfer",
}

export default function RootLayout(props: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/T-Sender.svg" sizes="any" />
            </head>
            <body className="bg-zinc-50">
                <Providers>
                    <Sidebar />
                    <div className="lg:ml-64">
                        <Header />
                        <main className="p-6">{props.children}</main>
                    </div>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 5000,
                            style: {
                                background: "#333",
                                color: "#fff",
                            },
                            success: {
                                duration: 5000,
                                iconTheme: {
                                    primary: "#4ade80",
                                    secondary: "#fff",
                                },
                            },
                            error: {
                                duration: 5000,
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "#fff",
                                },
                            },
                            loading: {
                                duration: 5000,
                                iconTheme: {
                                    primary: "#3b82f6",
                                    secondary: "#fff",
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    )
}
