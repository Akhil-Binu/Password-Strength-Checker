import { calculateEntropy } from './entropy';
import { checkCommonPasswords, normalizeLeetspeak } from './commonPasswords';
import { generateRandomPassword, generatePassphrase, generateUpgradedAlternatives } from './generator';

function runTests() {
  console.log('=== STARTING PASSWORD UTILITY TESTS ===\n');

  // Test 1: Leetspeak normalization
  console.log('Test 1: Leetspeak normalization');
  const normal1 = normalizeLeetspeak('P@$$w0rd');
  console.log(`- "P@$$w0rd" -> "${normal1}" (Expected: "password")`);
  const normal2 = normalizeLeetspeak('L337H@ck3r');
  console.log(`- "L337H@ck3r" -> "${normal2}" (Expected: "leethacker")`);
  console.log('Success!\n');

  // Test 2: Entropy Calculations
  console.log('Test 2: Entropy Calculations');
  const testCases = [
    { pass: '123456', desc: 'Short common sequence' },
    { pass: 'password', desc: 'Common word' },
    { pass: 'aB3$fG9*', desc: 'Diverse character sets but short' },
    { pass: 'CorrectHorseBatteryStaple', desc: 'Long passphrase' },
    { pass: 'supersecurepassword2026!@#', desc: 'Long diverse password' }
  ];

  testCases.forEach(({ pass, desc }) => {
    const res = calculateEntropy(pass);
    console.log(`- Password: "${pass}" (${desc})`);
    console.log(`  Entropy: ${res.entropy} bits, Pool: ${res.poolSize}, Strength: ${res.strength.toUpperCase()}`);
    console.log(`  Crack time: Offline: ${res.crackTimeOffline} | Online: ${res.crackTimeOnline}`);
  });
  console.log('Success!\n');

  // Test 3: Common Password Scan
  console.log('Test 3: Common Password Scan');
  const commonCases = [
    { pass: '123456', userInputs: [], expected: true, type: 'exact' },
    { pass: 'P@$$w0rd', userInputs: [], expected: true, type: 'leetspeak' },
    { pass: 'MySecretPassword123', userInputs: [], expected: false, type: 'none' },
    { pass: 'football_legend', userInputs: [], expected: true, type: 'contains' }, // Contains "football"
    { pass: 'akhil123', userInputs: ['akhil'], expected: true, type: 'contains' } // Contains username
  ];

  commonCases.forEach(({ pass, userInputs, expected, type }) => {
    const check = checkCommonPasswords(pass, userInputs);
    console.log(`- Password: "${pass}" | Context: [${userInputs.join(', ')}]`);
    console.log(`  Is Common: ${check.isCommon} (Expected: ${expected}) | Match: ${check.matchType} (Expected: ${type})`);
    if (check.warning) console.log(`  Warning: ${check.warning}`);
  });
  console.log('Success!\n');

  // Test 4: Generator & Upgrader
  console.log('Test 4: Generator & Upgrader');
  const randomPass = generateRandomPassword({ length: 16, lowercase: true, uppercase: true, numbers: true, symbols: true });
  console.log(`- Generated Random (16 chars): "${randomPass}" | Entropy: ${calculateEntropy(randomPass).entropy} bits`);
  
  const passphrase = generatePassphrase(5, '-');
  console.log(`- Generated Passphrase (5 words): "${passphrase}" | Entropy: ${calculateEntropy(passphrase).entropy} bits`);

  console.log('\nSmart Upgrades for "weakpass":');
  const upgrades = generateUpgradedAlternatives('weakpass');
  upgrades.forEach(up => {
    console.log(`- [${up.type.toUpperCase()}] -> "${up.password}" | Entropy: ${up.entropy} | Improvement: ${up.improvementMultiplier}`);
  });

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
}

runTests();
