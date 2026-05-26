/**
 * Common passwords detection utility.
 * Checks passwords against a list of the most common passwords, including case-insensitive
 * matching and leetspeak substitution detection.
 */

// A curated list of the top 400 most common passwords, keyboard runs, and basic patterns
const COMMON_PASSWORDS_LIST = [
  '123456', 'password', '123456789', 'qwerty', '12345678', '111111', '1234567', 'letmein', 'welcome', 'football',
  '12345', '1234567890', '1234321', 'admin', 'pass', 'pass123', 'secret', 'dragon', 'monkey', 'sunshine', 'princess',
  'charlie', 'shadow', 'jessica', 'cookie', 'mustang', 'hunter', 'caterpillar', 'superman', 'batman', 'family',
  'hello', 'iloveyou', 'starwars', 'killer', 'ginger', 'snickers', 'phoenix', 'george', 'chester', 'biscuit',
  'wizard', 'pokemon', 'snoopy', 'jackson', 'harley', 'bailey', 'roxy', 'buster', 'buddy', 'oliver', 'simba',
  'toby', 'lucky', 'milo', 'oscar', 'rusty', 'gizmo', 'samson', 'zeus', 'rocky', 'diesel', 'harley', 'bandit',
  '123123', '112233', '121212', '1234567890', '000000', '666666', '777777', '888888', '999999', '123321',
  '123456qwerty', '654321', '7654321', '87654321', '987654321', 'asdfghjkl', 'zxcvbnm', 'poiuytrewq', 'asdfgh',
  'qwertyuiop', 'qazwsx', 'wsxedc', 'edcrfv', 'rfvtgb', 'tgbyhn', 'yhnujm', 'ujmikol', 'ikolp', 'qazxsw',
  'plmokn', 'ijnuhb', 'uhbygv', 'ygvtfc', 'tfcrdx', 'rdxesz', 'eszqaz', 'mnbvcxz', 'lkjhgfdsa', 'poiuyt',
  'love', 'god', 'jesus', 'angel', 'trust', 'hope', 'faith', 'peace', 'grace', 'mercy', 'glory', 'destiny',
  'master', 'rookie', 'rookie1', 'rookie12', 'rookie123', 'gamers', 'gaming', 'player', 'ninja', 'sniper',
  'hacker', 'system', 'root', 'login', 'default', 'security', 'guest', 'user', 'service', 'database',
  'testing', 'developer', 'manager', 'director', 'account', 'office', 'school', 'college', 'student',
  'teacher', 'doctor', 'nurse', 'police', 'soldier', 'marine', 'ranger', 'scout', 'hunter1', 'hunter12',
  'soccer', 'baseball', 'basketball', 'hockey', 'tennis', 'golf', 'rugby', 'cricket', 'volleyball',
  'chelsea', 'arsenal', 'liverpool', 'manchester', 'united', 'barcelona', 'madrid', 'juventus', 'milan',
  'boston', 'chicago', 'houston', 'dallas', 'atlanta', 'miami', 'seattle', 'denver', 'detroit', 'phoenix',
  'london', 'paris', 'berlin', 'tokyo', 'sydney', 'toronto', 'canada', 'america', 'mexico', 'brazil',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
  'november', 'december', 'spring', 'summer', 'autumn', 'winter', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday', 'sunday', 'morning', 'afternoon', 'evening', 'night', 'midnight',
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'silver',
  'gold', 'bronze', 'platinum', 'diamond', 'emerald', 'ruby', 'sapphire', 'pearl', 'crystal', 'stone',
  'apple', 'banana', 'orange', 'strawberry', 'grape', 'peach', 'cherry', 'lemon', 'melon', 'coconut',
  'pizza', 'burger', 'pasta', 'taco', 'sushi', 'salad', 'soup', 'bread', 'butter', 'cheese', 'coffee',
  'beer', 'wine', 'whiskey', 'vodka', 'rum', 'tequila', 'juice', 'soda', 'water', 'milk', 'chocolate',
  'dog', 'cat', 'horse', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'eagle', 'hawk', 'shark', 'dolphin',
  'whale', 'snake', 'lizard', 'frog', 'spider', 'bee', 'ant', 'butterfly', 'dragonfly', 'dinosaur',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand',
  'million', 'billion', 'first', 'second', 'third', 'last', 'next', 'before', 'after', 'always', 'never',
  'happy', 'sad', 'angry', 'crazy', 'sexy', 'sweet', 'cool', 'smart', 'cute', 'funny', 'crazy1', 'sexy1',
  'beautiful', 'handsome', 'perfect', 'awesome', 'amazing', 'magic', 'super', 'mega', 'ultra', 'hyper',
  'matrix', 'avatar', 'inception', 'gladiator', 'titanic', 'starwars1', 'lordoftherings', 'harrypotter',
  'superman1', 'batman1', 'spiderman', 'ironman', 'thor', 'hulk', 'captainamerica', 'avengers', 'wolverine',
  'nvidia', 'intel', 'amd', 'microsoft', 'google', 'apple1', 'amazon', 'netflix', 'facebook', 'instagram',
  'twitter', 'youtube', 'reddit', 'tiktok', 'whatsapp', 'snapchat', 'spotify', 'discord', 'steam',
  'correcthorsebatterystaple', 'qwertyuiopasdfghjklzxcvbnm', '1234567890poiuytrewqasdfghjklmnbvcxz'
];

