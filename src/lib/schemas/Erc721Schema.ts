import { z } from "zod"

export const erc721DeploymentSchema = z.object({
    name: z
        .string()
        .min(1, "NFT name is required")
        .max(100, "NFT name must be less than 100 characters")
        .trim(),
    symbol: z
        .string()
        .min(1, "NFT symbol is required")
        .max(10, "NFT symbol must be 10 characters or less")
        .trim()
        .transform(val => val.toUpperCase()),
    baseURI: z
        .string()
        .url("Invalid URL")
        .refine(val => val.startsWith("https://"), {
            message: "Base URL must start with https://",
        }),

    privateKey: z.string().optional(),
    userAddress: z.string().optional(),
})

export type DeploymentFormData = z.infer<typeof erc721DeploymentSchema>
