"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast" // Optional: for notifications
import { InputForm } from "./InputField"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { requestTokensTx } from "@/app/actions/request-tokens"

// 1. Schema definition
const requestTokenSchema = z.object({
    amount: z
        .number({ invalid_type_error: "Amount is required" })
        .positive("Must be greater than 0")
        .lt(25, "Amount must be less than 25"),
})

// 2. Inferred form type
type RequestTokenFormData = z.infer<typeof requestTokenSchema>

// 3. Your modal component
const RequestTokenModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
    } = useForm<RequestTokenFormData>({
        resolver: zodResolver(requestTokenSchema),
        defaultValues: {
            amount: 0,
        },
    })
    const { address } = useAccount()
    // 4. Mutation logic
    const requestTokens = useMutation({
        mutationFn: async ({ amount }: RequestTokenFormData) => {
            // Simulate a real request
            await new Promise(res => setTimeout(res, 1000))
            const txHash = await requestTokensTx(amount, address)
            // Or call your real API/faucet logic here
            return { amount, txHash: txHash }
        },
        onSuccess: ({ amount, txHash }) => {
            toast.success(`Requested ${amount} tokens successfully! `)
            toast.success(`Transaction Hash: ${txHash}`)
            reset()
            onClose()
        },
        onError: () => {
            toast.error("Failed to request tokens")
        },
    })

    const onSubmit = (data: RequestTokenFormData) => {
        requestTokens.mutate(data)
    }

    console.log(getValues())

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Token</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className="space-y-2 flex gap-2 flex-col">
                            <input
                                className={cn(
                                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                    errors.amount &&
                                        "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                id="amount"
                                // label="Amount"
                                placeholder="Amount"
                                // type="number"
                                {...register("amount", { valueAsNumber: true })}
                                disabled={requestTokens.isPending}
                            />
                            {errors.amount && (
                                <p className="text-sm text-red-500">{errors.amount.message}</p>
                            )}

                            <p className="text-sm text-gray-500">TO Address : {address}</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={requestTokens.isPending}
                            className="w-full"
                        >
                            {requestTokens.isPending ? "Requesting..." : "Request Tokens"}
                        </Button>
                    </form>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default RequestTokenModal
