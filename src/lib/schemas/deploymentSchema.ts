import { z } from "zod"

export const deploymentFormSchema = z.object({
    tokenName: z
        .string()
        .min(1, "Token name is required")
        .max(100, "Token name must be less than 100 characters")
        .trim(),
    tokenSymbol: z
        .string()
        .min(1, "Token symbol is required")
        .max(10, "Token symbol must be 10 characters or less")
        .trim()
        .transform(val => val.toUpperCase()),
    tokenDecimals: z
        .number()
        .min(0, "Decimals must be at least 0")
        .max(18, "Decimals must be at most 18"),
    initialSupply: z
        .string()
        .min(1, "Initial supply is required")
        .refine(val => {
            const num = parseFloat(val)
            return !isNaN(num) && num > 0
        }, "Initial supply must be a positive number")
        .refine(val => {
            const num = parseFloat(val)
            return num <= Number.MAX_SAFE_INTEGER
        }, "Initial supply is too large"),
    privateKey: z.string().optional(),
})

export type DeploymentFormData = z.infer<typeof deploymentFormSchema>
