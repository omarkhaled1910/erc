import { parseEther } from "viem/utils"

export { calculateTotal } from "./calculateTotal/calculateTotal"
export { formatTokenAmount } from "./formatTokenAmount/formatTokenAmount"

export const validateDeployInput = (input: any) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(input.userAddress)) {
        return { error: "Invalid user address format" }
    }

    if (!input.tokenName || input.tokenName.trim().length === 0) {
        return { error: "Token name cannot be empty" }
    }

    if (!input.tokenSymbol || input.tokenSymbol.length === 0 || input.tokenSymbol.length > 10) {
        return { error: "Token symbol must be between 1 and 10 characters" }
    }

    if (input.tokenDecimals < 0 || input.tokenDecimals > 18) {
        return { error: "Token decimals must be between 0 and 18" }
    }

    const supplyNumber = parseFloat(input.initialSupply)
    if (isNaN(supplyNumber) || supplyNumber <= 0) {
        return { error: "Initial supply must be a positive number" }
    }

    const totalSupply = BigInt(parseEther(input.initialSupply)) // include decimals

    return {
        userAddress: input.userAddress,
        tokenName: input.tokenName,
        tokenSymbol: input.tokenSymbol,
        tokenDecimals: input.tokenDecimals,
        initialSupply: input.initialSupply,
        totalSupply: BigInt(parseEther(input.initialSupply)),
    }
}
