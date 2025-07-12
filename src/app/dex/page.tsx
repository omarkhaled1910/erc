import React from "react"

import { createPublicClient, http, PublicClient } from "viem"
import { sepolia } from "viem/chains"
import DexWrapper from "./wrapper"

const DashboardPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <DexWrapper />
        </div>
    )
}

export default DashboardPage
