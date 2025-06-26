"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    useAccount,
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useBalance,
    useWatchContractEvent,
} from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { erc20Abi } from "@/constants"
import { parseUnits, formatUnits, isAddress, type Address } from "viem"
import toast from "react-hot-toast"
import * as Accordion from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { ChevronDown, Loader2, CheckCircle, XCircle, Copy, ExternalLink, Link } from "lucide-react"
import { InputForm } from "@/components/ui/InputField"
import {
    // Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/Accordion"
import { formatNumberCompact } from "@/utils"
import RequestTokenModal from "@/components/ui/RequestTokenModal"
import { Button } from "@/components/ui/button"
import ApproveTokenModal from "@/components/ui/ApproveTokenModal"
// Contract address - replace with your actual deployed ERC-20 contract address
const ERC20_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PTK as Address

interface ContractEvent {
    type: string
    from?: string
    to?: string
    owner?: string
    spender?: string
    value?: bigint
    timestamp: string
}

const Erc20ContractPage = () => {
    const { address, isConnected } = useAccount()
    const [contractAddress, setContractAddress] = useState<Address>(ERC20_CONTRACT_ADDRESS)
    const [recipientAddress, setRecipientAddress] = useState("")
    const [spenderAddress, setSpenderAddress] = useState("")
    const [ownerAddress, setOwnerAddress] = useState("")
    const [minterAddress, setMinterAddress] = useState("")
    const [blacklistAddress, setBlacklistAddress] = useState("")
    const [newOwnerAddress, setNewOwnerAddress] = useState("")
    const [newBlacklisterAddress, setNewBlacklisterAddress] = useState("")
    const [newPauserAddress, setNewPauserAddress] = useState("")
    const [newRescuerAddress, setNewRescuerAddress] = useState("")
    const [newMasterMinterAddress, setNewMasterMinterAddress] = useState("")
    const [rescueTokenAddress, setRescueTokenAddress] = useState("")
    const [rescueRecipientAddress, setRescueRecipientAddress] = useState("")
    const [recentEvents, setRecentEvents] = useState<ContractEvent[]>([])
    const [showRequestTokenModal, setShowRequestTokenModal] = useState(false)
    const [showApproveTokenModal, setShowApproveTokenModal] = useState(false)
    // Use useRef for amount fields to avoid re-renders
    const transferAmountRef = useRef<HTMLInputElement>(null)
    const approveAmountRef = useRef<HTMLInputElement>(null)
    const transferFromAmountRef = useRef<HTMLInputElement>(null)
    const mintAmountRef = useRef<HTMLInputElement>(null)
    const burnAmountRef = useRef<HTMLInputElement>(null)
    const minterAmountRef = useRef<HTMLInputElement>(null)
    const rescueAmountRef = useRef<HTMLInputElement>(null)

    // Read contract functions
    const { data: tokenName } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "name",
    })

    const { data: tokenSymbol } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "symbol",
    })

    const { data: tokenDecimals } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "decimals",
    })

    const { data: totalSupply } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "totalSupply",
    })

    const { data: userBalance } = useBalance({
        address: address,
        token: contractAddress,
    })

    const { data: isPaused } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "paused",
    })

    const { data: contractOwner } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "owner",
    })

    const { data: pauser } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "pauser",
    })

    const { data: blacklister } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "blacklister",
    })

    const { data: masterMinter } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "masterMinter",
    })

    const { data: rescuer } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "rescuer",
    })

    const { data: version } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: "version",
    })

    const { data: allowance } = useReadContract({
        abi: erc20Abi,
        address: contractAddress as `0x${string}`,
        functionName: "allowance",
        args: [process.env.NEXT_PUBLIC_PTK_OWNER as Address, address as Address], // Assuming PTK_ADDRESS is the spender for the main allowance display
        query: {
            enabled: !!address,
        },
    })
    // Write contract functions
    const { writeContract, data: hash, isPending, error } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    // Watch events
    // useWatchContractEvent({
    //     address: contractAddress,
    //     abi: erc20Abi,
    //     eventName: "Transfer",
    //     onLogs: logs => {
    //         if (logs.length > 0 && "args" in logs[0] && logs[0].args) {
    //             const args = logs[0].args as any
    //             const newEvent: ContractEvent = {
    //                 type: "Transfer",
    //                 from: args.from as string,
    //                 to: args.to as string,
    //                 value: args.value as bigint,
    //                 timestamp: new Date().toLocaleTimeString(),
    //             }
    //             setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)])
    //         }
    //     },
    // })

    // useWatchContractEvent({
    //     address: contractAddress,
    //     abi: erc20Abi,
    //     eventName: "Approval",
    //     onLogs: logs => {
    //         if (logs.length > 0 && "args" in logs[0] && logs[0].args) {
    //             const args = logs[0].args as any
    //             const newEvent: ContractEvent = {
    //                 type: "Approval",
    //                 owner: args.owner as string,
    //                 spender: args.spender as string,
    //                 value: args.value as bigint,
    //                 timestamp: new Date().toLocaleTimeString(),
    //             }
    //             setRecentEvents(prev => [newEvent, ...prev.slice(0, 9)])
    //         }
    //     },
    // })

    // Transaction status notifications
    useEffect(() => {
        if (isPending) {
            toast.loading("Waiting for wallet confirmation...", { id: "transaction" })
        }
        if (isConfirming) {
            toast.loading("Transaction sent...", { id: "transaction" })
        }
        if (isConfirmed) {
            toast.success("Transaction confirmed!", { id: "transaction" })
        }
        if (error) {
            toast.error(`Transaction failed: ${error.message}`, { id: "transaction" })
        }
    }, [isPending, isConfirming, isConfirmed, error])

    // Helper functions
    const handleTransfer = () => {
        if (!isAddress(recipientAddress)) {
            toast.error("Invalid recipient address")
            return
        }
        const amount = transferAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "transfer",
                args: [recipientAddress as Address, parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to transfer tokens")
        }
    }

    const handleApprove = () => {
        if (!isAddress(spenderAddress)) {
            toast.error("Invalid spender address")
            return
        }
        const amount = approveAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "approve",
                args: [spenderAddress as Address, parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to approve tokens")
        }
    }

    const handleTransferFrom = () => {
        if (!isAddress(ownerAddress) || !isAddress(recipientAddress)) {
            toast.error("Invalid addresses")
            return
        }
        const amount = transferFromAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "transferFrom",
                args: [ownerAddress as Address, recipientAddress as Address, parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to transfer from")
        }
    }

    const handleMint = () => {
        if (!isAddress(recipientAddress)) {
            toast.error("Invalid recipient address")
            return
        }
        const amount = mintAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "mint",
                args: [recipientAddress as Address, parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to mint tokens")
        }
    }

    const handleBurn = () => {
        const amount = burnAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "burn",
                args: [parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to burn tokens")
        }
    }

    const handleBlacklist = (action: "blacklist" | "unBlacklist") => {
        if (!isAddress(blacklistAddress)) {
            toast.error("Invalid address")
            return
        }

        try {
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: action,
                args: [blacklistAddress as Address],
            })
        } catch (error) {
            toast.error(`Failed to ${action} address`)
        }
    }

    const handleConfigureMinter = () => {
        if (!isAddress(minterAddress)) {
            toast.error("Invalid minter address")
            return
        }
        const amount = minterAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "configureMinter",
                args: [minterAddress as Address, parsedAmount],
            })
        } catch (error) {
            toast.error("Failed to configure minter")
        }
    }

    const handleRemoveMinter = () => {
        if (!isAddress(minterAddress)) {
            toast.error("Invalid minter address")
            return
        }

        try {
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "removeMinter",
                args: [minterAddress as Address],
            })
        } catch (error) {
            toast.error("Failed to remove minter")
        }
    }

    const handlePause = (action: "pause" | "unpause") => {
        try {
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: action,
                args: [],
            })
        } catch (error) {
            toast.error(`Failed to ${action} contract`)
        }
    }

    const handleUpdateRole = (role: string, address: string, functionName: string) => {
        if (!isAddress(address)) {
            toast.error(`Invalid ${role} address`)
            return
        }

        try {
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName,
                args: [address as Address],
            })
        } catch (error) {
            toast.error(`Failed to update ${role}`)
        }
    }

    const handleTransferOwnership = () => {
        if (!isAddress(newOwnerAddress)) {
            toast.error("Invalid new owner address")
            return
        }

        try {
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "transferOwnership",
                args: [newOwnerAddress as Address],
            })
        } catch (error) {
            toast.error("Failed to transfer ownership")
        }
    }

    const handleRescueERC20 = () => {
        if (!isAddress(rescueTokenAddress) || !isAddress(rescueRecipientAddress)) {
            toast.error("Invalid addresses")
            return
        }
        const amount = rescueAmountRef.current?.value
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Invalid amount")
            return
        }

        try {
            const decimals = typeof tokenDecimals === "number" ? tokenDecimals : 18
            const parsedAmount = parseUnits(amount, decimals)
            writeContract({
                address: contractAddress,
                abi: erc20Abi,
                functionName: "rescueERC20",
                args: [
                    rescueTokenAddress as Address,
                    rescueRecipientAddress as Address,
                    parsedAmount,
                ],
            })
        } catch (error) {
            toast.error("Failed to rescue tokens")
        }
    }

    // Read function components
    const ReadFunctionSection = () => (
        <Accordion.Item value="read-functions" className="border rounded-lg">
            <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                <span>Read Functions</span>
                <ChevronDown className="h-4 w-4 transition-transform" />
            </Accordion.Trigger>
            <Accordion.Content className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Token Name</h3>
                        <p className="text-lg">{String(tokenName || "Loading...")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Token Symbol</h3>
                        <p className="text-lg">{String(tokenSymbol || "Loading...")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Decimals</h3>
                        <p className="text-lg">{String(tokenDecimals || "Loading...")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Total Supply</h3>
                        <p className="text-lg">
                            {totalSupply && typeof tokenDecimals === "number"
                                ? formatNumberCompact(
                                      formatUnits(totalSupply as bigint, tokenDecimals)
                                  )
                                : "Loading..."}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Your Balance</h3>
                        <p className="text-lg">
                            {userBalance
                                ? formatNumberCompact(
                                      formatUnits(userBalance.value, userBalance.decimals)
                                  )
                                : "0"}
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Your Allowance </h3>
                        <p className="text-lg">
                            {allowance
                                ? formatUnits(allowance as bigint, tokenDecimals as number)
                                : "0"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Owner</h3>
                        <p className="text-sm font-mono break-all">
                            {String(contractOwner || "Loading...")}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Pauser</h3>
                        <p className="text-sm font-mono break-all">
                            {String(pauser || "Loading...")}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Blacklister</h3>
                        <p className="text-sm font-mono break-all">
                            {String(blacklister || "Loading...")}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Master Minter</h3>
                        <p className="text-sm font-mono break-all">
                            {String(masterMinter || "Loading...")}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Rescuer</h3>
                        <p className="text-sm font-mono break-all">
                            {String(rescuer || "Loading...")}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Version</h3>
                        <p className="text-lg">{String(version || "Loading...")}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Contract Status</h3>
                        <p className="text-lg">
                            <span
                                className={cn(
                                    "px-2 py-1 rounded text-sm",
                                    isPaused
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                )}
                            >
                                {isPaused ? "Paused" : "Active"}
                            </span>
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Currency</h3>
                        <p className="text-lg">{String(tokenName || "Loading...")}</p>
                    </div>
                </div>

                {/* {currency && (
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Currency</h3>
                        <p className="text-lg">{String(currency)}</p>
                    </div>
                )} */}
            </Accordion.Content>
        </Accordion.Item>
    )

    // Write function components
    const WriteFunctionSection = () => (
        <Accordion.Item value="write-functions" className="border rounded-lg">
            <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                <span>Write Functions</span>
                <ChevronDown className="h-4 w-4 transition-transform" />
            </Accordion.Trigger>
            <Accordion.Content className="p-4 space-y-6">
                {/* Basic Token Operations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Token Operations</h3>

                    {/* Transfer */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Transfer Tokens</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Recipient Address"
                                value={recipientAddress}
                                onChange={e => setRecipientAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                ref={transferAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleTransfer}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transfer"}
                        </button>
                    </div>

                    {/* Approve */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Approve Tokens</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Spender Address"
                                value={spenderAddress}
                                onChange={e => setSpenderAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                ref={approveAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleApprove}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                        </button>
                    </div>

                    {/* Transfer From */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Transfer From</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="From Address"
                                value={ownerAddress}
                                onChange={e => setOwnerAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="To Address"
                                value={recipientAddress}
                                onChange={e => setRecipientAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                ref={transferFromAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleTransferFrom}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Transfer From"
                            )}
                        </button>
                    </div>

                    {/* Mint */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Mint Tokens (Privileged)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Recipient Address"
                                value={recipientAddress}
                                onChange={e => setRecipientAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                ref={mintAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleMint}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mint"}
                        </button>
                    </div>

                    {/* Burn */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Burn Tokens</h4>
                        <input
                            type="number"
                            placeholder="Amount"
                            ref={burnAmountRef}
                            className="p-2 border rounded w-full md:w-1/2"
                        />
                        <button
                            onClick={handleBurn}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Burn"}
                        </button>
                    </div>
                </div>

                {/* Administrative Functions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Administrative Functions</h3>

                    {/* Blacklist Management */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Blacklist Management</h4>
                        <input
                            type="text"
                            placeholder="Address to blacklist/unblacklist"
                            value={blacklistAddress}
                            onChange={e => setBlacklistAddress(e.target.value)}
                            className="p-2 border rounded w-full md:w-1/2"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleBlacklist("blacklist")}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Blacklist"
                                )}
                            </button>
                            <button
                                onClick={() => handleBlacklist("unBlacklist")}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Unblacklist"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Minter Management */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Minter Management</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Minter Address"
                                value={minterAddress}
                                onChange={e => setMinterAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Minter Allowance"
                                ref={minterAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleConfigureMinter}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Configure Minter"
                                )}
                            </button>
                            <button
                                onClick={handleRemoveMinter}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Remove Minter"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Pause/Unpause */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Contract Pause Control</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePause("pause")}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Pause"
                                )}
                            </button>
                            <button
                                onClick={() => handlePause("unpause")}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Unpause"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Role Updates */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Role Management</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="New Owner Address"
                                value={newOwnerAddress}
                                onChange={e => setNewOwnerAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={handleTransferOwnership}
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Transfer Ownership"
                                )}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="New Blacklister Address"
                                value={newBlacklisterAddress}
                                onChange={e => setNewBlacklisterAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() =>
                                    handleUpdateRole(
                                        "blacklister",
                                        newBlacklisterAddress,
                                        "updateBlacklister"
                                    )
                                }
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Update Blacklister"
                                )}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="New Pauser Address"
                                value={newPauserAddress}
                                onChange={e => setNewPauserAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() =>
                                    handleUpdateRole("pauser", newPauserAddress, "updatePauser")
                                }
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Update Pauser"
                                )}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="New Rescuer Address"
                                value={newRescuerAddress}
                                onChange={e => setNewRescuerAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() =>
                                    handleUpdateRole("rescuer", newRescuerAddress, "updateRescuer")
                                }
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Update Rescuer"
                                )}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="New Master Minter Address"
                                value={newMasterMinterAddress}
                                onChange={e => setNewMasterMinterAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <button
                                onClick={() =>
                                    handleUpdateRole(
                                        "master minter",
                                        newMasterMinterAddress,
                                        "updateMasterMinter"
                                    )
                                }
                                disabled={isPending || !isConnected}
                                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Update Master Minter"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Rescue ERC20 */}
                    <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Rescue ERC20 Tokens</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Token Contract Address"
                                value={rescueTokenAddress}
                                onChange={e => setRescueTokenAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Recipient Address"
                                value={rescueRecipientAddress}
                                onChange={e => setRescueRecipientAddress(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                ref={rescueAmountRef}
                                className="p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleRescueERC20}
                            disabled={isPending || !isConnected}
                            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Rescue Tokens"
                            )}
                        </button>
                    </div>
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )

    // Events section
    const EventsSection = () => (
        <Accordion.Item value="events" className="border rounded-lg">
            <Accordion.Trigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                <span>Recent Events</span>
                <ChevronDown className="h-4 w-4 transition-transform" />
            </Accordion.Trigger>
            <Accordion.Content className="p-4">
                <div className="space-y-2">
                    {recentEvents.length === 0 ? (
                        <p className="text-gray-500">No recent events</p>
                    ) : (
                        recentEvents.map((event, index) => (
                            <div key={index} className="p-3 border rounded bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{event.type}</span>
                                    <span className="text-sm text-gray-500">
                                        {event.timestamp}
                                    </span>
                                </div>
                                {event.type === "Transfer" && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>From: {event.from}</p>
                                        <p>To: {event.to}</p>
                                        <p>
                                            Value:{" "}
                                            {event.value
                                                ? formatUnits(
                                                      event.value,
                                                      typeof tokenDecimals === "number"
                                                          ? tokenDecimals
                                                          : 18
                                                  )
                                                : "0"}
                                        </p>
                                    </div>
                                )}
                                {event.type === "Approval" && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        <p>Owner: {event.owner}</p>
                                        <p>Spender: {event.spender}</p>
                                        <p>
                                            Value:{" "}
                                            {event.value
                                                ? formatUnits(
                                                      event.value,
                                                      typeof tokenDecimals === "number"
                                                          ? tokenDecimals
                                                          : 18
                                                  )
                                                : "0"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    {/* <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            ERC-20 Contract Interaction
                        </h1>
                    </div> */}

                    {!isConnected && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">
                                Please connect your wallet to interact with the ERC-20 contract.
                            </p>
                        </div>
                    )}

                    {/* Contract Address */}
                    <div className="mt-4 p-4 bg-white border rounded-lg flex items-center justify-between">
                        {/* <h2 className="font-semibold text-gray-700 mb-2">Contract Address</h2> */}
                        <div className="flex items-end gap-2">
                            {/* <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {contractAddress}
                            </code> */}
                            <InputForm
                                value={contractAddress}
                                onChange={e => setContractAddress(e as Address)}
                                label="Contract Address"
                                placeholder="Enter Contract Address"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(contractAddress)
                                    toast.success("Address copied to clipboard")
                                }}
                                className="p-1 hover:bg-gray-200 rounded"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {" "}
                            <Button
                                onClick={() => setShowRequestTokenModal(true)}
                                // variant="outline"
                                size="sm"
                            >
                                Request Some Token
                            </Button>{" "}
                            <Button
                                onClick={() => setShowApproveTokenModal(true)}
                                variant="outline"
                                size="sm"
                            >
                                Get Approve Some token
                            </Button>{" "}
                        </div>
                    </div>
                </div>

                {/* Transaction Status */}
                {hash && (
                    <div className="mb-6 p-4 bg-white border rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-700">Transaction Status</h3>
                                <p className="text-sm text-gray-600">
                                    Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isPending && (
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                )}
                                {isConfirming && (
                                    <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                                )}
                                {isConfirmed && <CheckCircle className="h-5 w-5 text-green-600" />}
                                {error && <XCircle className="h-5 w-5 text-red-600" />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <Accordion.Root
                    defaultValue={["read-functions"]}
                    type="multiple"
                    className="space-y-4"
                >
                    <ReadFunctionSection />
                    <WriteFunctionSection />
                    <EventsSection />

                    <RequestTokenModal
                        isOpen={showRequestTokenModal}
                        onClose={() => setShowRequestTokenModal(false)}
                    />

                    <ApproveTokenModal
                        isOpen={showApproveTokenModal}
                        onClose={() => setShowApproveTokenModal(false)}
                    />

                    <Accordion.Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                            value="sepolia-erc20"
                            className="border rounded-lg overflow-hidden bg-card"
                        >
                            <AccordionTrigger className="text-lg font-semibold px-4 hover:no-underline hover:bg-accent/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    Sepolia ERC20 Contract
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4 p-4 bg-accent/5">
                                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                                        <p className="font-mono text-sm break-all text-primary">
                                            Contract Address:
                                            0x71Cc1Abcb77Cd3d486AB8774e67D2B11b052210B
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-primary">Description</h4>
                                        <p className="text-muted-foreground">
                                            This is a standard ERC20 token contract deployed on the
                                            Sepolia testnet. It implements all the standard ERC20
                                            functions including transfer, approve, and
                                            transferFrom. The contract is used for testing and
                                            development purposes.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-primary">Features</h4>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            <li>Standard ERC20 implementation</li>
                                            <li>Transfer and approval functionality</li>
                                            <li>Balance tracking</li>
                                            <li>Event emission for transfers and approvals</li>
                                        </ul>
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            onClick={() => setShowApproveTokenModal(true)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                                                target="_blank"
                                            >
                                                View on Explorer
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion.Accordion>
                </Accordion.Root>
            </div>
        </div>
    )
}

export default Erc20ContractPage
