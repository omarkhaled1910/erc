import { parseUnits, formatUnits, parseEther, formatEther } from "viem"

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

type BigNumberInput = string | number | bigint
type UnitType = "wei" | "gwei" | "ether"

interface FormatConfig {
    /**
     * The unit of the input value (default: 'wei')
     */
    fromUnit?: UnitType
    /**
     * The unit to convert to (default: 'ether')
     */
    toUnit?: UnitType
    /**
     * Number of decimal places to show (default: 4)
     */
    decimals?: number
    /**
     * Whether to add thousands separators (default: true)
     */
    commify?: boolean
    /**
     * Whether to trim trailing zeros (default: true)
     */
    trim?: boolean
    /**
     * Whether to return as a bigint (default: false)
     */
    asBigInt?: boolean
}

/**
 * Formats a big number value between different units (wei, gwei, ether)
 * with configurable display options.
 */
export function formatBigNumber(
    value: BigNumberInput,
    config: FormatConfig = {}
): string | bigint {
    const {
        fromUnit = "wei",
        toUnit = "ether",
        decimals = 4,
        commify = true,
        trim = true,
        asBigInt = false,
    } = config

    // Convert input to bigint first
    let valueBigInt: bigint

    try {
        if (typeof value === "bigint") {
            valueBigInt = value
        } else if (fromUnit === "wei") {
            valueBigInt = BigInt(value.toString())
        } else if (fromUnit === "gwei") {
            valueBigInt = parseUnits(value.toString(), 9)
        } else if (fromUnit === "ether") {
            valueBigInt = parseEther(value.toString())
        } else {
            throw new Error(`Unsupported fromUnit: ${fromUnit}`)
        }
    } catch (error) {
        throw new Error(`Failed to parse input value: ${error}`)
    }

    // If user wants raw bigint, return it now
    if (asBigInt) {
        return valueBigInt
    }

    // Convert to desired unit
    let formatted: string
    if (toUnit === "wei") {
        formatted = valueBigInt.toString()
    } else if (toUnit === "gwei") {
        formatted = formatUnits(valueBigInt, 9)
    } else if (toUnit === "ether") {
        formatted = formatEther(valueBigInt)
    } else {
        throw new Error(`Unsupported toUnit: ${toUnit}`)
    }

    // Handle decimal places
    if (decimals !== undefined) {
        const [integerPart, decimalPart] = formatted.split(".")
        if (decimalPart) {
            formatted = `${integerPart}.${decimalPart.slice(0, decimals)}`
        }
    }

    // Trim trailing zeros
    if (trim && formatted.includes(".")) {
        formatted = formatted.replace(/\.?0+$/, "")
    }

    // Add thousands separators
    if (commify) {
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return formatted
}

/**
 * Parses a value into a bigint in wei, handling different input units.
 */
export function parseToWei(value: BigNumberInput, fromUnit: UnitType = "ether"): bigint {
    if (fromUnit === "wei") {
        return BigInt(value.toString())
    } else if (fromUnit === "gwei") {
        return parseUnits(value.toString(), 9)
    } else if (fromUnit === "ether") {
        return parseEther(value.toString())
    }
    throw new Error(`Unsupported fromUnit: ${fromUnit}`)
}

export function formatNumberCompact(input: number | string, decimals: number = 1): string {
    // Convert input to number
    const num = typeof input === "string" ? parseFloat(input) : input

    // Handle NaN cases
    if (isNaN(num)) {
        return "0"
    }

    // Absolute value for negative numbers
    const absNum = Math.abs(num)

    // Define the thresholds and suffixes
    const thresholds = [
        { value: 1_000_000_000, suffix: "b" },
        { value: 1_000_000, suffix: "m" },
        { value: 1_000, suffix: "k" },
        { value: 1, suffix: "" },
    ]

    // Find the appropriate threshold
    const threshold = thresholds.find(t => absNum >= t.value) || thresholds[thresholds.length - 1]

    // Calculate the formatted number
    const formattedNum = (num / threshold.value).toFixed(decimals).replace(/\.0+$/, "")

    // Handle negative numbers
    const sign = num < 0 ? "-" : ""

    return sign + formattedNum + threshold.suffix
}
