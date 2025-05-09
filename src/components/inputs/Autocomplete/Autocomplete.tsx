import { TAutocompleteInputFieldProps } from '@/types'
import React from 'react'

export default function Autocomplete({
    inputProps,
    datalistProps,
    suggestions,
    loading,
    wrapperClassName,
    onSuggestionClick,
}: TAutocompleteInputFieldProps) {
    return (
        <>
            <div className={`relative ${wrapperClassName}`}>
                <input
                    type="text"
                    {...inputProps}
                    className={`input pr-10 ${inputProps.className}`} // space for spinner
                />
                {loading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <span className="loading loading-spinner loading-md" />
                    </div>
                )}
            </div>
            {suggestions && (
                <datalist {...datalistProps}>
                    {suggestions.map((suggestion) => (
                        <option
                            key={suggestion}
                            value={suggestion}
                            onClick={() => {
                                if (onSuggestionClick) {
                                    onSuggestionClick(suggestion)
                                }
                            }}
                        />
                    ))}
                </datalist>
            )}
        </>
    )
}
