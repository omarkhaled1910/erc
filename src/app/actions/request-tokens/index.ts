"use server"
import { encodeFunctionData, parseUnits } from "viem"
import { getSepoliaClients } from "../clients"

export async function requestTokensTx(amount: number, toAddress?: string) {
    const PRIVATE_KEY = process.env.NEXT_PRIVATE_PRIVATE_KEY || ""
    const contractAdress = process.env.NEXT_PUBLIC_PTK
    console.log({ PRIVATE_KEY: PRIVATE_KEY }, "hash")

    if (!amount || !toAddress) {
        throw new Error("Amount and toAddress are required")
    }

    try {
        const { publicClient, walletClient, deployerAccount } =
            await getSepoliaClients(PRIVATE_KEY)
        if (!publicClient || !walletClient || !deployerAccount) {
            throw new Error("Failed to get clients")
        }
        const gasPrice = await publicClient.getGasPrice()

        const erc20Abi = [
            {
                constant: false,
                inputs: [
                    { name: "_to", type: "address" },
                    { name: "_value", type: "uint256" },
                ],
                name: "transfer",
                outputs: [{ name: "", type: "bool" }],
                type: "function",
            },
        ]

        const formattedAmount = parseUnits(amount.toString(), 18)

        // Send the transaction
        const txHash = await walletClient.writeContract({
            address: contractAdress as `0x${string}`,
            abi: erc20Abi,
            functionName: "transfer",
            args: [toAddress, formattedAmount],
            account: deployerAccount,
            gasPrice,
        })
        console.log({ txHash }, "txHash")
        return txHash
    } catch (error) {}

    // const data = encodeFunctionData({
    //     abi: erc20Abi,
    //     functionName: "transfer",
    //     args: [toAddress, amount],
    // })

    // const txHash = await walletClient.sendTransaction({
    //     to: contactAdress as `0x${string}`,
    //     data,
    //     account: deployerAccount,
    // })
}

export async function approveTokensTx(amount: number, toAddress?: string) {
    const PRIVATE_KEY = process.env.NEXT_PRIVATE_PRIVATE_KEY || ""
    const contractAdress = process.env.NEXT_PUBLIC_PTK
    console.log({ PRIVATE_KEY: PRIVATE_KEY }, "hash")

    if (!amount || !toAddress) {
        throw new Error("Amount and toAddress are required")
    }

    try {
        const { publicClient, walletClient, deployerAccount } =
            await getSepoliaClients(PRIVATE_KEY)
        if (!publicClient || !walletClient || !deployerAccount) {
            throw new Error("Failed to get clients")
        }
        const gasPrice = await publicClient.getGasPrice()

        const erc20Abi = [
            {
                inputs: [
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "value", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ]

        const formattedAmount = parseUnits(amount.toString(), 18)

        const txHash = await walletClient.writeContract({
            address: contractAdress as `0x${string}`,
            abi: erc20Abi,
            functionName: "approve",
            args: [toAddress, formattedAmount],
            gasPrice,
            account: deployerAccount,
        })
        console.log({ txHash }, "txHash")
        return txHash
    } catch (error) {
        console.error(error)
        throw new Error("Failed to approve tokens")
    }
}
