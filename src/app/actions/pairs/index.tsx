import { TOKEN_PAIRS } from "@/constants"

export const getPairs = async (key: string) => {
    return TOKEN_PAIRS.filter(pair => pair.symbol.toLowerCase().includes(key.toLowerCase()))
}
