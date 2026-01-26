import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, className }) => {
    // Format helper: adds commas to a number string
    const formatNumber = (numStr: string) => {
        if (!numStr) return '';
        // Remove existing non-digits to be safe
        const clean = numStr.replace(/,/g, '');
        if (isNaN(Number(clean))) return numStr; // Fallback if invalid
        return new Intl.NumberFormat('en-US').format(Number(clean));
    };

    // Local display state
    const [displayValue, setDisplayValue] = useState(formatNumber(value));

    // Sync display value when parent value changes (e.g. initial load or reset)
    useEffect(() => {
        // Only update if the numeric value actually differs, to avoid cursor jumping issues on simple re-renders
        // But simplified logic: just format whatever comes in
        const formatted = formatNumber(value);
        if (formatted !== displayValue) {
            // We compare loosely to avoid fighting the user input, but here we trust prop updates
            // Ideally we just check if the raw number matches.
            // For simplicity in this controlled component:
            if (value === '' && displayValue !== '') setDisplayValue('');
            else if (value !== '' && value.replace(/,/g, '') !== displayValue.replace(/,/g, '')) {
                setDisplayValue(formatted);
            }
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;

        // 1. Remove commas to get raw number
        const rawValue = inputVal.replace(/,/g, '');

        // 2. Validate: Allow only digits and one decimal point
        if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
            // 3. Update parent with raw value
            onChange(rawValue);

            // 4. Update local display with formatted value BUT preserve cursor position logic is hard in plain React.
            // A simpler approach for "good enough" UX:
            // Only format on blur? Or format as you type?
            // "Format as you type" is best for "wow" factor, but cursor jumping is a risk.
            // Risk mitigation: If we just format the integer part, usually it's fine.

            // Let's try formatting freely. If cursor jumps become annoying, we can switch to "format on blur".
            // However, the user specifically asked for formatting.

            // Basic formatting strategy:
            if (rawValue === '') {
                setDisplayValue('');
            } else if (inputVal.endsWith('.')) {
                // If user typed a dot, don't format it away yet
                setDisplayValue(new Intl.NumberFormat('en-US').format(Number(rawValue.slice(0, -1))) + '.');
            } else if (inputVal.includes('.') && inputVal.endsWith('0')) {
                // specific case like 1.0, 1.50 - Intl removes trailing zeros
                // We need to keep them.
                // Manual formatting for decimal part:
                const parts = rawValue.split('.');
                const intPart = new Intl.NumberFormat('en-US').format(Number(parts[0]));
                setDisplayValue(`${intPart}.${parts[1]}`);
            } else {
                setDisplayValue(new Intl.NumberFormat('en-US').format(Number(rawValue)));
            }
        }
    };

    return (
        <input
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            className={className}
            placeholder={placeholder}
        />
    );
};

export default CurrencyInput;
