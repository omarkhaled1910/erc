import { ChangeEvent } from "react"

export interface InputFormBaseProps {
    label: string
    placeholder: string
    value?: string
    type?: string
    large?: boolean
    disabled?: boolean
    returnEvent?: boolean
    id?: string
}

type InputChangeHandler<T extends boolean | undefined> = T extends true
    ? (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => void
    : (value: string) => void

export type InputFormProps<T extends boolean | undefined = false> = InputFormBaseProps & {
    returnEvent?: T
    onChange?: InputChangeHandler<T>
}

export function InputForm<T extends boolean | undefined = false>({
    label,
    placeholder,
    value,
    type = "text",
    large,
    disabled,
    onChange,
    returnEvent,
    id,
}: InputFormProps<T>) {
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        // console.log(e.target.value, returnEvent ,onChange)
        if (returnEvent) {
            ;(onChange as InputChangeHandler<true>)?.(e)
        } else {
            ;(onChange as InputChangeHandler<false>)?.(e.target.value)
        }
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-zinc-600 font-medium text-sm">{label}</label>
            {large ? (
                <textarea
                    className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none h-24 align-text-top ${
                        disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={handleChange}
                    disabled={disabled}
                    name={id}
                />
            ) : (
                <input
                    className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none ${
                        disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    name={id}
                />
            )}
        </div>
    )
}
