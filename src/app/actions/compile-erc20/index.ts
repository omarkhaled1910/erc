"use server"

import * as fs from "fs/promises"
import path from "path"
import { readFileSync } from "fs"
import solcModule from "solc"
import { ERC20_TEMPLATE } from "@/constants"

type CompileInput = {
    contractString?: string
    contractName?: string
}

export async function compileContract({
    contractString = ERC20_TEMPLATE,
    contractName = "PTK",
}: CompileInput) {
    try {
        function findImports() {
            return { error: "File not found" } // or resolve actual imports if used
        }

        const input = {
            language: "Solidity",
            sources: {
                [`${contractName}.sol`]: { content: contractString },
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

        // console.log("output", output)
        if (output.errors) {
            const errors = output.errors.filter((e: any) => e.severity === "error")
            if (errors.length > 0) {
                return { errors: output.errors }
            }
        }

        const contract = output.contracts[`${contractName}.sol`]?.[contractName]
        console.log("contract", contract.abi)
        const bytecode = contract.evm.bytecode.object
        const abi = contract.abi

        return {
            bytecode,
            abi,
            contractName,
        }
    } catch (error) {
        console.error("Compilation error:", error)
        return { error: "Internal server error during compilation" }
    }
}
