import React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"

const PleaseConnect = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
                    <p className="text-gray-600">
                        Please connect your wallet to access this feature. This allows you to
                        interact with the blockchain securely.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <ConnectButton.Custom>
                            {({
                                account,
                                chain,
                                openAccountModal,
                                openChainModal,
                                openConnectModal,
                                mounted,
                            }) => {
                                return (
                                    <div
                                        {...(!mounted && {
                                            "aria-hidden": true,
                                            style: {
                                                opacity: 0,
                                                pointerEvents: "none",
                                                userSelect: "none",
                                            },
                                        })}
                                    >
                                        {(() => {
                                            if (!mounted || !account || !chain) {
                                                return (
                                                    <button
                                                        onClick={openConnectModal}
                                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                                                    >
                                                        Connect Wallet
                                                    </button>
                                                )
                                            }
                                        })()}
                                    </div>
                                )
                            }}
                        </ConnectButton.Custom>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    <p>Supported Networks:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Ethereum Mainnet</li>
                        <li>Polygon</li>
                        <li>Arbitrum</li>
                        <li>Optimism</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PleaseConnect
