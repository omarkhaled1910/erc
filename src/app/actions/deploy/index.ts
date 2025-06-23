"use server"

import {
    createPublicClient,
    http,
    parseEther,
    encodeFunctionData,
    getContractAddress,
    createWalletClient,
    custom,
} from "viem"
import { sepolia } from "wagmi/chains"
import { privateKeyToAccount } from "viem/accounts"
import { ERC20_BYTECODE } from "@/lib/constants/erc20Bytecode"
import { compileERC20Token } from "../compile-erc20"
import { getSepoliaClients } from "../clients"

// Validate environment variables
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.NEXT_PRIVATE_PRIVATE_KEY

// TypeScript input type
export type DeployInput = {
    userAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    initialSupply: string
}

// Server Action
export async function deployERC20Token({
    userAddress,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    initialSupply,
}: DeployInput) {
    console.log("deployERC20Token", SEPOLIA_RPC_URL, PRIVATE_KEY)
    const { publicClient, walletClient, deployerAccount } = await getSepoliaClients()
    try {
        console.log(
            "deployERC20Token",
            SEPOLIA_RPC_URL,
            PRIVATE_KEY,
            publicClient,
            walletClient,
            deployerAccount,
            userAddress,
            tokenName,
            tokenSymbol,
            tokenDecimals,
            initialSupply
        )

        if (
            !SEPOLIA_RPC_URL ||
            !PRIVATE_KEY ||
            !publicClient ||
            !walletClient ||
            !deployerAccount
        ) {
            return {
                SEPOLIA_RPC_URL,
                PRIVATE_KEY,
                publicClient,
                walletClient,
                deployerAccount,
                userAddress,
                tokenName,
                tokenSymbol,
                tokenDecimals,
                initialSupply,
            }
            return { error: "Deployment service not configured. Check environment variables." }
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
            return { error: "Invalid user address format" }
        }

        if (!tokenName || tokenName.trim().length === 0) {
            return { error: "Token name cannot be empty" }
        }

        if (!tokenSymbol || tokenSymbol.length === 0 || tokenSymbol.length > 10) {
            return { error: "Token symbol must be between 1 and 10 characters" }
        }

        if (tokenDecimals < 0 || tokenDecimals > 18) {
            return { error: "Token decimals must be between 0 and 18" }
        }

        const supplyNumber = parseFloat(initialSupply)
        if (isNaN(supplyNumber) || supplyNumber <= 0) {
            return { error: "Initial supply must be a positive number" }
        }

        const totalSupply = BigInt(parseEther(initialSupply)) // include decimals
        // const abiItem = {
        //     inputs: [{ name: "owner", type: "address" }],
        //     name: "balanceOf",
        //     outputs: [{ name: "", type: "uint256" }],
        //     stateMutability: "view",
        //     type: "function",
        // }

        const { abi, bytecode, contractName, error } = await compileERC20Token({
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            initialSupply: Number(totalSupply),
        })

        console.log("compileERC20Token", { contractName, error })

        if (error) {
            return { error: "Compilation error" }
        }

        const encodedConstructor = encodeFunctionData({
            abi,
            args: [tokenName, tokenSymbol, tokenDecimals, totalSupply, userAddress],
        })

        const deploymentData = (bytecode + encodedConstructor.slice(2)) as `0x${string}`

        const nonce = await publicClient.getTransactionCount({
            address: deployerAccount.address,
        })

        const gas = await publicClient.estimateGas({
            account: deployerAccount.address,
            data: deploymentData,
        })

        const gasPrice = await publicClient.getGasPrice()

        const tx = {
            account: deployerAccount.address,
            data: deploymentData,
            gas,
            gasPrice,
            nonce,
            chain: sepolia,
        }

        const hash = await walletClient.sendTransaction(tx)

        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        if (receipt.status === "reverted") {
            return { error: "Contract deployment failed" }
        }

        const contractAddress = getContractAddress({
            from: deployerAccount.address,
            nonce: BigInt(nonce),
        })

        return {
            success: true,
            transactionHash: hash,
            contractAddress,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString(),
            contractName,
        }
    } catch (error: any) {
        console.error("Deployment error:", error)

        if (error instanceof Error) {
            if (error.message.includes("insufficient funds")) {
                return { error: "Insufficient ETH for deployment gas fees" }
            }
            if (error.message.includes("nonce")) {
                return { error: "Transaction nonce error. Please try again." }
            }
            if (error.message.includes("network")) {
                return { error: "Network connectivity issue. Please check your connection." }
            }
        }

        return { error: "Contract deployment failed. Please try again." }
    }
}
