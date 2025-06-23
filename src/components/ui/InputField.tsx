export interface InputFormProps {
    label: string
    placeholder: string
    value?: string
    type?: string
    large?: boolean
    disabled?: boolean
    onChange?: (e: string) => void
}

export function InputForm({
    label,
    placeholder,
    value,
    type,
    large,
    disabled,
    onChange,
}: InputFormProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 font-medium text-sm">{label}</label>
            {large ? (
                <textarea
                    className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none h-24 align-text-top ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled}
                />
            ) : (
                <input
                    className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    type={type}
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled}
                />
            )}
        </div>
    )
}
