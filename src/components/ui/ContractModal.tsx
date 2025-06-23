"use client"

import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle2,
    ExternalLink,
    Copy,
    FileText,
    Calendar,
    Hash,
    Building2,
    User,
    Coins,
    Settings,
} from "lucide-react"
import toast from "react-hot-toast"

interface DeploymentInfo {
    transactionHash: string
    contractAddress: string
    blockNumber: number
    gasUsed: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    initialSupply: string
    deployerAddress: string
    deploymentDate: string
    network: string
}

interface ContractModalProps {
    isOpen: boolean
    onClose: () => void
    deploymentInfo?: DeploymentInfo
    localStorageKey?: string
}

export function ContractModal({
    isOpen,
    onClose,
    deploymentInfo,
    localStorageKey,
}: ContractModalProps) {
    const [info, setInfo] = useState<DeploymentInfo | null>(null)

    useEffect(() => {
        if (deploymentInfo) {
            setInfo(deploymentInfo)
        } else if (localStorageKey) {
            const stored = localStorage.getItem(localStorageKey)
            if (stored) {
                try {
                    setInfo(JSON.parse(stored))
                } catch (error) {
                    console.error("Error parsing localStorage data:", error)
                    toast.error("Error loading contract information")
                }
            }
        }
    }, [deploymentInfo, localStorageKey, isOpen])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const openInExplorer = (hash: string) => {
        window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
    }

    const openContractInExplorer = (address: string) => {
        window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
    }

    if (!info) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            Contract Information
                        </DialogTitle>
                        <DialogDescription>No contract information found.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                        Contract Deployed Successfully
                    </DialogTitle>
                    <DialogDescription>
                        Your ERC-20 token has been deployed to the blockchain.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Token Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Coins className="h-5 w-5" />
                            Token Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Token Name</p>
                                <p className="font-semibold">{info.tokenName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Token Symbol</p>
                                <p className="font-semibold">{info.tokenSymbol}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Decimals</p>
                                <p className="font-semibold">{info.tokenDecimals}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Initial Supply</p>
                                <p className="font-semibold">{info.initialSupply}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contract Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Contract Address
                        </h3>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-sm bg-white p-2 rounded border break-all">
                                {info.contractAddress}
                            </code>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    copyToClipboard(info.contractAddress, "Contract address")
                                }
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openContractInExplorer(info.contractAddress)}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Transaction Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Transaction Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Transaction Hash
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-sm bg-white p-2 rounded border break-all">
                                        {info.transactionHash}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            copyToClipboard(
                                                info.transactionHash,
                                                "Transaction hash"
                                            )
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openInExplorer(info.transactionHash)}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Block Number
                                    </p>
                                    <p className="font-semibold">{info.blockNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Gas Used</p>
                                    <p className="font-semibold">{info.gasUsed}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Network</p>
                                    <Badge variant="secondary">{info.network}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deployment Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Deployment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Deployer Address
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-sm bg-white p-2 rounded border break-all">
                                        {info.deployerAddress}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            copyToClipboard(
                                                info.deployerAddress,
                                                "Deployer address"
                                            )
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Deployment Date
                                </p>
                                <p className="font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(info.deploymentDate).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const contractUrl = `/erc20-contract?address=${info.contractAddress}`
                                window.open(contractUrl, "_blank")
                            }}
                            className="gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Interact with Contract
                        </Button>
                        <Button
                            onClick={() => {
                                const contractUrl = `/erc20-contract?address=${info.contractAddress}`
                                window.location.href = contractUrl
                            }}
                            className="gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open Contract Page
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
