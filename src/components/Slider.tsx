// Slider.tsx
import { useState } from "react"

type SliderProps = {
    label: string
    min: number
    max: number
    step?: number
    defaultValue: number
    onChange: (value: number) => void
    unit?: string
}

export default function Slider({
    label,
    min,
    max,
    step = 0.1,
    defaultValue,
    onChange,
    unit = ""
}: SliderProps) {
    const [value, setValue] = useState(defaultValue)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value)
        setValue(newValue)
        onChange(newValue)
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex justify-between items-center">
                <label className="font-medium text-sm">{label}</label>
                <span className="text-sm font-mono">
                    {value.toFixed(2)}{unit}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}