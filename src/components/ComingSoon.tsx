import React, { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { sepolia } from "wagmi/chains"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn, copyToClipboard } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink, Info } from "lucide-react"

const ComingSoon = () => {
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
    const handleSwitchToSepolia = () => {
        if (switchChain) {
            switchChain({ chainId: sepolia.id })
        }
    }
    return (
        <div>
            {" "}
            <div className="container mx-auto px-4 py-8">
                {/* Header */}

                {/* Deployment Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">ERC-721 Deployment Form</h3>
                        <p className="text-gray-600 mb-6">
                            ERC-721 deployment functionality is coming soon. This will allow you to
                            deploy NFT contracts with custom metadata and minting capabilities.
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">
                                    Features Coming Soon
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Custom NFT name and symbol</li>
                                    <li>• Metadata URI configuration</li>
                                    <li>• Minting permissions and limits</li>
                                    <li>• Royalty settings</li>
                                    <li>• Batch minting capabilities</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-semibold text-yellow-900 mb-2">
                                    Development Status
                                </h4>
                                <p className="text-sm text-yellow-800">
                                    The ERC-721 deployer is currently under development. Check back
                                    soon for the full NFT deployment experience!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Deployment Status */}

                    {/* Success Status */}
                    {isDeployed && deployedAddress && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <p className="text-green-800 font-medium">
                                    ERC-721 Contract Deployed Successfully!
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
                                            {/* <button
                                                onClick={() => openInExplorer(deploymentHash)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Status */}
                </div>

                {/* Information Section */}
                <div className="mt-8 max-w-2xl mx-auto">
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            ERC-721 Deployment Information
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>
                                <strong>Network:</strong> Sepolia Testnet (Test network for
                                Ethereum)
                            </p>
                            <p>
                                <strong>Gas Fees:</strong> You'll need some Sepolia ETH around
                                ~0.003 ETH to pay for deployment gas fees
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
                                <strong>NFT Standard:</strong> ERC-721 is the standard for
                                non-fungible tokens (NFTs)
                            </p>
                            <p>
                                <strong>Test NFTs:</strong> These are test NFTs and have no real
                                value
                            </p>
                            <a
                                href="https://github.com/cyfrin/TSender"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 w-max rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border-2 border-zinc-600 hover:border-zinc-500 cursor-alias hidden md:block"
                            >
                                <FaGithub className="h-5 w-5 text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon

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
                        ERC-721 Deployment Gas Costs
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-gray-700">
                    <p className="text-sm leading-relaxed">
                        <strong>
                            ERC-721 deployment gas costs are typically higher than ERC-20:
                        </strong>
                    </p>

                    <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-2">Complexity</h4>
                            <p className="text-sm text-blue-800">
                                ERC-721 contracts are more complex than ERC-20 contracts due to the
                                need to track individual token IDs and metadata.
                            </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-900 mb-2">
                                Storage Requirements
                            </h4>
                            <p className="text-sm text-green-800">
                                NFT contracts require more storage slots for token ownership,
                                metadata URIs, and approval mappings.
                            </p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-900 mb-2">Gas Estimation</h4>
                            <p className="text-sm text-purple-800">
                                Typical ERC-721 deployment costs range from 0.002 to 0.005 ETH on
                                Sepolia, depending on the contract complexity and features.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Gas Cost Breakdown</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="font-medium">Contract Component</span>
                                <span className="font-medium">Gas Impact</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">Basic ERC-721</span>
                                <span className="text-sm text-green-600">~2M gas</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">With metadata</span>
                                <span className="text-sm text-orange-600">+500K gas</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white rounded border">
                                <span className="text-sm">With royalties</span>
                                <span className="text-sm text-orange-600">+300K gas</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Key Takeaway</h4>
                        <p className="text-sm text-yellow-800">
                            ERC-721 deployment costs more than ERC-20 due to increased complexity
                            and storage requirements. Make sure you have sufficient Sepolia ETH for
                            deployment.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
