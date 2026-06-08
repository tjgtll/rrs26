import { useState, useMemo } from 'react';
import type { CountryAutocompleteProps } from '../types';

export const CountryAutocomplete = ({
  id,
  options,
  value,
  onSelect,
}: CountryAutocompleteProps) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = useMemo(() => {
    if (value.trim() === '') return [];
    return options.filter((opt) =>
      opt.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = (country: string) => {
    onSelect(country);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => setShowDropdown(true)}
        autoComplete="off"
      />
      {showDropdown && filtered.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ccc',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            maxHeight: '150px',
            overflowY: 'auto',
            width: '100%',
            zIndex: 10,
          }}
        >
          {filtered.map((country) => (
            <li
              key={country}
              onClick={() => handleSelect(country)}
              style={{ padding: '4px', cursor: 'pointer' }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