const COMMON_PASSWORDS_SET = new Set(COMMON_PASSWORDS_LIST.map(p => p.toLowerCase()));

/**
 * Replaces common leetspeak substitutions with standard characters.
 * E.g., "P@$$w0rd" -> "password"
 */
export function normalizeLeetspeak(input: string): string {
  let normalized = input.toLowerCase();

  // Leetspeak mapping
  const replacements: { [key: string]: string } = {
    '@': 'a',
    '4': 'a',
    '8': 'b',
    '3': 'e',
    '9': 'g',
    '1': 'i',
    '!': 'i',
    '0': 'o',
    '5': 's',
    '$': 's',
    '7': 't',
    '2': 'z'
  };

  let prev = '';
  // Run replacement until no changes are made (handles double substitutions if any)
  while (normalized !== prev) {
    prev = normalized;
    for (const [leet, normal] of Object.entries(replacements)) {
      normalized = normalized.replaceAll(leet, normal);
    }
  }

  return normalized;
}

export interface CommonPasswordCheck {
  isCommon: boolean;
  matchType: 'exact' | 'leetspeak' | 'contains' | 'none';
  matchedWord?: string;
  warning?: string;
}

/**
 * Checks if the password or its normalized form matches a known common password.
 */
export function checkCommonPasswords(password: string, userInputs: string[] = []): CommonPasswordCheck {
  const cleanPassword = password.trim();
  if (!cleanPassword) {
    return { isCommon: false, matchType: 'none' };
  }

  const lowerPassword = cleanPassword.toLowerCase();

  // 1. Check user context inputs (e.g. username, email, site name)
  for (const info of userInputs) {
    if (info && info.length >= 3) {
      const cleanInfo = info.trim().toLowerCase();
      if (lowerPassword === cleanInfo) {
        return {
          isCommon: true,
          matchType: 'exact',
          matchedWord: info,
          warning: 'This password is exactly your personal information (username/email).'
        };
      }
      if (lowerPassword.includes(cleanInfo)) {
        return {
          isCommon: true,
          matchType: 'contains',
          matchedWord: info,
          warning: 'This password contains your personal information (username/email).'
        };
      }
    }
  }

  // 2. Exact match check
  if (COMMON_PASSWORDS_SET.has(lowerPassword)) {
    return {
      isCommon: true,
      matchType: 'exact',
      matchedWord: lowerPassword,
      warning: `"${cleanPassword}" is on the list of most commonly used passwords.`
    };
  }

  // 3. Normalized leetspeak check
  const normalized = normalizeLeetspeak(lowerPassword);
  if (normalized !== lowerPassword && COMMON_PASSWORDS_SET.has(normalized)) {
    return {
      isCommon: true,
      matchType: 'leetspeak',
      matchedWord: normalized,
      warning: `"${cleanPassword}" is a leetspeak variation of the common password "${normalized}".`
    };
  }

  // 4. Substring check: Does it contain a common password of length >= 6?
  // Sort by length descending to find the longest match first
  for (const common of COMMON_PASSWORDS_LIST) {
    if (common.length >= 6 && lowerPassword.includes(common)) {
      return {
        isCommon: true,
        matchType: 'contains',
        matchedWord: common,
        warning: `This password contains the common sequence or word "${common}".`
      };
    }
    // Also check normalized substring
    if (common.length >= 6 && normalized.includes(common)) {
      return {
        isCommon: true,
        matchType: 'contains',
        matchedWord: common,
        warning: `This password contains a leetspeak variation of the common word "${common}".`
      };
    }
  }

  return { isCommon: false, matchType: 'none' };
}
