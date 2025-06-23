"use server"

import * as fs from "fs/promises"
import path from "path"
import { readFileSync } from "fs"
import solcModule from "solc"
import { ERC20_TEMPLATE } from "@/constants"

type CompileInput = {
    name: string
    symbol: string
    decimals: number
    initialSupply: number
}

export async function compileERC20Token({ name, symbol, decimals, initialSupply }: CompileInput) {
    try {
        if (!name || !symbol || decimals === undefined || initialSupply === undefined) {
            return { error: "Missing required parameters" }
        }

        function findImports() {
            return { error: "File not found" } // or resolve actual imports if used
        }

        const input = {
            language: "Solidity",
            sources: {
                "PTK.sol": { content: ERC20_TEMPLATE }, // your full ERC20_TEMPLATE string
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"],
                    },
                },
            },
        }

        const output = JSON.parse(
            solcModule.compile(JSON.stringify(input), { import: findImports })
        )

        console.log("output", output)
        if (output.errors) {
            const errors = output.errors.filter((e: any) => e.severity === "error")
            if (errors.length > 0) {
                return { errors: output.errors }
            }
        }

        const contract = output.contracts["PTK.sol"].PTK
        // console.log("contract", contract)
        const bytecode = contract.evm.bytecode.object
        const abi = contract.abi

        return {
            bytecode,
            abi,
            contractName: "PTK",
        }
    } catch (error) {
        console.error("Compilation error:", error)
        return { error: "Internal server error during compilation" }
    }
}
