import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Lock, Moon, Sun, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PasswordInput } from './components/PasswordInput';
import { SecurityChecklist } from './components/SecurityChecklist';
import { StrengthGauge } from './components/StrengthGauge';
import { PasswordAlternatives } from './components/PasswordAlternatives';
import { calculateEntropy } from './utils/entropy';
import { checkCommonPasswords } from './utils/commonPasswords';

function App() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [shake, setShake] = useState(false);

  // Check entropy and common passwords
  const entropyResult = calculateEntropy(password);
  const commonCheckResult = checkCommonPasswords(password, [username, email]);

  // Handle apply password from generators
  const handleApplyPassword = (newPassword: string) => {
    setPassword(newPassword);
    // Visual indicator that it was applied
    const inputField = document.getElementById('password-field');
    if (inputField) {
      inputField.classList.add('applied');
      setTimeout(() => inputField.classList.remove('applied'), 1000);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Sync body theme class
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, [isDarkTheme]);

  // Trigger celebration on "very-strong" password milestone
  useEffect(() => {
    if (entropyResult.strength === 'very-strong' && password.length >= 12 && !commonCheckResult.isCommon) {
      // Fire confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#d946ef', '#10b981', '#6366f1']
      });
    }
  }, [entropyResult.strength, commonCheckResult.isCommon]);

  // Shake input when a common password is typed
  useEffect(() => {
    if (commonCheckResult.isCommon) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [commonCheckResult.isCommon]);

  return (
    <>
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle" 
        title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
        aria-label={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
      >
        {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="app-container">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '8px' }}>
            <Shield size={36} style={{ color: 'var(--cyan)', filter: 'drop-shadow(0 0 8px var(--cyan-glow))' }} />
            <h1 style={{ margin: 0 }}>Fortress</h1>
          </div>
          <p className="subtitle">
            Advanced real-time password entropy &amp; security analyser
          </p>
        </header>

        {/* Personalized Check Fields (Username / Email context) */}
        <section className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Info size={16} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Personalize Security Checks
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '14px' }} className="light-theme-dark-text">
            Strong passwords should never contain your name, username, or email. Enter them below to check if they leak into your password.
          </p>
          <div className="context-row">
            <input
              type="text"
              placeholder="Username / Nickname"
              className="context-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email address"
              className="context-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </section>

        {/* Main Dashboard Section */}
        <div className="dashboard-grid">
          
          {/* Left Column: Input, Alerts, Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <section className={`glass-panel ${shake ? 'shake' : ''}`}>
              <PasswordInput
                value={password}
                onChange={setPassword}
                strength={entropyResult.strength}
              />

              {/* Warning panel for common passwords */}
              {commonCheckResult.isCommon && (
                <div className="alert-panel">
                  <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                      Security Breach Detected
                    </strong>
                    <span style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                      {commonCheckResult.warning}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
                <SecurityChecklist
                  password={password}
                  isCommon={commonCheckResult.isCommon}
                  patterns={entropyResult.patterns}
                />
              </div>
            </section>
          </div>

          {/* Right Column: Circular Gauge & Crack Speed */}
          <section className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StrengthGauge
              entropy={entropyResult.entropy}
              strength={entropyResult.strength}
              crackTimeOffline={entropyResult.crackTimeOffline}
              crackTimeOnline={entropyResult.crackTimeOnline}
            />
          </section>
        </div>

        {/* Alternatives, Upgrader & Generators Section */}
        <section>
          <PasswordAlternatives
            currentPassword={password}
            onApplyPassword={handleApplyPassword}
          />
        </section>

        {/* Privacy Notice Footer */}
        <footer style={{ marginTop: '20px', marginBottom: '40px' }}>
          <div className="security-notice">
            <Lock size={14} style={{ color: 'var(--emerald)' }} />
            <span>
              Zero-Knowledge Guarantee: All calculations are computed instantly in your browser. No passwords are sent to any server.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
