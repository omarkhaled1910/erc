import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink } from "lucide-react"

interface TransactionSuccessModalProps {
    isOpen: boolean
    onClose: () => void
    transactionId: string
    action: string
}

export function TransactionSuccessModal({
    isOpen,
    onClose,
    transactionId,
    action,
}: TransactionSuccessModalProps) {
    const explorerUrl = `https://sepolia.etherscan.io/tx/${transactionId}`

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                        Transaction Successful
                    </DialogTitle>
                    <DialogDescription>
                        Your {action} has been completed successfully.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-accent/10 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">Transaction ID:</p>
                        <p className="font-mono text-sm break-all">{transactionId}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            onClick={() => window.open(explorerUrl, "_blank")}
                            className="gap-2"
                        >
                            View on Explorer
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
