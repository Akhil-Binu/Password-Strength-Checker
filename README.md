# 🛡️ Akhil Fortress

**Akhil Fortress** is a visually stunning, zero-knowledge, client-side password security tool and dashboard. It calculates mathematical information-theoretic entropy, scans for common leaked passwords (including complex leetspeak variants), flags personal identity leaks, and generates cryptographically secure alternatives or upgrades.

Built with a futuristic glassmorphic cyberpunk theme, it delivers real-time, high-performance visual feedback and guarantees absolute privacy by running entirely inside the local browser sandbox.

---

## 🌟 Key Features

### 1. Mathematical Entropy Calculator
Calculates the exact strength of passwords using Shannon entropy:
$$E = L \times \log_2(R)$$
Where:
- $L$ is the length of the password.
- $R$ is the size of the character pool (lowercase = 26, uppercase = 26, digits = 10, symbols = 33).

It applies automated entropy deductions for repeated characters (e.g., `aaaa`) and keyboard/alphabetical sequences (e.g., `12345`, `qwert`, `abcd`).

### 2. Time-To-Crack Estimation
Simulates how long a hacker would take to crack the password under two environments:
- **Offline Attack**: High-speed offline cracking clusters (e.g., hashcat on multiple GPUs) running $10^{10}$ guesses/second.
- **Online Attack**: Standard remote network latency and rate-limiting limits running $100$ guesses/second.

### 3. Smart Dictionary & Leetspeak Decoding
- Scans passwords against a database of the most common leaked passwords, keyboard walks, and dictionary roots.
- Normalizes character substitutions to detect hidden patterns (e.g., `P@$$w0rd` is decoded to `password` and flagged as weak).
- Supported mappings: `@/4 -> a`, `3 -> e`, `1/! -> i`, `0 -> o`, `5/$ -> s`, `7 -> t`, `8 -> b`, `9 -> g`.

### 4. Personal Context Leak Scan
Allows users to enter their username, nickname, or email context. The application flags any password containing these values to prevent targeted social engineering attacks.

### 5. Smart Upgrade Simulator
Recommends three categories of upgraded passwords derived from their input:
- **Standard Complexity**: Injects missing character classes and pads the length to at least 12 characters.
- **Memorable Passphrase**: Appends random memorable dictionary words separated by a delimiter, expanding length while remaining easy to remember.
- **Full Cyber Shield**: Alters characters to mixed-case, wraps the password in brackets, and appends a cryptographically secure 6-character random suffix.

### 6. Secure Random & Passphrase Generators
Includes a dedicated tabbed generator panel:
- **Secure Random**: Custom length, lowercase, uppercase, numbers, and symbols sliders.
- **Memorable Passphrase (Diceware)**: Selects 3-8 random words from a curated list of easy-to-recall English nouns and adjectives.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual Effects**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Styling**: Pure vanilla CSS styled custom design system (Cyberpunk Glassmorphism)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Navigate to the repository directory:
   ```bash
   cd "d:\Code\Password Strength Checker"
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Spin up the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Production Build

To compile a minified production bundle in the `dist` directory:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🔒 Zero-Knowledge Security Model

Unlike many online password checkers, **Akhil Fortress** is 100% client-side:
- **No network requests**: Passwords are never sent to external APIs or databases.
- **Zero tracking**: Computations and generators execute entirely in your local browser sandbox.
- **Cryptographically Secure**: Random passwords are generated using browser-native `crypto.getRandomValues()`.
