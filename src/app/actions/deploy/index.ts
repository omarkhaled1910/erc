"use server"

import {
    createPublicClient,
    http,
    parseEther,
    encodeFunctionData,
    getContractAddress,
    createWalletClient,
    custom,
    encodeDeployData,
} from "viem"

// import { deployContract } from "viem/actions"

import { sepolia } from "wagmi/chains"
import { privateKeyToAccount } from "viem/accounts"
import { ERC20_BYTECODE } from "@/lib/constants/erc20Bytecode"
import { compileERC20Token } from "../compile-erc20"
import { getSepoliaClients } from "../clients"
import { validateDeployInput } from "@/utils"

// Validate environment variables

// TypeScript input type
export type DeployInput = {
    userAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    initialSupply: string
    privateKey?: string
}

// Server Action
export async function deployERC20Token({
    userAddress,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    initialSupply,
    privateKey,
}: DeployInput) {
    const input = {
        userAddress,
        tokenName,
        tokenSymbol,
        tokenDecimals,
        initialSupply,
        privateKey,
    }
    try {
        if (!privateKey) {
            return { error: "Private key is Missing" }
        }
        const { userAddress, tokenName, tokenSymbol, tokenDecimals, initialSupply, totalSupply } =
            validateDeployInput(input)

        const { abi, bytecode, contractName, errors, error } = await compileERC20Token({
            name: tokenName,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            initialSupply: Number(totalSupply),
        })

        console.log("compileERC20Token2", { contractName, errors, error })

        if (errors) {
            return { error: "Compilation error" }
        }

        const { publicClient, walletClient, deployerAccount } = await getSepoliaClients(privateKey)

        console.log(
            "deployERC20Token",

            publicClient.chain,
            walletClient.account,
            deployerAccount.address
        )

        if (!publicClient || !walletClient || !deployerAccount) {
            return { error: "Deployment service not configured. Check environment variables." }
        }

        const data = encodeDeployData({
            abi,
            bytecode,
            args: [tokenName, tokenSymbol, tokenDecimals, totalSupply, userAddress],
        })
        const gasPrice = await publicClient.getGasPrice()
        const tx = {
            from: userAddress,
            to: undefined,
            data,
            gas: BigInt(2000000),
            gasPrice,
            value: BigInt(0),
            nonce: await publicClient.getTransactionCount({ address: userAddress }),
        }
        console.log("tx", tx, gasPrice)
        const signedTx = await walletClient.signTransaction(tx)
        const txHash = await publicClient.sendRawTransaction({ serializedTransaction: signedTx })
        const deployedAddress = await publicClient.waitForTransactionReceipt({ hash: txHash })

        console.log(
            "deployedAddress after deployContract",
            deployedAddress.contractAddress,
            "txHash",
            txHash
        )

        return {
            success: true,
            transactionHash: txHash,
            contractAddress: deployedAddress.contractAddress,
            blockNumber: BigInt(deployedAddress.blockNumber),
            gasUsed: BigInt(deployedAddress.gasUsed),
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

