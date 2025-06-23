"use client"

import React, { useState } from "react"
import { ContractModal } from "@/components/ui/ContractModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    Calendar,
    Hash,
    Coins,
    Info,
    ExternalLink,
    Trash2,
    Loader2,
} from "lucide-react"
import toast from "react-hot-toast"
import { useDeployments, useDeploymentActions } from "@/hooks/useDeployments"

const DeploymentsPage = () => {
    const [selectedDeployment, setSelectedDeployment] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)

    const { data: deployments = [], isLoading, error } = useDeployments()
    const { deleteDeployment, clearAllDeployments } = useDeploymentActions()

    const handleShowDeploymentInfo = (deployment: any) => {
        setSelectedDeployment(deployment)
        setShowModal(true)
    }

    const handleDeleteDeployment = (contractAddress: string) => {
        if (
            confirm(
                "Are you sure you want to delete this deployment record? This will only remove it from your local storage."
            )
        ) {
            deleteDeployment(contractAddress)
            toast.success("Deployment record deleted")
        }
    }

    const openInExplorer = (hash: string) => {
        window.open(`https://sepolia.etherscan.io/tx/${hash}`, "_blank")
    }

    const openContractInExplorer = (address: string) => {
        window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank")
    }

    const openContractPage = (address: string) => {
        window.location.href = `/erc20-contract?address=${address}`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading deployments...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading deployments</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Deployment History</h1>
                    <p className="text-gray-600">
                        View all your deployed ERC-20 contracts and their details.
                    </p>
                </div>

                {/* Deployments List */}
                {deployments.length === 0 ? (
                    <div className="text-center py-12">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Deployments Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You haven't deployed any contracts yet, or your deployment history has
                            been cleared.
                        </p>
                        <Button onClick={() => (window.location.href = "/deployer")}>
                            Deploy Your First Contract
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {deployments.map((deployment, index) => (
                            <Card
                                key={deployment.contractAddress}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Coins className="h-5 w-5 text-blue-600" />
                                                {deployment.tokenName} ({deployment.tokenSymbol})
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(
                                                        deployment.deploymentDate
                                                    ).toLocaleDateString()}
                                                </span>
                                                <Badge variant="secondary">
                                                    {deployment.network}
                                                </Badge>
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleShowDeploymentInfo(deployment)
                                                }
                                            >
                                                <Info className="h-4 w-4" />
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleDeleteDeployment(
                                                        deployment.contractAddress
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Contract Address
                                            </p>
                                            <p className="font-mono text-sm break-all">
                                                {deployment.contractAddress.slice(0, 10)}...
                                                {deployment.contractAddress.slice(-8)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Initial Supply
                                            </p>
                                            <p className="font-semibold">
                                                {deployment.initialSupply}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Decimals
                                            </p>
                                            <p className="font-semibold">
                                                {deployment.tokenDecimals}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                Gas Used
                                            </p>
                                            <p className="font-semibold">{deployment.gasUsed}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                openContractPage(deployment.contractAddress)
                                            }
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            Interact
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                openContractInExplorer(deployment.contractAddress)
                                            }
                                        >
                                            <Building2 className="h-4 w-4 mr-1" />
                                            View Contract
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                openInExplorer(deployment.transactionHash)
                                            }
                                        >
                                            <Hash className="h-4 w-4 mr-1" />
                                            View Transaction
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Clear All Button */}
                {deployments.length > 0 && (
                    <div className="mt-8 text-center">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (
                                    confirm(
                                        "Are you sure you want to clear all deployment records? This action cannot be undone."
                                    )
                                ) {
                                    clearAllDeployments()
                                    toast.success("All deployment records cleared")
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All Records
                        </Button>
                    </div>
                )}
            </div>

            {/* Contract Modal */}
            {selectedDeployment && (
                <ContractModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedDeployment(null)
                    }}
                    deploymentInfo={selectedDeployment}
                />
            )}
        </div>
    )
}

export default DeploymentsPage
