"use client";

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";

interface AutocompleteInputProps {
  label: string;
  icon?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
}

export function AutocompleteInput({
  label,
  icon,
  placeholder,
  options,
  value,
  onValueChange,
  disabled = false,
  onBlur,
  required = false,
  error,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filtra opções baseado no valor do input
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Atualiza input value quando value prop muda
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fecha dropdown quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scrolla para o item ativo
  useEffect(() => {
    if (activeIndex >= 0 && listboxRef.current) {
      const activeItem = listboxRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredOptions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(filteredOptions.length - 1);
        } else {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredOptions[activeIndex]) {
          handleSelectOption(filteredOptions[activeIndex]);
        } else if (inputValue && !isOpen) {
          onValueChange(inputValue);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;

      case "Tab":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onValueChange(option);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (filteredOptions.length > 0 && !disabled) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir clique no dropdown
    setTimeout(() => {
      if (!wrapperRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }, 150);
    onBlur?.();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      
      <div className="relative mt-2 group">
        {icon && (
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors z-10">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="autocomplete-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `option-${activeIndex}` : undefined
          }
          aria-label={label}
          aria-required={required}
          className={`w-full h-14 bg-surface-container-lowest border-none ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary rounded-xl text-on-surface placeholder:text-outline/50 transition-all outline-none
            ${icon ? "pl-12" : "pl-4"}
            ${error ? "ring-error focus:ring-error" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {error && (
        <p className="text-xs text-error mt-1 ml-1" role="alert">
          {error}
        </p>
      )}

      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listboxRef}
          id="autocomplete-listbox"
          role="listbox"
          aria-label={`${label} options`}
          className="absolute z-50 w-full mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 max-h-60 overflow-auto"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={`${option}-${index}`}
              id={`option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={`px-4 py-3 cursor-pointer transition-colors text-on-surface hover:bg-surface-container-high
                ${activeIndex === index ? "bg-primary text-white" : ""}
              `}
              onClick={() => handleSelectOption(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-base">
                  {icon === "school" ? "school" : "menu_book"}
                </span>
                <span className="text-sm font-medium">{option}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-4 text-center text-on-surface-variant text-sm">
          Nenhuma opção encontrada
        </div>
      )}
    </div>
  );
}