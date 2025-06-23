"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const menuItems = [
        { name: "Dashboard", path: "/" },
        { name: "Interact", path: "/interact" },
        { name: "ERC-20 Contract", path: "/erc20-contract" },
        { name: "Deploy Contract", path: "/deployer" },
        { name: "Deployments", path: "/deployments" },
        { name: "Settings", path: "/settings" },
    ]

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 p-2 rounded-md lg:hidden bg-white shadow-md hover:bg-gray-50 transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="p-6">
                    <div className="mb-8">
                        <img src="/T-Sender.svg" alt="T-Sender Logo" className="h-8" />
                    </div>
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map(item => (
                                <li key={item.path}>
                                    <Link
                                        onClick={() => setIsOpen(false)}
                                        href={item.path}
                                        className={`block px-4 py-2 rounded-md transition-colors
                                            ${
                                                pathname === item.path
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
