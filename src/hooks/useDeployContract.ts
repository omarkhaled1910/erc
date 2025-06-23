import { useMutation } from "@tanstack/react-query"
import { DeploymentStorage, DeploymentInfo } from "@/lib/utils/deploymentStorage"
import { deployERC20Token } from "@/app/actions/deploy"

interface DeployContractParams {
    userAddress: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    initialSupply: string
}

interface DeployContractResponse {
    success: boolean
    transactionHash: string
    contractAddress: string
    blockNumber: number
    gasUsed: string
    error?: string
}

// const deployContract = async (params: DeployContractParams): Promise<DeployContractResponse> => {
//     const response = await fetch("/api/deploy", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(params),
//     })

//     const result = await response.json()

//     if (!response.ok) {
//         throw new Error(result.error || "Deployment failed")
//     }

//     return result
// }

export const useDeployContract = () => {
    return useMutation({
        mutationFn: deployERC20Token,
        onSuccess: (data, variables) => {
            // Store deployment information in localStorage
            console.log("useDeployContract", data, variables)
            const deploymentInfo: DeploymentInfo = {
                transactionHash: data.transactionHash || "",
                contractAddress: data.contractAddress as string,
                blockNumber: Number(data.blockNumber) as number,
                gasUsed: data?.gasUsed?.toString() || "",
                tokenName: variables.tokenName,
                tokenSymbol: variables.tokenSymbol,
                tokenDecimals: variables.tokenDecimals,
                initialSupply: variables.initialSupply,
                deployerAddress: variables.userAddress,
                deploymentDate: new Date().toISOString(),
                network: "Sepolia Testnet",
            }

            DeploymentStorage.storeDeployment(deploymentInfo)
        },
        onError: error => {
            console.error("Deployment error:", error)
        },
    })
}
