import { useQuery, useQueryClient } from "@tanstack/react-query"
import { DeploymentStorage, DeploymentInfo } from "@/lib/utils/deploymentStorage"

export const useDeployments = () => {
    return useQuery({
        queryKey: ["deployments"],
        queryFn: () => DeploymentStorage.getAllDeployments(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
}

export const useLatestDeployment = () => {
    return useQuery({
        queryKey: ["latest-deployment"],
        queryFn: () => DeploymentStorage.getLatestDeployment(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
}

export const useDeployment = (contractAddress: string) => {
    return useQuery({
        queryKey: ["deployment", contractAddress],
        queryFn: () => DeploymentStorage.getDeployment(contractAddress),
        enabled: !!contractAddress,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })
}

export const useDeploymentActions = () => {
    const queryClient = useQueryClient()

    const invalidateDeployments = () => {
        queryClient.invalidateQueries({ queryKey: ["deployments"] })
        queryClient.invalidateQueries({ queryKey: ["latest-deployment"] })
    }

    const deleteDeployment = (contractAddress: string) => {
        DeploymentStorage.deleteDeployment(contractAddress)
        invalidateDeployments()
    }

    const clearAllDeployments = () => {
        DeploymentStorage.clearAllDeployments()
        invalidateDeployments()
    }

    return {
        deleteDeployment,
        clearAllDeployments,
        invalidateDeployments,
    }
}
