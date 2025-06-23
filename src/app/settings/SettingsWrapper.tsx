"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Check } from "lucide-react"
import { toast } from "react-hot-toast"

interface Contract {
    name: string
    address: string
    description: string
    type: string
}

interface Network {
    name: string
    chainId: number
    contracts: Contract[]
}

const networks: Network[] = [
    {
        name: "Sepolia",
        chainId: 11155111,
        contracts: [
            {
                name: "ERC20 Token",
                address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
                description: "Standard ERC20 token implementation",
                type: "ERC20",
            },
            {
                name: "ERC721 Token",
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                description: "Standard ERC721 NFT implementation",
                type: "ERC721",
            },
            {
                name: "ERC1155 Token",
                address: "0x1234567890123456789012345678901234567890",
                description: "Multi-token standard implementation",
                type: "ERC1155",
            },
        ],
    },
    {
        name: "Ethereum Mainnet",
        chainId: 1,
        contracts: [
            {
                name: "ERC20 Token",
                address: "0x1234567890123456789012345678901234567890",
                description: "Standard ERC20 token implementation",
                type: "ERC20",
            },
        ],
    },
]

export default function SettingsWrapper() {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

    const copyToClipboard = (address: string) => {
        navigator.clipboard.writeText(address)
        setCopiedAddress(address)
        toast.success("Address copied to clipboard!")
        setTimeout(() => setCopiedAddress(null), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Network Settings</h1>
            </div>

            <Tabs defaultValue="sepolia" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    {networks.map(network => (
                        <TabsTrigger key={network.chainId} value={network.name.toLowerCase()}>
                            {network.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {networks.map(network => (
                    <TabsContent key={network.chainId} value={network.name.toLowerCase()}>
                        <div className="grid gap-4">
                            {network.contracts.map(contract => (
                                <Card key={contract.address}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {contract.name}
                                                    <Badge variant="outline">
                                                        {contract.type}
                                                    </Badge>
                                                </CardTitle>
                                                <CardDescription>
                                                    {contract.description}
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(contract.address)}
                                            >
                                                {copiedAddress === contract.address ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <code className="text-sm bg-accent/10 p-2 rounded">
                                                {contract.address}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2"
                                                onClick={() =>
                                                    window.open(
                                                        `https://sepolia.etherscan.io/address/${contract.address}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View on Explorer
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
