import JSBI from "jsbi"
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

export function fromDecimals(valueJSBI: bigint, decimalsJSBI: JSBI): number {
    const precision = JSBI.exponentiate(JSBI.BigInt(10), decimalsJSBI)
    // Use decimal.js or convert to string and insert decimal point manually for precision
    // For quick demo, convert to Number (beware precision loss for huge numbers)
    return Number(valueJSBI.toString()) / Number(precision.toString())
}

// Utility functions for formatting
export const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price === 0) return "$0.00"

    const numPrice = price

    if (numPrice < 0.000001) {
        // For very small numbers, show in scientific notation
        return `$${numPrice.toExponential(6)}`
    } else if (numPrice < 0.01) {
        // For small numbers, show more decimal places
        return `$${numPrice.toFixed(8)}`
    } else if (numPrice < 1) {
        // For numbers less than 1, show 4 decimal places
        return `$${numPrice.toFixed(4)}`
    } else {
        // For regular numbers, show 2 decimal places
        return `$${numPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }
}

export const formatLiquidity = (liquidity: number) => {
    if (!liquidity || isNaN(liquidity) || liquidity === 0) return "$0"

    const numLiquidity = liquidity

    if (numLiquidity >= 1e12) {
        return `$${(numLiquidity / 1e12).toFixed(2)}T`
    } else if (numLiquidity >= 1e9) {
        return `$${(numLiquidity / 1e9).toFixed(2)}B`
    } else if (numLiquidity >= 1e6) {
        return `$${(numLiquidity / 1e6).toFixed(2)}M`
    } else if (numLiquidity >= 1e3) {
        return `$${(numLiquidity / 1e3).toFixed(2)}K`
    } else {
        return `$${numLiquidity.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
    }
}

export const formatSpread = (spread: number) => {
    if (!spread || isNaN(spread)) return "0.000%"
    return `${spread.toFixed(3)}%`
}

export const formatAddress = (address: string) => {
    if (!address) return "—"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}
