// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// // import { useUniSwapPairs } from "@/hooks/useUniSwapPairs"
// import { ExternalLink } from "lucide-react"

// export default function UniSwapPairsList() {
//     const { data, isLoading, error } = useUniSwapPairs()

//     return (
//         <div className="max-w-3xl mx-auto p-4 mt-4">
//             <Card>
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
//                         <div>
//                             <h1 className="text-2xl font-bold">Uniswap V2 Pairs</h1>
//                             <p className="text-sm text-muted-foreground">Sepolia Testnet</p>
//                         </div>
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     {isLoading && <LoadingSkeleton />}

//                     {error && (
//                         <div className="py-8 text-center">
//                             <div className="text-destructive mb-2">Error loading pairs data</div>
//                             <p className="text-sm text-muted-foreground">
//                                 {(error as Error).message}
//                             </p>
//                         </div>
//                     )}

//                     {data && (
//                         <div className="space-y-4">
//                             <div className="flex flex-wrap gap-4">
//                                 <InfoCard title="Total Pairs" value={data.totalPairs.toString()} />
//                                 <InfoCard
//                                     title="Fetched"
//                                     value={`${data.pairAddresses.length} (Demo)`}
//                                 />
//                             </div>

//                             <div>
//                                 <h3 className="font-medium mb-2">Pair Addresses:</h3>
//                                 <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
//                                     {data.pairAddresses.map((address, index) => (
//                                         <div
//                                             key={index}
//                                             className="p-3 font-mono text-sm hover:bg-muted/50 transition-colors flex items-center justify-between"
//                                         >
//                                             <span>{address}</span>
//                                             <a
//                                                 href={`https://sepolia.etherscan.io/address/${address}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-muted-foreground hover:text-foreground transition-colors"
//                                                 title="View on Etherscan"
//                                             >
//                                                 <ExternalLink className="h-4 w-4" />
//                                             </a>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// function InfoCard({ title, value }: { title: string; value: string }) {
//     return (
//         <Card className="flex-1 min-w-[200px]">
//             <CardHeader className="pb-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
//             </CardHeader>
//             <CardContent>
//                 <p className="text-2xl font-bold">{value}</p>
//             </CardContent>
//         </Card>
//     )
// }

// function LoadingSkeleton() {
//     return (
//         <div className="space-y-6">
//             <div className="flex gap-4">
//                 <Skeleton className="h-24 flex-1" />
//                 <Skeleton className="h-24 flex-1" />
//             </div>

//             <div className="space-y-2">
//                 <Skeleton className="h-6 w-1/4" />
//                 <div className="space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                         <Skeleton key={i} className="h-12 w-full" />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }
