// MarkdownCodeDisplay.tsx
import React from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownCodeDisplayProps {
    code: string
}

const MarkdownCodeDisplay: React.FC<MarkdownCodeDisplayProps> = ({ code }) => {
    return (
        <ReactMarkdown
            children={`\`\`\`solidity\n${code}\n\`\`\``}
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    return match ? (
                        <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
            }}
        />
    )
}

export default MarkdownCodeDisplay
