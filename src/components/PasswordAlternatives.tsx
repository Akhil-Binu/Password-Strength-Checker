import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Sliders, Shield, Info } from 'lucide-react';
import {
  generateRandomPassword,
  generatePassphrase,
  generateUpgradedAlternatives,
} from '../utils/generator';
import type { UpgradedAlternative } from '../utils/generator';
import { calculateEntropy } from '../utils/entropy';

interface PasswordAlternativesProps {
  currentPassword: string;
  onApplyPassword: (pass: string) => void;
}

type TabType = 'upgrader' | 'random' | 'passphrase';

export const PasswordAlternatives: React.FC<PasswordAlternativesProps> = ({
  currentPassword,
  onApplyPassword,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upgrader');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Random Password Generator State
  const [randomLength, setRandomLength] = useState(16);
  const [randomOpts, setRandomOpts] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [generatedRandom, setGeneratedRandom] = useState('');

  // Passphrase Generator State
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [generatedPassphrase, setGeneratedPassphrase] = useState('');

  // Smart Upgrades List
  const [upgrades, setUpgrades] = useState<UpgradedAlternative[]>([]);

  // Regenerate random password
  const handleGenerateRandom = () => {
    const password = generateRandomPassword({
      length: randomLength,
      ...randomOpts,
    });
    setGeneratedRandom(password);
  };

  // Regenerate passphrase
  const handleGeneratePassphrase = () => {
    const phrase = generatePassphrase(wordCount, separator);
    setGeneratedPassphrase(phrase);
  };

  // Handle Copy
  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Run upgrades whenever the password changes
  useEffect(() => {
    if (currentPassword) {
      setUpgrades(generateUpgradedAlternatives(currentPassword));
    } else {
      setUpgrades([]);
    }
  }, [currentPassword]);

  // Generate initial random/passphrase
  useEffect(() => {
    handleGenerateRandom();
    handleGeneratePassphrase();
  }, []);

  // Recalculate random when parameters change
  useEffect(() => {
    handleGenerateRandom();
  }, [randomLength, randomOpts]);

  // Recalculate passphrase when parameters change
  useEffect(() => {
    handleGeneratePassphrase();
  }, [wordCount, separator]);

  // Handle Tab Switch
  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Entropy calculations for generated passwords
  const randomEntropy = generatedRandom ? calculateEntropy(generatedRandom) : null;
  const passphraseEntropy = generatedPassphrase ? calculateEntropy(generatedPassphrase) : null;

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'upgrader' ? 'active' : ''}`}
          onClick={() => switchTab('upgrader')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={16} />
          Smart Upgrade
        </button>
        <button
          className={`tab-btn ${activeTab === 'random' ? 'active' : ''}`}
          onClick={() => switchTab('random')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sliders size={16} />
          Secure Random
        </button>
        <button
          className={`tab-btn ${activeTab === 'passphrase' ? 'active' : ''}`}
          onClick={() => switchTab('passphrase')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield size={16} />
          Memorable Pass
        </button>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* TAB 1: SMART UPGRADER */}
        {activeTab === 'upgrader' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            {!currentPassword ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280',
                  gap: '12px',
                  flexGrow: 1,
                }}
              >
                <Info size={32} style={{ opacity: 0.5 }} />
                <p>Type a password in the input field above to view real-time smart upgrades.</p>
              </div>
            ) : (
              <div className="upgrade-list">
                {upgrades.map((upgrade, index) => {
                  const isCopied = copiedText === upgrade.password;
                  return (
                    <div key={upgrade.type + index} className="upgrade-item">
                      <div className="upgrade-header">
                        <span className="upgrade-title">
                          {upgrade.type === 'complexity'
                            ? '💪 Standard Complexity'
                            : upgrade.type === 'passphrase'
                            ? '🔑 Memorable Multi-Word'
                            : '⚡ Full Cyber Shield'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${upgrade.strength}`}>
                            {upgrade.entropy} Bits
                          </span>
                          <span className="upgrade-multiplier">
                            {upgrade.improvementMultiplier}
                          </span>
                        </div>
                      </div>
                      <p className="upgrade-desc">{upgrade.explanation}</p>
                      <div className="upgrade-value-row">
                        <span className="upgrade-value">{upgrade.password}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            onClick={() => handleCopy(upgrade.password)}
                            title="Copy to clipboard"
                          >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => onApplyPassword(upgrade.password)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SECURE RANDOM GENERATOR */}
        {activeTab === 'random' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="range-container">
              <div className="range-label-row">
                <span className="form-label" style={{ fontSize: '0.8rem' }}>Password Length</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{randomLength}</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="8"
                max="64"
                value={randomLength}
                onChange={(e) => setRandomLength(parseInt(e.target.value))}
              />
            </div>

            <div className="options-grid">
              <label className="switch-label">
                <span>Lowercase (a-z)</span>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={randomOpts.lowercase}
                  onChange={(e) =>
                    setRandomOpts({ ...randomOpts, lowercase: e.target.checked })
                  }
                />
              </label>
              <label className="switch-label">
                <span>Uppercase (A-Z)</span>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={randomOpts.uppercase}
                  onChange={(e) =>
                    setRandomOpts({ ...randomOpts, uppercase: e.target.checked })
                  }
                />
              </label>
              <label className="switch-label">
                <span>Numbers (0-9)</span>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={randomOpts.numbers}
                  onChange={(e) =>
                    setRandomOpts({ ...randomOpts, numbers: e.target.checked })
                  }
                />
              </label>
              <label className="switch-label">
                <span>Symbols (!@#$)</span>
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={randomOpts.symbols}
                  onChange={(e) =>
                    setRandomOpts({ ...randomOpts, symbols: e.target.checked })
                  }
                />
              </label>
            </div>

            <div className="generated-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Generated Password</span>
                {randomEntropy && (
                  <span className={`badge ${randomEntropy.strength}`} style={{ fontSize: '0.65rem' }}>
                    {randomEntropy.entropy} Bits ({randomEntropy.strength.replace('-', ' ')})
                  </span>
                )}
              </div>
              <div className="generated-value">{generatedRandom}</div>
              <div className="action-row">
                <button className="btn btn-secondary" onClick={handleGenerateRandom}>
                  <RefreshCw size={16} /> Regenerate
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleCopy(generatedRandom)}
                  >
                    {copiedText === generatedRandom ? (
                      <>
                        <Check size={16} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onApplyPassword(generatedRandom)}
                  >
                    Apply Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEMORABLE PASSPHRASE GENERATOR */}
        {activeTab === 'passphrase' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="range-container">
              <div className="range-label-row">
                <span className="form-label" style={{ fontSize: '0.8rem' }}>Word Count</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{wordCount}</span>
              </div>
              <input
                type="range"
                className="range-input"
                min="3"
                max="8"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Word Separator</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {['-', '_', '.', ' '].map((char) => (
                  <button
                    key={char}
                    type="button"
                    className={`btn ${separator === char ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flexGrow: 1, padding: '8px 0', fontSize: '0.9rem' }}
                    onClick={() => setSeparator(char)}
                  >
                    {char === ' ' ? 'Space' : char}
                  </button>
                ))}
              </div>
            </div>

            <div className="generated-card" style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Generated Passphrase</span>
                {passphraseEntropy && (
                  <span className={`badge ${passphraseEntropy.strength}`} style={{ fontSize: '0.65rem' }}>
                    {passphraseEntropy.entropy} Bits ({passphraseEntropy.strength.replace('-', ' ')})
                  </span>
                )}
              </div>
              <div className="generated-value">{generatedPassphrase}</div>
              <div className="action-row">
                <button className="btn btn-secondary" onClick={handleGeneratePassphrase}>
                  <RefreshCw size={16} /> Regenerate
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleCopy(generatedPassphrase)}
                  >
                    {copiedText === generatedPassphrase ? (
                      <>
                        <Check size={16} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onApplyPassword(generatedPassphrase)}
                  >
                    Apply Passphrase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PasswordAlternatives;
