"use client"

import { useState, useEffect } from "react"
import { useWriteContract, useReadContract, useAccount, useBalance } from "wagmi"
import { erc20Abi } from "@/constants" // Assuming erc20Abi is correctly defined here
import { InputForm } from "@/components/ui/InputField"
import ConnectedGuard from "@/providers/ConnectedGuard"
import { formatUnits } from "viem"
import toast, { Toaster } from "react-hot-toast"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/Accordion"
import { TransactionSuccessModal } from "@/components/ui/TransactionSuccessModal"

const DAI_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"

export default function InteractionWrapper() {
    const [amount, setAmount] = useState("")
    const [recipient, setRecipient] = useState("")
    const [spender, setSpender] = useState("") // State for the approve function's spender

    // State for transferFrom
    const [transferFromSender, setTransferFromSender] = useState("")
    const [transferFromRecipient, setTransferFromRecipient] = useState("")
    const [transferFromAmount, setTransferFromAmount] = useState("")

    // States for Query Functions section
    const [queryAllowanceOwner, setQueryAllowanceOwner] = useState("")
    const [queryAllowanceSpender, setQueryAllowanceSpender] = useState("")
    const [queryBalanceAddress, setQueryBalanceAddress] = useState("")

    const account = useAccount()
    const { writeContractAsync } = useWriteContract()

    const { data: balanceInWallet } = useBalance({
        address: account.address,
        query: {
            enabled: !!account.address,
        },
    })

    // --- Read Contract Calls for Token Metadata ---
    const { data: name } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "name",
    })
    console.log("name", name)
    console.log("account.address", account)

    const { data: symbol } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "symbol",
    })

    const { data: decimals } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "decimals",
    })

    const { data: totalSupply } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "totalSupply",
    })
    console.log("account", account)
    // --- Read Contract Calls for Account Information ---
    const { data: balance } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
        query: {
            enabled: !!account.address, // Only fetch if account.address is available
        },
    })

    const { data: allowance } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "allowance",
        args: [account.address, DAI_ADDRESS], // Assuming DAI_ADDRESS is the spender for the main allowance display
        query: {
            enabled: !!account.address,
        },
    })

    // --- Read Contract Calls for Query Functions Section ---
    const { data: queriedAllowance } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "allowance",
        args: [queryAllowanceOwner as `0x${string}`, queryAllowanceSpender as `0x${string}`],
        query: {
            enabled: !!queryAllowanceOwner && !!queryAllowanceSpender,
        },
    })

    const { data: queriedBalance } = useReadContract({
        abi: erc20Abi,
        address: DAI_ADDRESS as `0x${string}`,
        functionName: "balanceOf",
        args: [queryBalanceAddress as `0x${string}`],
        query: {
            enabled: !!queryBalanceAddress,
        },
    })

    const [useMyAddress, setUseMyAddress] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState<{ txId: string; action: string } | null>(null)

    // Add effect to update sender address when checkbox is checked
    useEffect(() => {
        if (useMyAddress && account.address) {
            setTransferFromSender(account.address)
        }
    }, [useMyAddress, account.address])

    // meta mask sepolia address 0xf292217C3A2BECCF143c516fbd6C27Cc597c20ac
    const handleTransfer = async () => {
        if (!recipient || !amount) {
            toast.error("Recipient and amount are required for transfer.")
            return
        }
        try {
            const loadingToast = toast.loading("Processing transfer...")
            const res = await writeContractAsync({
                abi: erc20Abi,
                address: DAI_ADDRESS as `0x${string}`,
                functionName: "transfer",
                args: [recipient as `0x${string}`, BigInt(amount)],
            })
            toast.dismiss(loadingToast)
            setSuccessData({ txId: res, action: "transfer" })
            setShowSuccessModal(true)
            setRecipient("")
            setAmount("")
        } catch (error) {
            toast.error(
                `Transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    const formatTokenAmount = (weiAmount: bigint | undefined) => {
        if (weiAmount === undefined || decimals === undefined) {
            return "0" // Or "Loading..."
        }
        try {
            // Convert BigInt wei amount to human-readable format
            return formatUnits(weiAmount, 18)
        } catch (e) {
            console.error("Error formatting amount:", e)
            return weiAmount.toString() // Fallback to raw wei if error
        }
    }
    const handleApprove = async () => {
        if (!spender || !amount) {
            toast.error("Spender and amount are required for approval.")
            return
        }
        try {
            const loadingToast = toast.loading("Processing approval...")
            const res = await writeContractAsync({
                abi: erc20Abi,
                address: DAI_ADDRESS as `0x${string}`,
                functionName: "approve",
                args: [spender as `0x${string}`, BigInt(amount)],
            })
            toast.dismiss(loadingToast)
            setSuccessData({ txId: res, action: "approval" })
            setShowSuccessModal(true)
            setSpender("")
            setAmount("")
        } catch (error) {
            toast.error(
                `Approval failed: ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    const handleTransferFrom = async () => {
        if (!transferFromSender || !transferFromRecipient || !transferFromAmount) {
            toast.error("Sender, recipient, and amount are required for transferFrom.")
            return
        }
        try {
            const loadingToast = toast.loading("Processing transfer from...")
            const res = await writeContractAsync({
                abi: erc20Abi,
                address: DAI_ADDRESS as `0x${string}`,
                functionName: "transferFrom",
                args: [
                    transferFromSender as `0x${string}`,
                    transferFromRecipient as `0x${string}`,
                    BigInt(transferFromAmount),
                ],
            })
            toast.dismiss(loadingToast)
            setSuccessData({ txId: res, action: "transfer from" })
            setShowSuccessModal(true)
            setTransferFromSender("")
            setTransferFromRecipient("")
            setTransferFromAmount("")
        } catch (error) {
            toast.error(
                `Transfer from failed: ${error instanceof Error ? error.message : "Unknown error"}`
            )
        }
    }

    return (
        <ConnectedGuard>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-8">
                {successData && (
                    <TransactionSuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => {
                            setShowSuccessModal(false)
                            setSuccessData(null)
                        }}
                        transactionId={successData.txId}
                        action={successData.action}
                    />
                )}
                <h2 className="text-3xl font-bold text-center">ERC-20 Token Dashboard</h2>

                <Accordion type="single" collapsible className="w-full">
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
                                        0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-primary">Description</h4>
                                    <p className="text-muted-foreground">
                                        This is a standard ERC20 token contract deployed on the
                                        Sepolia testnet. It implements all the standard ERC20
                                        functions including transfer, approve, and transferFrom.
                                        The contract is used for testing and development purposes.
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
                                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                                        View on Explorer
                                    </button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Token Information Section */}
                <div
                    style={{ overflowWrap: "break-word" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-accent/5 rounded-lg"
                >
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Token Metadata</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Contract:</span> {DAI_ADDRESS}
                            </p>
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {name?.toString() || "Loading..."}
                            </p>
                            <p>
                                <span className="font-medium">Symbol:</span>{" "}
                                {symbol?.toString() || "Loading..."}
                            </p>
                            <p>
                                <span className="font-medium">Decimals:</span>{" "}
                                {decimals?.toString() || "Loading..."}
                            </p>
                            <p>
                                <span className="font-medium">Total Supply:</span>{" "}
                                {totalSupply?.toString() || "Loading..."}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Your Address:</span>{" "}
                                {account.address || "Not connected"}
                            </p>
                            <p>
                                <span className="font-medium">Your Balance In The Contract:</span>{" "}
                                {balance !== undefined
                                    ? formatTokenAmount(balance as bigint)
                                    : "0"}
                            </p>
                            <p>
                                <span className="font-medium">Your Wallet Balance:</span>{" "}
                                {account.address ? (
                                    <span className="font-mono">
                                        {formatTokenAmount(
                                            (balanceInWallet?.value as unknown as bigint) ||
                                                BigInt(0)
                                        )}
                                    </span>
                                ) : (
                                    "Not connected"
                                )}
                            </p>
                            <p>
                                <span className="font-medium">Allowance (to DAI_ADDRESS):</span>{" "}
                                {allowance !== undefined ? allowance?.toString() : "0"} wei
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Transfer Section */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Transfer Tokens</h3>
                        <div className="space-y-3">
                            <InputForm
                                label="Recipient Address"
                                placeholder="0x..."
                                value={recipient}
                                onChange={setRecipient}
                            />
                            <InputForm
                                label="Amount (wei)"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={setAmount}
                            />
                            <button
                                onClick={handleTransfer}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                disabled={!account.isConnected}
                            >
                                Transfer
                            </button>
                        </div>
                    </div>

                    {/* Approve Section */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Approve Spender</h3>
                        <div className="space-y-3">
                            <InputForm
                                label="Spender Address"
                                placeholder="0x..."
                                value={spender}
                                onChange={setSpender}
                            />
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="checkbox"
                                    id="useMyAddress"
                                    checked={useMyAddress}
                                    onChange={() => setSpender(account.address as `0x${string}`)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                    htmlFor="useMyAddress"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Use my address
                                </label>
                            </div>
                            <InputForm
                                label="Amount (wei)"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={setAmount}
                            />
                            <button
                                onClick={handleApprove}
                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                                disabled={!account.isConnected}
                            >
                                Approve
                            </button>
                        </div>
                    </div>

                    {/* TransferFrom Section */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Transfer From</h3>
                        <div className="space-y-3">
                            <InputForm
                                label="Sender Address"
                                placeholder="0x..."
                                value={transferFromSender}
                                onChange={setTransferFromSender}
                                disabled={useMyAddress}
                            />

                            <InputForm
                                label="Recipient Address"
                                placeholder="0x..."
                                value={transferFromRecipient}
                                onChange={setTransferFromRecipient}
                            />
                            <InputForm
                                label="Amount (wei)"
                                placeholder="Enter amount"
                                value={transferFromAmount}
                                onChange={setTransferFromAmount}
                            />
                            <button
                                onClick={handleTransferFrom}
                                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                                disabled={!account.isConnected}
                            >
                                Transfer From
                            </button>
                        </div>
                    </div>
                </div>

                {/* Read Functions Section */}
                <div className="p-4 bg-accent/5 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Query Functions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <InputForm
                                label="Owner Address (for Allowance)"
                                placeholder="0x..."
                                value={queryAllowanceOwner}
                                onChange={setQueryAllowanceOwner}
                            />
                            <InputForm
                                label="Spender Address (for Allowance)"
                                placeholder="0x..."
                                value={queryAllowanceSpender}
                                onChange={setQueryAllowanceSpender}
                            />
                            <button
                                onClick={() => {
                                    /* No specific click handler needed, useReadContract handles it */
                                }}
                                className="w-full bg-accent/10 text-accent-foreground py-2 rounded-lg cursor-not-allowed"
                                disabled
                            >
                                Fetch Allowance
                            </button>
                            <div className="p-3 bg-accent/5 rounded border">
                                <p className="font-medium">Allowance Result:</p>
                                <p>
                                    {queriedAllowance !== undefined
                                        ? queriedAllowance?.toString()
                                        : "0"}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <InputForm
                                label="Address to Check Balance Of"
                                placeholder="0x..."
                                value={queryBalanceAddress}
                                onChange={setQueryBalanceAddress}
                            />
                            <button
                                onClick={() => {
                                    /* No specific click handler needed, useReadContract handles it */
                                }}
                                className="w-full bg-accent/10 text-accent-foreground py-2 rounded-lg cursor-not-allowed"
                                disabled
                            >
                                Fetch Balance
                            </button>
                            <div className="p-3 bg-accent/5 rounded border">
                                <p className="font-medium">Balance Result:</p>
                                <p>
                                    {queriedBalance !== undefined
                                        ? queriedBalance?.toString()
                                        : "0"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ConnectedGuard>
    )
}
