import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  strength: 'very-weak' | 'weak' | 'reasonable' | 'strong' | 'very-strong';
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  strength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleShow = () => {
    setShowPassword(!showPassword);
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="form-group">
      <div className="action-row" style={{ marginBottom: '6px' }}>
        <label className="form-label" htmlFor="password-field">Password</label>
        {value && (
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {value.length} characters
          </span>
        )}
      </div>
      <div className={`input-container ${strength}`}>
        <input
          id="password-field"
          type={showPassword ? 'text' : 'password'}
          className="input-field"
          placeholder="Type or generate a password..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        {value && (
          <>
            <button
              type="button"
              className="input-btn"
              onClick={handleCopy}
              title="Copy to clipboard"
              aria-label="Copy password"
            >
              {copied ? (
                <Check size={20} style={{ color: 'var(--emerald)' }} />
              ) : (
                <Copy size={20} />
              )}
            </button>
            <button
              type="button"
              className="input-btn"
              onClick={toggleShow}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </>
        )}
      </div>

      {/* Miniature preview strength bar */}
      <div
        style={{
          height: '4px',
          width: '100%',
          backgroundColor: 'var(--border-color)',
          borderRadius: '2px',
          marginTop: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: value
              ? strength === 'very-weak'
                ? '20%'
                : strength === 'weak'
                ? '40%'
                : strength === 'reasonable'
                ? '60%'
                : strength === 'strong'
                ? '80%'
                : '100%'
              : '0%',
            backgroundColor: value ? `var(--color-${strength})` : 'transparent',
            boxShadow: value ? `0 0 8px var(--glow-${strength})` : 'none',
            transition: 'width 0.5s ease-out, background-color 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
export default PasswordInput;
