"use server"

import * as fs from "fs/promises"
import path from "path"
import { readFileSync } from "fs"
import solcModule from "solc"

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

        const ERC20_TEMPLATE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PTK is ERC20, Ownable {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        _mint(owner, initialSupply * (10 ** decimals_));
        transferOwnership(owner);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
`

        const input = {
            language: "Solidity",
            sources: {
                "PTK.sol": { content: ERC20_TEMPLATE },
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"],
                    },
                },
            },
        }

        const openzeppelinPath = path.join(process.cwd(), "node_modules", "@openzeppelin")
        try {
            await fs.access(openzeppelinPath)
        } catch {
            return {
                error: "OpenZeppelin contracts not found. Please install @openzeppelin/contracts",
            }
        }

        const findImports = (importPath: string) => {
            if (importPath.startsWith("@openzeppelin/")) {
                try {
                    const fullPath = require.resolve(importPath, { paths: [process.cwd()] })
                    const contents = readFileSync(fullPath, "utf8")
                    return { contents }
                } catch (e) {
                    return { error: `File not found: ${importPath}` }
                }
            }
            return { error: `File not found: ${importPath}` }
        }

        const output = JSON.parse(
            solcModule.compile(JSON.stringify(input), { import: findImports })
        )

        if (output.errors) {
            const errors = output.errors.filter((e: any) => e.severity === "error")
            if (errors.length > 0) {
                return { errors: output.errors }
            }
        }

        const contract = output.contracts["PTK.sol"].PTK
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
