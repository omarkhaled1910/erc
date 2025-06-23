export interface DeploymentInfo {
    transactionHash: string
    contractAddress: string
    blockNumber: number
    gasUsed: string
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    initialSupply: string
    deployerAddress: string
    deploymentDate: string
    network: string
}

export class DeploymentStorage {
    private static readonly DEPLOYMENT_PREFIX = "deployment_"
    private static readonly LATEST_DEPLOYMENT_KEY = "latest_deployment"

    /**
     * Store deployment information in localStorage
     */
    static storeDeployment(deploymentInfo: DeploymentInfo): void {
        const storageKey = `${this.DEPLOYMENT_PREFIX}${deploymentInfo.contractAddress}`

        // Store with unique key
        localStorage.setItem(storageKey, JSON.stringify(deploymentInfo))

        // Also store as latest deployment
        localStorage.setItem(this.LATEST_DEPLOYMENT_KEY, JSON.stringify(deploymentInfo))
    }

    /**
     * Get deployment by contract address
     */
    static getDeployment(contractAddress: string): DeploymentInfo | null {
        const storageKey = `${this.DEPLOYMENT_PREFIX}${contractAddress}`
        const data = localStorage.getItem(storageKey)

        if (!data) return null

        try {
            return JSON.parse(data)
        } catch (error) {
            console.error("Error parsing deployment data:", error)
            return null
        }
    }

    /**
     * Get latest deployment
     */
    static getLatestDeployment(): DeploymentInfo | null {
        const data = localStorage.getItem(this.LATEST_DEPLOYMENT_KEY)

        if (!data) return null

        try {
            return JSON.parse(data)
        } catch (error) {
            console.error("Error parsing latest deployment data:", error)
            return null
        }
    }

    /**
     * Get all deployments
     */
    static getAllDeployments(): DeploymentInfo[] {
        const deployments: DeploymentInfo[] = []

        // Get all deployment keys
        const deploymentKeys = Object.keys(localStorage).filter(
            key => key.startsWith(this.DEPLOYMENT_PREFIX) || key === this.LATEST_DEPLOYMENT_KEY
        )

        deploymentKeys.forEach(key => {
            try {
                const data = localStorage.getItem(key)
                if (data) {
                    const deployment = JSON.parse(data)
                    deployments.push(deployment)
                }
            } catch (error) {
                console.error(`Error parsing deployment data for key ${key}:`, error)
            }
        })

        // Sort by deployment date (newest first)
        return deployments.sort(
            (a, b) => new Date(b.deploymentDate).getTime() - new Date(a.deploymentDate).getTime()
        )
    }

    /**
     * Delete deployment by contract address
     */
    static deleteDeployment(contractAddress: string): boolean {
        const storageKey = `${this.DEPLOYMENT_PREFIX}${contractAddress}`

        // Check if it's the latest deployment
        const latestDeployment = this.getLatestDeployment()
        if (latestDeployment && latestDeployment.contractAddress === contractAddress) {
            localStorage.removeItem(this.LATEST_DEPLOYMENT_KEY)
        }

        localStorage.removeItem(storageKey)
        return true
    }

    /**
     * Clear all deployment records
     */
    static clearAllDeployments(): void {
        const deploymentKeys = Object.keys(localStorage).filter(
            key => key.startsWith(this.DEPLOYMENT_PREFIX) || key === this.LATEST_DEPLOYMENT_KEY
        )

        deploymentKeys.forEach(key => localStorage.removeItem(key))
    }

    /**
     * Check if deployment exists
     */
    static hasDeployment(contractAddress: string): boolean {
        const storageKey = `${this.DEPLOYMENT_PREFIX}${contractAddress}`
        return localStorage.getItem(storageKey) !== null
    }

    /**
     * Get deployment count
     */
    static getDeploymentCount(): number {
        const deploymentKeys = Object.keys(localStorage).filter(key =>
            key.startsWith(this.DEPLOYMENT_PREFIX)
        )
        return deploymentKeys.length
    }
}
