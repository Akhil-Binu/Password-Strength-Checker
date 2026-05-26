import React from 'react';
import { Check, Dot } from 'lucide-react';

interface SecurityChecklistProps {
  password: string;
  isCommon: boolean;
  patterns: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasDigit: boolean;
    hasSymbol: boolean;
    isRepeatedChar: boolean;
    isSequential: boolean;
    length: number;
  };
}

export const SecurityChecklist: React.FC<SecurityChecklistProps> = ({
  password,
  isCommon,
  patterns,
}) => {
  const checks = [
    {
      id: 'length',
      label: 'At least 12 characters',
      met: patterns.length >= 12,
    },
    {
      id: 'case',
      label: 'Mixed case (uppercase & lowercase)',
      met: patterns.hasLowercase && patterns.hasUppercase,
    },
    {
      id: 'number',
      label: 'Contains numbers (0-9)',
      met: patterns.hasDigit,
    },
    {
      id: 'symbol',
      label: 'Contains symbols (!@#$%^&...)',
      met: patterns.hasSymbol,
    },
    {
      id: 'patterns',
      label: 'No repetitive or sequential keys',
      met: password.length > 0 && !patterns.isRepeatedChar && !patterns.isSequential,
    },
    {
      id: 'common',
      label: 'Not in top common list / no personal info',
      met: password.length > 0 && !isCommon,
    },
  ];

  return (
    <div className="checklist-container">
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#e5e7eb' }} className="light-theme-dark-text">
        Security Requirements
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {checks.map((check) => (
          <div
            key={check.id}
            className={`checklist-item ${check.met ? 'met' : 'unmet'}`}
          >
            <div className="checklist-icon">
              {check.met ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <Dot size={16} strokeWidth={3} style={{ opacity: 0.4 }} />
              )}
            </div>
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SecurityChecklist;
