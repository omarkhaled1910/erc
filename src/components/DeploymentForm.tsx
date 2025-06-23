"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deploymentFormSchema, type DeploymentFormData } from "@/lib/schemas/deploymentSchema"

interface DeploymentFormProps {
    onSubmit: (data: DeploymentFormData) => Promise<any>
    isLoading?: boolean
    disabled?: boolean
}

export function DeploymentForm({
    onSubmit,
    isLoading = false,
    disabled = false,
}: DeploymentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeploymentFormData>({
        resolver: zodResolver(deploymentFormSchema),
        defaultValues: {
            tokenName: "PTK",
            tokenSymbol: "PTK",
            tokenDecimals: 18,
            initialSupply: "1000000",
            privateKey: "",
        },
    })

    const handleFormSubmit = async (data: DeploymentFormData) => {
        try {
            await onSubmit(data)
            // reset()
        } catch (error) {
            // Error handling is done in the parent component
            console.error("Form submission error:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700">
                        Private Key
                    </label>
                    <input
                        id="privateKey"
                        type="text"
                        placeholder="e.g., My Awesome Private Key"
                        {...register("privateKey")}
                        className={cn(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors.tokenName &&
                                "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    />
                    <p className="text-red-500 text-sm">
                        "PROMISE I WILL DEPLOY WITH THIS PRIVATE KEY"
                    </p>
                </div>
                <div className="space-y-2">
                    <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700">
                        Token Name *
                    </label>
                    <input
                        id="tokenName"
                        type="text"
                        placeholder="e.g., My Awesome Token"
                        {...register("tokenName")}
                        className={cn(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors.tokenName &&
                                "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    />
                    {errors.tokenName && (
                        <p className="text-red-500 text-sm">{errors.tokenName.message}</p>
                    )}
                </div>

                {/* Token Symbol */}
                <div className="space-y-2">
                    <label
                        htmlFor="tokenSymbol"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Token Symbol *S
                    </label>
                    <input
                        id="tokenSymbol"
                        type="text"
                        placeholder="e.g., MAT"
                        maxLength={10}
                        {...register("tokenSymbol")}
                        className={cn(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors.tokenSymbol &&
                                "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    />
                    <p className="text-xs text-gray-500">Maximum 10 characters</p>
                    {errors.tokenSymbol && (
                        <p className="text-red-500 text-sm">{errors.tokenSymbol.message}</p>
                    )}
                </div>

                {/* Token Decimals */}
                <div className="space-y-2">
                    <label
                        htmlFor="tokenDecimals"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Token Decimals *
                    </label>
                    <input
                        id="tokenDecimals"
                        type="number"
                        placeholder="18"
                        min={0}
                        max={18}
                        {...register("tokenDecimals", { valueAsNumber: true })}
                        className={cn(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors.tokenDecimals &&
                                "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    />
                    <p className="text-xs text-gray-500">Standard is 18 decimals</p>
                    {errors.tokenDecimals && (
                        <p className="text-red-500 text-sm">{errors.tokenDecimals.message}</p>
                    )}
                </div>

                {/* Initial Supply */}
                <div className="space-y-2">
                    <label
                        htmlFor="initialSupply"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Initial Supply *
                    </label>
                    <input
                        id="initialSupply"
                        type="number"
                        placeholder="1000000"
                        step="0.000001"
                        {...register("initialSupply")}
                        className={cn(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            errors.initialSupply &&
                                "border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                        disabled={isLoading || disabled}
                    />
                    <p className="text-xs text-gray-500">Total tokens to mint initially</p>
                    {errors.initialSupply && (
                        <p className="text-red-500 text-sm">{errors.initialSupply.message}</p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading || disabled}
                className="w-full"
                variant="default"
            >
                {isLoading ? "Deploying..." : "Compile & Deploy ERC-20 Contract"}
            </Button>
        </form>
    )
}
