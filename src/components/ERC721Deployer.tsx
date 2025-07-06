"use client"

import React, { useState } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { sepolia } from "wagmi/chains"
import toast from "react-hot-toast"
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContractModal } from "@/components/ui/ContractModal"
import { useDeployERC721Contract, useDeployContract } from "@/hooks/useDeployContract"
import { type DeploymentFormData } from "@/lib/schemas/deploymentSchema"

import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import ContractCompileInfoModal from "@/components/ui/ContractCompileInfoModal"
import { ERC721DeploymentForm, ERC721DeploymentFormData } from "./721DeploymentForm"
import { ERC721_TEMPLATE } from "@/constants"

const ERC721Deployer = () => {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const [deploymentHash, setDeploymentHash] = useState<string>("")
    const [deployedAddress, setDeployedAddress] = useState<string>("")
    const [isDeployed, setIsDeployed] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showGasInfoModal, setShowGasInfoModal] = useState(false)
    const [showContractInfoModal, setShowContractInfoModal] = useState(false)
    const isOnSepolia = chainId === sepolia.id

    // TanStack Query mutation
    const deployMutation = useDeployERC721Contract()

    const handleSwitchToSepolia = () => {
        if (switchChain) {
            switchChain({ chainId: sepolia.id })
        }
    }

    const openInExplorer = (hash: string) => {
        window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
    }

    const handleShowInfo = () => {
        setShowModal(true)
    }

    const onSubmit = async (data: ERC721DeploymentFormData) => {
        if (!isConnected) {
            toast.error("Please connect your wallet first")
            return
        }

        if (!isOnSepolia) {
            toast.error("Please switch to Sepolia testnet")
            return
        }

        console.log("onSubmit", address, data)
        try {
            const result = await deployMutation.mutateAsync({
                name: data.name,
                symbol: data.symbol,
                baseURI: data.baseURI,
                privateKey: data.privateKey,
                userAddress: address!,
            })

            console.log("result", result)
            if (result?.success) {
                setDeploymentHash(result.transactionHash || "")
                setDeployedAddress(result.contractAddress || "")
                setIsDeployed(true)
                toast.success("ERC721 Contract deployed successfully!")
            } else {
                toast.error(result?.error || "Deployment failed")
            }

            // Reset form after successful deployment
            return result
        } catch (error) {
            console.error("Deployment error:", error)
            toast.error(error instanceof Error ? error.message : "Deployment failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        ERC-721 NFT Contract Deployer
                    </h1>
                </div>

                {/* Network Status */}
                <div className="mb-4 flex items-center justify-center">
                    {isConnected ? (
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white border rounded-lg">
                                <p className="text-sm text-gray-600">Connected Address</p>
                                <p className="font-mono text-sm break-all">{address}</p>
                            </div>
                            <div
                                className={cn(
                                    "p-3 border rounded-lg",
                                    isOnSepolia
                                        ? "bg-green-50 border-green-200"
                                        : "bg-red-50 border-red-200"
                                )}
                            >
                                <p className="text-sm text-gray-600">Network</p>
                                <p
                                    className={cn(
                                        "font-medium",
                                        isOnSepolia ? "text-green-800" : "text-red-800"
                                    )}
                                >
                                    {isOnSepolia ? "Sepolia Testnet" : `Chain ID: ${chainId}`}
                                </p>
                            </div>
                            <div>
                                <Button
                                    onClick={() => {
                                        setShowContractInfoModal(true)
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Show Contract Info</span>
                                </Button>
                            </div>
                            {!isOnSepolia && (
                                <button
                                    onClick={handleSwitchToSepolia}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Switch to Sepolia
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                                Please connect your wallet to deploy an ERC-721 contract.
                            </p>
                        </div>
                    )}
                </div>
                <div className="max-w-2xl mx-auto">
                    <ERC721DeploymentForm
                        onSubmit={onSubmit}
                        isPending={deployMutation.isPending}
                    />
                    {deployMutation.isPending && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <p className="text-blue-800">Deploying your ERC-721 contract...</p>
                            </div>
                            <p className="text-sm text-blue-600 mt-2">
                                This may take a few minutes. Please don't close this page.
                            </p>
                        </div>
                    )}

                    {deployMutation.isError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                                <p className="text-red-800 font-medium">Deployment Failed</p>
                            </div>
                            <p className="text-sm text-red-600 mt-2">
                                {deployMutation.error?.message ||
                                    "An error occurred during deployment"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showContractInfoModal && (
                <ContractCompileInfoModal
                    isOpen={showContractInfoModal}
                    onClose={() => setShowContractInfoModal(false)}
                    contractString={ERC721_TEMPLATE}
                />
            )}
            {showModal && (
                <ContractModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    localStorageKey="latest_erc721_deployment"
                />
            )}
        </div>
    )
}

export default ERC721Deployer
