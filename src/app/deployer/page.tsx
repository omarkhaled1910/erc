"use client"

import React, { useState } from "react"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import ERC20Deployer from "@/components/ERC20Deployer"
import ERC721Deployer from "@/components/ERC721Deployer"

const DeployerPage = () => {
    const { isConnected } = useAccount()
    const [activeTab, setActiveTab] = useState("erc20")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="max-w-4xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="erc20" className="text-lg font-medium">
                                ERC-20 Token Deployer
                            </TabsTrigger>
                            <TabsTrigger value="erc721" className="text-lg font-medium">
                                ERC-721 NFT Deployer
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="erc20" className="mt-0">
                            <ERC20Deployer />
                        </TabsContent>

                        <TabsContent value="erc721" className="mt-0">
                            <ERC721Deployer />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default DeployerPage
