"use client"

import React, { useState } from "react"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { sepolia } from "wagmi/chains"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContractModal } from "@/components/ui/ContractModal"
import { useDeployContract } from "@/hooks/useDeployContract"
import { deploymentFormSchema, type DeploymentFormData } from "@/lib/schemas/deploymentSchema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DeploymentForm } from "@/components/DeploymentForm"

const DeployerPage = () => {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const { switchChain } = useSwitchChain()
    const [deploymentHash, setDeploymentHash] = useState<string>("")
    const [deployedAddress, setDeployedAddress] = useState<string>("")
    const [isDeployed, setIsDeployed] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showGasInfoModal, setShowGasInfoModal] = useState(false)

    const isOnSepolia = chainId === sepolia.id

    // TanStack Query mutation
    const deployMutation = useDeployContract()

    const handleSwitchToSepolia = () => {
        if (switchChain) {
            switchChain({ chainId: sepolia.id })
        }
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const openInExplorer = (hash: string) => {
        window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
    }

    const handleShowInfo = () => {
        setShowModal(true)
    }

    const onSubmit = async (data: DeploymentFormData) => {
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
                userAddress: address!,
                ...data,
            })

            setDeploymentHash(result.transactionHash || "")
            setDeployedAddress(result.contractAddress || "")
            setIsDeployed(true)

            toast.success("Contract deployed successfully!")

            // Reset form after successful deployment
            return result
        } catch (error) {
            console.error("Deployment error:", error)
            toast.error(error instanceof Error ? error.message : "Deployment failed")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            ERC-20 Contract Deployer
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
                                    Please connect your wallet to deploy an ERC-20 contract.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Deployment Form */}
                <div className="max-w-2xl mx-auto">
                    <DeploymentForm onSubmit={onSubmit} />

                    {/* Deployment Status */}
                    {deployMutation.isPending && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <p className="text-blue-800">Deploying your ERC-20 contract...</p>
                            </div>
                            <p className="text-sm text-blue-600 mt-2">
                                This may take a few minutes. Please don't close this page.
                            </p>
                        </div>
                    )}

                    {/* Success Status */}
                    {isDeployed && deployedAddress && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <p className="text-green-800 font-medium">
                                    Contract Deployed Successfully!
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Contract Address:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                                            {deployedAddress}
                                        </code>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    deployedAddress,
                                                    "Contract address"
                                                )
                                            }
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {deploymentHash && (
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction Hash:</p>
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                                                {deploymentHash}
                                            </code>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        deploymentHash,
                                                        "Transaction hash"
                                                    )
                                                }
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openInExplorer(deploymentHash)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <button
                                        onClick={handleShowInfo}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Info className="h-4 w-4" />
                                        Show Deployment Info
                                    </button>
                                    <a
                                        href={`/erc20-contract?address=${deployedAddress}`}
                                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Interact with Contract
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Status */}
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

                {/* Information Section */}
                <div className="mt-8 max-w-2xl mx-auto">
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Deployment Information</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>
                                <strong>Network:</strong> Sepolia Testnet (Test network for
                                Ethereum)
                            </p>
                            <p>
                                <strong>Gas Fees:</strong> You'll need some Sepolia ETH around
                                ~0.00259 ETH to pay for deployment gas fees
                                <button
                                    onClick={() => setShowGasInfoModal(true)}
                                    className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                    <Info className="h-3 w-3" />
                                    Read More
                                </button>
                            </p>
                            <p>
                                <strong>Contract Owner:</strong> Your connected wallet address will
                                be set as the contract owner
                            </p>
                            <p>
                                <strong>Initial Supply:</strong> The specified amount will be
                                minted to your address
                            </p>
                            <p>
                                <strong>Test Tokens:</strong> These are test tokens and have no
                                real value
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {showGasInfoModal && (
                <InfoModal
                    showGasInfoModal={showGasInfoModal}
                    setShowGasInfoModal={setShowGasInfoModal}
                />
            )}

            {/* Contract Modal */}
            <ContractModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                localStorageKey="latest_deployment"
            />

            {/* Gas Info Modal */}
        </div>
    )
}

export default DeployerPage

const InfoModal = ({
    showGasInfoModal,
    setShowGasInfoModal,
}: {
    showGasInfoModal: boolean
    setShowGasInfoModal: (open: boolean) => void
}) => {
    return (
        <Dialog open={showGasInfoModal} onOpenChange={setShowGasInfoModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Does Initial Supply Affect Gas Cost?
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-gray-700">
                    <p className="text-sm leading-relaxed">
                        <strong>Yes, it does — but with some nuance:</strong>
                    </p>

                    <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Minting Tokens</h4>
                            <p className="text-sm text-blue-800">
                                Minting tokens means writing data on-chain. The more tokens minted
                                (especially large initial supply), the more storage is used.
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2">Gas Calculation</h4>
                            <p className="text-sm text-green-800">
                                However, gas cost isn't proportional to the token amount value
                                itself, but rather to the number of storage slots written/updated.
                            </p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">
                                How Gas is Calculated Here
                            </h4>
                            <p className="text-sm text-purple-800">
                                The initial _mint writes to the owner's balance once in storage (a
                                single 256-bit slot). So, whether you mint 1 token or 1 billion
                                tokens in one go, the gas cost is roughly the same for that single
                                storage write.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Practical Gas Impact</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="font-medium">Initial Supply Size</span>
                                <span className="font-medium">Effect on Gas</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">1 token</span>
                                <span className="text-sm text-green-600">Minimal gas</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">1 billion tokens</span>
                                <span className="text-sm text-green-600">Roughly same gas</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">Minting in multiple calls</span>
                                <span className="text-sm text-orange-600">
                                    More gas (each write costs gas)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Key Takeaway</h4>
                        <p className="text-sm text-yellow-800">
                            The size of your initial supply doesn't significantly impact deployment
                            gas costs because it's all done in a single storage write operation.
                            The main gas cost comes from deploying the contract itself, not the
                            initial token minting.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
