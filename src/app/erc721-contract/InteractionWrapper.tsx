"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useReadContract, useAccount } from "wagmi"
import { erc721Abi } from "@/constants" // Assuming erc721Abi is correctly defined here
import { InputForm } from "@/components/ui/InputField"
import ConnectedGuard from "@/providers/ConnectedGuard"
import { formatUnits } from "viem"
import toast, { Toaster } from "react-hot-toast"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion"
import { TransactionSuccessModal } from "@/components/ui/TransactionSuccessModal"
import { Button } from "@/components/ui/button"
import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Address } from "viem"
import RequestNftModal from "@/components/ui/RequestNftModal"

const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`

export default function InteractionWrapper() {
    const [tokenId, setTokenId] = useState("")
    const [recipient, setRecipient] = useState("")
    const [approvedAddress, setApprovedAddress] = useState("")
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState<{ txId: string; action: string } | null>(null)
    const [contractAddress, setContractAddress] = useState(NFT_ADDRESS)
    const [showRequestNftModal, setShowRequestNftModal] = useState(false)

    // For query functions
    const [queryOwnerTokenId, setQueryOwnerTokenId] = useState("")
    const [queryApprovedTokenId, setQueryApprovedTokenId] = useState("")
    const [queryBalanceAddress, setQueryBalanceAddress] = useState("")

    const account = useAccount()
    const { writeContractAsync } = useWriteContract()

    // --- Read Contract Calls for NFT Metadata ---
    const { data: name } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "name",
    })

    const { data: symbol } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "symbol",
    })

    const { data: totalSupply } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "totalSupply",
    })

    // --- Read Contract Calls for Account Information ---
    const { data: balance } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "balanceOf",
        args: [account.address!],
        query: {
            enabled: !!account.address,
        },
    })

    const { data: ownerOf } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "ownerOf",
        args: [BigInt(tokenId || "0")],
        query: {
            enabled: !!tokenId,
        },
    })

    const { data: getApproved } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "getApproved",
        args: [BigInt(tokenId || "0")],
        query: {
            enabled: !!tokenId,
        },
    })

    // --- Read Contract Calls for Query Functions Section ---
    const { data: queriedOwner } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "ownerOf",
        args: [BigInt(queryOwnerTokenId || "0")],
        query: {
            enabled: !!queryOwnerTokenId,
        },
    })

    const { data: queriedApproved } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "getApproved",
        args: [BigInt(queryApprovedTokenId || "0")],
        query: {
            enabled: !!queryApprovedTokenId,
        },
    })

    const { data: queriedBalance } = useReadContract({
        abi: erc721Abi,
        address: NFT_ADDRESS,
        functionName: "balanceOf",
        args: [queryBalanceAddress as `0x${string}`],
        query: {
            enabled: !!queryBalanceAddress,
        },
    })

    // --- Write Functions ---
    const handleTransfer = async () => {
        if (!tokenId || !recipient) {
            toast.error("Please enter token ID and recipient address")
            return
        }

        try {
            const tx = await writeContractAsync({
                abi: erc721Abi,
                address: NFT_ADDRESS,
                functionName: "transferFrom",
                args: [account.address!, recipient as `0x${string}`, BigInt(tokenId)],
            })

            setSuccessData({ txId: tx, action: "Transfer" })
            setShowSuccessModal(true)
            toast.success("Transfer successful!")
        } catch (error) {
            toast.error("Transfer failed")
            console.error(error)
        }
    }

    const handleApprove = async () => {
        if (!tokenId || !approvedAddress) {
            toast.error("Please enter token ID and approved address")
            return
        }

        try {
            const tx = await writeContractAsync({
                abi: erc721Abi,
                address: NFT_ADDRESS,
                functionName: "approve",
                args: [approvedAddress as `0x${string}`, BigInt(tokenId)],
            })

            setSuccessData({ txId: tx, action: "Approve" })
            setShowSuccessModal(true)
            toast.success("Approval successful!")
        } catch (error) {
            toast.error("Approval failed")
            console.error(error)
        }
    }

    const handleSafeTransfer = async () => {
        console.log("cliced", tokenId)
        if (!tokenId || !recipient) {
            toast.error("Please enter token ID and recipient address")
            return
        }

        try {
            const tx = await writeContractAsync({
                abi: erc721Abi,
                address: NFT_ADDRESS,
                functionName: "safeTransferFrom",
                args: [account.address!, recipient as `0x${string}`, BigInt(tokenId)],
            })

            setSuccessData({ txId: tx, action: "Safe Transfer" })
            setShowSuccessModal(true)
            toast.success("Safe transfer successful!")
        } catch (error) {
            console.log(error)
            toast.error("Safe transfer failed")
            console.error(error)
        }
    }

    const ReadFunctionSection = () => (
        <AccordionItem value="read-functions" className="border rounded-lg">
            <AccordionTrigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                <span>NFT Information</span>
                <ChevronDown className="h-4 w-4 transition-transform" />
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">NFT Name</h3>
                        <p className="text-lg">{String(name || "Loading...")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Symbol</h3>
                        <p className="text-lg">{String(symbol || "Loading...")}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Total Supply</h3>
                        <p className="text-lg">
                            {totalSupply ? totalSupply.toString() : "Loading..."}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-700">Your Balance</h3>
                        <p className="text-lg">{balance ? balance.toString() : "0"}</p>
                    </div>
                    {tokenId && (
                        <>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-gray-700">
                                    Owner of Token {tokenId}
                                </h3>
                                <p className="text-sm font-mono break-all">
                                    {ownerOf ? String(ownerOf) : "Loading..."}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold text-gray-700">
                                    Approved for Token {tokenId}
                                </h3>
                                <p className="text-sm font-mono break-all">
                                    {getApproved ? String(getApproved) : "None"}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-4">Query Functions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <InputForm
                                label="Token ID to query owner"
                                value={queryOwnerTokenId}
                                onChange={e => setQueryOwnerTokenId(e.target.value)}
                                placeholder="Enter token ID"
                                returnEvent={true}
                            />
                            <div className="p-3 border rounded bg-gray-50">
                                <p className="text-sm text-gray-600">Owner:</p>
                                <p className="font-mono break-all text-sm">
                                    {queriedOwner
                                        ? String(queriedOwner)
                                        : "Query result will appear here"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <InputForm
                                label="Token ID to query approved"
                                value={queryApprovedTokenId}
                                onChange={e => setQueryApprovedTokenId(e.target.value)}
                                placeholder="Enter token ID"
                                returnEvent={true}
                            />
                            <div className="p-3 border rounded bg-gray-50">
                                <p className="text-sm text-gray-600">Approved Address:</p>
                                <p className="font-mono break-all text-sm">
                                    {queriedApproved
                                        ? String(queriedApproved)
                                        : "Query result will appear here"}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <InputForm
                                label="Address to query balance"
                                value={queryBalanceAddress}
                                onChange={e => setQueryBalanceAddress(e.target.value)}
                                placeholder="Enter address"
                                returnEvent={true}
                            />
                            <div className="p-3 border rounded bg-gray-50">
                                <p className="text-sm text-gray-600">Balance:</p>
                                <p className="font-mono break-all text-sm">
                                    {queriedBalance
                                        ? queriedBalance.toString()
                                        : "Query result will appear here"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )

    const WriteFunctionSection = () => (
        <AccordionItem value="write-functions" className="border rounded-lg mt-4">
            <AccordionTrigger className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-gray-50">
                <span>NFT Actions</span>
                <ChevronDown className="h-4 w-4 transition-transform" />
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Transfer</h3>
                        <InputForm
                            label="Token ID"
                            value={tokenId}
                            onChange={e => setTokenId(e.target.value)}
                            placeholder="Enter token ID"
                            returnEvent={true}
                        />
                        <InputForm
                            label="Recipient Address"
                            value={recipient}
                            onChange={e => setRecipient(e.target.value)}
                            placeholder="Enter recipient address"
                            returnEvent={true}
                        />
                        <Button onClick={handleTransfer} className="w-full">
                            Transfer NFT
                        </Button>
                        <Button onClick={handleSafeTransfer} className="w-full" variant="outline">
                            Safe Transfer NFT
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Approval</h3>
                        <InputForm
                            label="Token ID"
                            value={tokenId}
                            onChange={e => setTokenId(e.target.value)}
                            placeholder="Enter token ID"
                            returnEvent={true}
                        />
                        <InputForm
                            label="Approved Address"
                            value={approvedAddress}
                            onChange={e => setApprovedAddress(e.target.value)}
                            placeholder="Enter address to approve"
                            returnEvent={true}
                        />
                        <Button onClick={handleApprove} className="w-full">
                            Approve NFT
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )

    return (
        <div className="max-w-6xl mx-auto p-4">
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
                        onClick={() => setShowRequestNftModal(true)}
                        // variant="outline"
                        size="sm"
                    >
                        Request A NFT
                    </Button>{" "}
                </div>
            </div>
            <Accordion.Root
                defaultValue={["read-functions", "write-functions"]}
                type="multiple"
                className="space-y-4"
            >
                <ReadFunctionSection />
                <WriteFunctionSection />
            </Accordion.Root>

            <TransactionSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                transactionId={successData?.txId || ""}
                action={successData?.action || ""}
            />

            <RequestNftModal
                isOpen={showRequestNftModal}
                onClose={() => setShowRequestNftModal(false)}
            />
        </div>
    )
}
