"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Info, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip"
import z from "zod"
import { InputForm } from "./ui/InputField"
import { erc721DeploymentSchema } from "@/lib/schemas/Erc721Schema"

export type ERC721DeploymentFormData = z.infer<typeof erc721DeploymentSchema>

export function ERC721DeploymentForm({
    onSubmit,
    isPending,
}: {
    onSubmit: (data: ERC721DeploymentFormData) => void
    isPending: boolean
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ERC721DeploymentFormData>({
        resolver: zodResolver(erc721DeploymentSchema),
        defaultValues: {
            name: "PTK NFT",
            symbol: "PTK-NFT",
            baseURI: "https://ptk.com/nft/",
            privateKey: "",
        },
    })
    console.log("getValues", getValues())

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <InputForm
                    label={"Private Key"}
                    id="privateKey"
                    type="text"
                    placeholder="e.g., My Awesome Private Key"
                    {...register("privateKey")}
                    returnEvent={true}
                />
                <p className="text-red-500 text-sm">
                    "PROMISE I WILL DEPLOY WITH THIS PRIVATE KEY"
                </p>
            </div>
            <div className="space-y-2">
                <InputForm
                    label={"NFT Collection Name"}
                    id="name"
                    placeholder="My Awesome NFTs"
                    {...register("name")}
                    returnEvent={true}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <InputForm
                    label={"Collection Symbol"}
                    id="symbol"
                    placeholder="AWESOME"
                    {...register("symbol")}
                    returnEvent={true}
                />
                {errors.symbol && <p className="text-sm text-red-500">{errors.symbol.message}</p>}
            </div>

            <div className="space-y-2">
                <InputForm
                    label={
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-4 w-4 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Where your NFT metadata will be stored (e.g. IPFS URI)
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div> Base url</div>
                        </div>
                    }
                    id="baseURI"
                    placeholder="https://ipfs.io/ipfs/..."
                    {...register("baseURI")}
                    returnEvent={true}
                />
                {errors.baseURI && (
                    <p className="text-sm text-red-500">{errors.baseURI.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deploying...
                    </span>
                ) : (
                    "Compile and Deploy NFT Contract"
                )}
            </Button>
        </form>
    )
}
