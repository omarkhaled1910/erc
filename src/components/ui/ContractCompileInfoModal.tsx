import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import React from "react"
import MarkdownCodeDisplay from "../MarkdownCodeDisplay"
import { ERC20_TEMPLATE } from "@/constants"

const ContractCompileInfoModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                            Contract Compile Info
                        </DialogTitle>
                        <DialogDescription className=" max-h-[500px] overflow-y-auto max-w-[480px]">
                            <MarkdownCodeDisplay code={ERC20_TEMPLATE} />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ContractCompileInfoModal
