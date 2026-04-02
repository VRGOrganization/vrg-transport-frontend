"use client";

import { useState, useRef, useEffect, InputHTMLAttributes } from "react";

interface AutocompleteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function AutocompleteInput({
  label,
  icon,
  options,
  value,
  onValueChange,
  placeholder,
  ...rest
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onValueChange(newValue);
    
    if (newValue.trim() === "") {
      setFilteredOptions([]);
      setIsOpen(false);
    } else {
      const filtered = options.filter(opt =>
        opt.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(true);
    }
  };

  const handleSelectOption = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              {icon}
            </span>
          )}
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => value.trim() !== "" && filteredOptions.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full h-12 rounded-xl bg-surface-container-low px-4 ${
              icon ? "pl-10" : ""
            } text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary transition-all`}
            {...rest}
          />
        </div>
        
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-20 w-full mt-1 bg-surface-container-high rounded-xl shadow-lg max-h-60 overflow-auto border border-outline-variant">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleSelectOption(option)}
                className="px-4 py-2 hover:bg-surface-container-low cursor-pointer text-on-surface transition-colors"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}