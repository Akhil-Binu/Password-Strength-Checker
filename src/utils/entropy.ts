/**
 * Password strength entropy checker utility.
 * Calculates mathematical entropy and estimates brute-force crack time.
 */

export interface EntropyResult {
  entropy: number;
  poolSize: number;
  strength: 'very-weak' | 'weak' | 'reasonable' | 'strong' | 'very-strong';
  crackTimeOffline: string;
  crackTimeOnline: string;
  feedback: string[];
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

export function calculateEntropy(password: string): EntropyResult {
  const length = password.length;
  if (length === 0) {
    return {
      entropy: 0,
      poolSize: 0,
      strength: 'very-weak',
      crackTimeOffline: 'instant',
      crackTimeOnline: 'instant',
      feedback: ['Please enter a password.'],
      patterns: {
        hasLowercase: false,
        hasUppercase: false,
        hasDigit: false,
        hasSymbol: false,
        isRepeatedChar: false,
        isSequential: false,
        length: 0,
      },
    };
  }

  // Determine character pools
  let poolSize = 0;
  let hasLowercase = false;
  let hasUppercase = false;
  let hasDigit = false;
  let hasSymbol = false;

  if (/[a-z]/.test(password)) {
    poolSize += 26;
    hasLowercase = true;
  }
  if (/[A-Z]/.test(password)) {
    poolSize += 26;
    hasUppercase = true;
  }
  if (/[0-9]/.test(password)) {
    poolSize += 10;
    hasDigit = true;
  }
  // Standard ASCII symbols and space
  if (/[^a-zA-Z0-9]/.test(password)) {
    poolSize += 33; // ~33 common special chars: !@#$%^&*()_+-=[]{}|;':",./<>?`~ etc.
    hasSymbol = true;
  }

  // Formula: E = L * log2(R)
  let entropy = length * Math.log2(poolSize || 1);
  entropy = Math.round(entropy * 100) / 100;

  // Penalize for patterns (e.g., repeating chars, sequences)
  const feedback: string[] = [];
  let isRepeatedChar = false;
  let isSequential = false;

  // 1. Repeating characters like "aaaa"
  if (/(.)\1{3,}/.test(password)) {
    isRepeatedChar = true;
    feedback.push('Contains repeating characters (e.g. "aaaa").');
    // Reduce entropy due to repeating character redundancy
    entropy = Math.max(0, entropy * 0.7);
  }

  // 2. Sequential sequences (e.g. "1234", "abcd", "qwert")
  if (detectSequence(password)) {
    isSequential = true;
    feedback.push('Contains sequential letters or numbers.');
    entropy = Math.max(0, entropy * 0.8);
  }

  // 3. Length checks
  if (length < 8) {
    feedback.push('Too short (aim for at least 12 characters).');
  } else if (length < 12) {
    feedback.push('Increasing length is the single most effective way to secure a password.');
  }

  // 4. Missing character pools
  const missingTypes: string[] = [];
  if (!hasLowercase) missingTypes.push('lowercase letters');
  if (!hasUppercase) missingTypes.push('uppercase letters');
  if (!hasDigit) missingTypes.push('numbers');
  if (!hasSymbol) missingTypes.push('symbols');

  if (missingTypes.length > 0 && length > 0) {
    feedback.push(`Add ${missingTypes.join(', ')} to diversify your character pool.`);
  }

  // Determine strength tier
  let strength: EntropyResult['strength'] = 'very-weak';
  if (entropy >= 128) {
    strength = 'very-strong';
  } else if (entropy >= 60) {
    strength = 'strong';
  } else if (entropy >= 36) {
    strength = 'reasonable';
  } else if (entropy >= 28) {
    strength = 'weak';
  }

  // Calculate Crack Times
  // Offline: assume a fast desktop GPU or botnet can do 10 billion (10^10) guesses/sec
  const offlineGuessesPerSecond = 1e10;
  // Online: assume standard server rate-limiting/network latency of 100 guesses/sec
  const onlineGuessesPerSecond = 100;

  const crackTimeOffline = formatTime(Math.pow(2, entropy) / 2 / offlineGuessesPerSecond);
  const crackTimeOnline = formatTime(Math.pow(2, entropy) / 2 / onlineGuessesPerSecond);

  return {
    entropy: Math.round(entropy * 10) / 10,
    poolSize,
    strength,
    crackTimeOffline,
    crackTimeOnline,
    feedback,
    patterns: {
      hasLowercase,
      hasUppercase,
      hasDigit,
      hasSymbol,
      isRepeatedChar,
      isSequential,
      length,
    },
  };
}

function detectSequence(password: string): boolean {
  const lower = password.toLowerCase();
  
  // Forward/backward keyboard and alphabet checks
  const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
    '0123456789876543210',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];

  for (const seq of sequences) {
    for (let i = 0; i <= seq.length - 4; i++) {
      const sub = seq.substring(i, i + 4);
      if (lower.includes(sub)) {
        return true;
      }
    }
  }

  // Check character difference progression (e.g. 'aceg' (+2) or '1357' or 'abcd' (+1))
  for (let i = 0; i <= password.length - 4; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    const c3 = password.charCodeAt(i + 2);
    const c4 = password.charCodeAt(i + 3);

    const diff1 = c2 - c1;
    const diff2 = c3 - c2;
    const diff3 = c4 - c3;

    if (diff1 === diff2 && diff2 === diff3 && (diff1 === 1 || diff1 === -1)) {
      return true;
    }
  }

  return false;
}

function formatTime(seconds: number): string {
  if (seconds < 1) return 'instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  
  const months = days / 30.42;
  if (months < 12) return `${Math.round(months)} months`;
  
  const years = months / 12;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1000) return `${Math.round(years / 100) * 100} years`;
  if (years < 1e6) return `${Math.round(years / 1000)}k years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return 'trillions of years';
}
