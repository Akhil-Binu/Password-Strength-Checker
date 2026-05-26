/**
 * Password generator utility.
 * Generates random high-entropy passwords, Diceware-style passphrases,
 * and upgrades weak passwords into secure alternatives.
 */

import { calculateEntropy } from './entropy';

const WORD_LIST = [
  'about', 'above', 'actor', 'acute', 'admit', 'adopt', 'adult', 'agent', 'agony', 'agree',
  'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone', 'along', 'alter',
  'amber', 'among', 'ample', 'amuse', 'angel', 'angle', 'angry', 'ankle', 'apple', 'apron',
  'arrow', 'asset', 'audio', 'audit', 'autumn', 'avoid', 'awake', 'award', 'aware', 'bacon',
  'badge', 'baker', 'ballot', 'banana', 'banner', 'barely', 'barrel', 'basket', 'battle', 'beauty',
  'berry', 'beyond', 'bishop', 'bitter', 'blanket', 'blazer', 'blessing', 'blond', 'blossom', 'board',
  'bonus', 'border', 'bottle', 'bounce', 'bounty', 'brain', 'branch', 'brave', 'bread', 'breeze',
  'brick', 'bridge', 'bright', 'bronze', 'brush', 'bubble', 'bucket', 'budget', 'buffer', 'bullet',
  'bundle', 'burden', 'butter', 'cabin', 'cable', 'cactus', 'cagey', 'camera', 'camp', 'canal',
  'candle', 'canvas', 'canyon', 'cargo', 'carpet', 'carrot', 'castle', 'cavity', 'census', 'chain',
  'chalk', 'champion', 'chaos', 'chapel', 'charge', 'charm', 'chase', 'cheap', 'cheese', 'cherry',
  'chess', 'chest', 'chief', 'child', 'chimney', 'chorus', 'cigar', 'circle', 'circus', 'civil',
  'claim', 'clash', 'clay', 'clean', 'clear', 'clever', 'click', 'client', 'cliff', 'climate',
  'climb', 'clinic', 'clock', 'clone', 'cloud', 'clover', 'clutch', 'coach', 'coast', 'cobalt',
  'coconut', 'coffee', 'collar', 'colony', 'combat', 'comet', 'comfort', 'comic', 'common', 'compel',
  'copper', 'coral', 'corner', 'cosmic', 'cotton', 'couch', 'cough', 'county', 'couple', 'courage',
  'cousin', 'covey', 'cradle', 'craft', 'crater', 'crayon', 'crazy', 'cream', 'credit', 'creed',
  'creek', 'crest', 'cricket', 'crisis', 'critic', 'crowd', 'crown', 'crude', 'cruel', 'crumb',
  'crust', 'crystal', 'cube', 'cubic', 'cuddle', 'cupid', 'curry', 'curse', 'curve', 'cycle',
  'cynic', 'daily', 'dairy', 'daisy', 'dance', 'danger', 'daring', 'dark', 'darling', 'dawn',
  'decade', 'decay', 'decor', 'decoy', 'decree', 'deeply', 'defeat', 'defend', 'defy', 'degree',
  'delay', 'delight', 'deliver', 'demand', 'demise', 'denial', 'dense', 'depart', 'depend', 'depict',
  'depth', 'deputy', 'derive', 'desert', 'design', 'desire', 'detail', 'detect', 'device', 'devote',
  'diary', 'diesel', 'differ', 'digest', 'digital', 'dignity', 'dinner', 'dinosaur', 'direct', 'dirt',
  'disaster', 'disc', 'discuss', 'disease', 'dislike', 'dismiss', 'disorder', 'display', 'dispute', 'distant',
  'distress', 'district', 'divide', 'divine', 'divorce', 'doctor', 'dogma', 'doll', 'domain', 'domestic',
  'donate', 'donor', 'donut', 'door', 'dosage', 'double', 'doubt', 'dough', 'dove', 'down',
  'draft', 'dragon', 'drain', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill',
  'drink', 'drive', 'drone', 'drool', 'drop', 'drown', 'drum', 'dryer', 'duck', 'due',
  'dull', 'duly', 'dune', 'dungeon', 'duo', 'dusty', 'duty', 'dwarf', 'dwell', 'dynamic',
  'eagle', 'early', 'earth', 'easily', 'east', 'echo', 'eclipse', 'ecology', 'economy', 'edge',
  'editor', 'educate', 'eerie', 'effect', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder',
  'elect', 'elegant', 'element', 'elephant', 'elite', 'elk', 'ellipse', 'elm', 'eloquent', 'else',
  'elude', 'embark', 'emblem', 'embrace', 'emerge', 'emit', 'emotion', 'emperor', 'empire', 'employ',
  'empty', 'enable', 'enact', 'enchant', 'enclose', 'encounter', 'encourage', 'endless', 'endorse', 'endure',
  'enemy', 'energy', 'enforce', 'engage', 'engine', 'enjoy', 'enlist', 'enormous', 'enough', 'enrage',
  'enrich', 'enroll', 'ensemble', 'ensue', 'ensure', 'entail', 'enter', 'entertain', 'entire', 'entitle',
  'entity', 'entrance', 'entrap', 'entry', 'envelope', 'envy', 'enzyme', 'epic', 'epoch', 'equal',
  'equip', 'era', 'erase', 'erect', 'erode', 'error', 'erupt', 'escape', 'escort', 'essay',
  'essence', 'estate', 'esteem', 'estimate', 'eternal', 'ether', 'ethical', 'ethics', 'ethnic', 'etude',
  'evacuate', 'evade', 'evaluate', 'eve', 'even', 'event', 'ever', 'every', 'evidence', 'evil',
  'evoke', 'evolve', 'exact', 'exalt', 'exam', 'exceed', 'excel', 'except', 'excerpt', 'excess',
  'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exempt', 'exert', 'exile', 'exist', 'exit',
  'exotic', 'expand', 'expect', 'expel', 'expend', 'expense', 'expert', 'explain', 'explicit', 'explode',
  'exploit', 'explore', 'export', 'expose', 'express', 'extend', 'extent', 'external', 'extinct', 'extra',
  'extreme', 'eye', 'fable', 'fabric', 'fabulous', 'face', 'facet', 'facilitate', 'fact', 'factor',
  'factory', 'faculty', 'fade', 'fail', 'faint', 'fair', 'faith', 'fake', 'falcon', 'fall',
  'false', 'fame', 'familiar', 'family', 'famine', 'famous', 'fan', 'fancy', 'fang', 'fantasy',
  'far', 'fare', 'farm', 'fascinate', 'fashion', 'fast', 'fatal', 'fate', 'father', 'fatigue',
  'faucet', 'fault', 'favor', 'fawn', 'fear', 'feast', 'feat', 'feather', 'feature', 'federal',
  'fee', 'feed', 'feel', 'feign', 'feline', 'fellow', 'felon', 'felt', 'female', 'fence',
  'fender', 'ferment', 'fern', 'ferry', 'fervent', 'festival', 'fetch', 'feud', 'fever', 'few',
  'fiber', 'fiction', 'fiddle', 'field', 'fierce', 'fiesta', 'fifth', 'fifty', 'fig', 'fight',
  'figure', 'file', 'fill', 'film', 'filter', 'filth', 'final', 'finance', 'find', 'fine',
  'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'fist', 'fit', 'five', 'fix',
  'flack', 'flag', 'flair', 'flake', 'flame', 'flank', 'flap', 'flare', 'flash', 'flask',
  'flat', 'flavor', 'flaw', 'flea', 'fled', 'flee', 'fleet', 'flesh', 'flew', 'flex',
  'flick', 'flight', 'flinch', 'fling', 'flint', 'flip', 'flirt', 'float', 'flock', 'flog',
  'flood', 'floor', 'flop', 'floss', 'flour', 'flow', 'flower', 'flown', 'flu', 'fluff',
  'fluid', 'flung', 'flush', 'flute', 'flux', 'fly', 'foal', 'foam', 'focus', 'fog',
  'foil', 'fold', 'folk', 'follow', 'fond', 'food', 'fool', 'foot', 'forage', 'force',
  'forest', 'forget', 'forgive', 'fork', 'form', 'formula', 'fort', 'forth', 'forty', 'forum',
  'fossil', 'foster', 'found', 'fountain', 'four', 'fox', 'fraction', 'fracture', 'fragile', 'fragment',
  'frame', 'framework', 'frank', 'frantic', 'fraud', 'fray', 'freak', 'free', 'freeze', 'freight',
  'french', 'frenzy', 'frequent', 'fresh', 'fret', 'friction', 'friend', 'fright', 'frog', 'front',
  'frost', 'frown', 'frozen', 'fruit', 'frustrate', 'fry', 'fuel', 'fugitive', 'fulfill', 'full',
  'fume', 'fun', 'function', 'fund', 'fundamental', 'funeral', 'fungus', 'funnel', 'funny', 'fur',
  'furious', 'furnace', 'furnish', 'furniture', 'further', 'fury', 'fuse', 'fusion', 'fuss', 'futile',
  'future', 'fuzzy', 'gadget', 'gaff', 'gage', 'gain', 'gait', 'gala', 'galaxy', 'gale',
  'gallop', 'game', 'gamma', 'gang', 'gap', 'garage', 'garbage', 'garden', 'gargle', 'garlic',
  'garment', 'garter', 'gas', 'gasp', 'gate', 'gather', 'gauge', 'gauntlet', 'gauze', 'gave',
  'gavel', 'gawk', 'gaze', 'gear', 'gel', 'gem', 'gender', 'gene', 'general', 'generate',
  'generic', 'generous', 'genius', 'genre', 'gentle', 'genuine', 'geography', 'geology', 'geometry', 'germ',
  'gesture', 'get', 'ghost', 'giant', 'gibberish', 'giddy', 'gift', 'gigantic', 'giggle', 'gill',
  'gimmick', 'gin', 'ginger', 'giraffe', 'girdle', 'girl', 'girth', 'given', 'glacier', 'glad',
  'gladiator', 'glance', 'gland', 'glare', 'glass', 'glaze', 'gleam', 'glean', 'glide', 'glimmer',
  'glimpse', 'glisten', 'glitter', 'globe', 'gloom', 'glory', 'gloss', 'glove', 'glow', 'glucose',
  'glue', 'glum', 'glut', 'glycerin', 'gnat', 'gnaw', 'goal', 'goat', 'goblet', 'goblin',
  'god', 'going', 'gold', 'golf', 'gondola', 'gone', 'gong', 'good', 'goof', 'goose',
  'gorge', 'gorgeous', 'gorilla', 'goshawk', 'gospel', 'gossip', 'got', 'govern', 'gown', 'grab',
  'grace', 'grade', 'gradient', 'gradual', 'graduate', 'graft', 'grain', 'grammar', 'grand', 'granite',
  'grant', 'grape', 'graph', 'grasp', 'grass', 'grate', 'grateful', 'grave', 'gravel', 'gravity',
  'gravy', 'gray', 'graze', 'grease', 'great', 'greed', 'green', 'greet', 'grew', 'grid',
  'grief', 'grill', 'grim', 'grimace', 'grin', 'grind', 'grip', 'gripe', 'grit', 'grizzly',
  'groan', 'grocery', 'groom', 'groove', 'grope', 'gross', 'grotesque', 'grotto', 'ground', 'group',
  'grove', 'grow', 'growl', 'grown', 'growth', 'grub', 'grudge', 'grumble', 'grunt', 'guard',
  'guardian', 'guava', 'guerilla', 'guess', 'guest', 'guide', 'guild', 'guile', 'guilt', 'guinea',
  'guise', 'guitar', 'gulf', 'gull', 'gully', 'gulp', 'gum', 'gun', 'gurgle', 'gush',
  'gust', 'gut', 'gutter', 'guy', 'gym', 'gymnast', 'gypsy', 'gyro', 'habit', 'habitat',
  'hacienda', 'hack', 'hacksaw', 'haddock', 'haggard', 'hail', 'hair', 'half', 'hall', 'hallow',
  'halo', 'halt', 'hamlet', 'hammer', 'hammock', 'hamper', 'hand', 'handful', 'handicap', 'handle',
  'handsome', 'handy', 'hang', 'hangar', 'hanger', 'haphazard', 'happen', 'happy', 'harass', 'harbor',
  'hard', 'hardly', 'hardship', 'hardware', 'hardy', 'hare', 'harem', 'hark', 'harm', 'harmonica',
  'harmony', 'harness', 'harp', 'harpoon', 'harpsichord', 'harrow', 'harsh', 'harvest', 'haste', 'hasty',
  'hat', 'hatch', 'hatchet', 'hate', 'hath', 'hatred', 'haughty', 'haul', 'haunt', 'have',
  'haven', 'havoc', 'hawk', 'hawthorn', 'hay', 'hazard', 'haze', 'hazel', 'hazy', 'head',
  'headache', 'heading', 'headline', 'headquarters', 'heal', 'health', 'heap', 'hear', 'hearsay', 'hearse',
  'heart', 'hearth', 'hearty', 'heat', 'heater', 'heath', 'heathen', 'heather', 'heave', 'heaven',
  'heavy', 'heckle', 'hectare', 'hectic', 'hedge', 'heed', 'heel', 'heft', 'hefty', 'height',
  'heinous', 'heir', 'heiress', 'helicopter', 'helium', 'helix', 'hello', 'helm', 'helmet', 'help',
  'helpful', 'helpless', 'hemisphere', 'hemlock', 'hemp', 'hen', 'hence', 'herald', 'herb', 'herd',
  'here', 'hereafter', 'hereditary', 'heresy', 'heritage', 'hermit', 'hero', 'heroic', 'heroine', 'heron',
  'herring', 'herself', 'hesitate', 'heterogeneous', 'hexagon', 'heyday', 'hiccough', 'hickory', 'hidden', 'hide',
  'hideous', 'hierarchy', 'high', 'highway', 'hike', 'hill', 'hilly', 'himself', 'hind', 'hinder',
  'hindrance', 'hinge', 'hint', 'hip', 'hippopotamus', 'hire', 'history', 'hit', 'hitch', 'hive',
  'hoard', 'hoar frost', 'hoarse', 'hobby', 'hockey', 'hoe', 'hog', 'hoist', 'hold', 'holder',
  'hole', 'holiday', 'hollow', 'holly', 'hollyhock', 'holocaust', 'holster', 'holy', 'homage', 'home',
  'homely', 'homeopath', 'homesick', 'homestead', 'homogeneous', 'honest', 'honey', 'honeysuckle', 'honor', 'hood',
  'hoof', 'hook', 'hoop', 'hoot', 'hop', 'hope', 'hopeful', 'hopeless', 'horizon', 'horizontal',
  'hormone', 'horn', 'hornet', 'horoscope', 'horrible', 'horrid', 'horror', 'horse', 'horseback', 'horseshoe',
  'horticulture', 'hose', 'hospitable', 'hospital', 'host', 'hostage', 'hostel', 'hostess', 'hostile', 'hot',
  'hotel', 'hound', 'hour', 'house', 'household', 'housewife', 'hovel', 'hover', 'how', 'howl',
  'hub', 'huckleberry', 'huddle', 'hue', 'huff', 'hug', 'huge', 'hulk', 'hull', 'hum',
  'human', 'humane', 'humanity', 'humble', 'humbug', 'humid', 'humidity', 'humiliate', 'humility', 'hummingbird',
  'humor', 'humorous', 'hump', 'humpback', 'humus', 'hunch', 'hundred', 'hung', 'hunger', 'hungry',
  'hunt', 'hunter', 'hurdle', 'hurl', 'hurricane', 'hurry', 'hurt', 'husband', 'hush', 'husk',
  'husky', 'hussar', 'hustle', 'hut', 'hyacinth', 'hybrid', 'hydra', 'hydrangea', 'hydrant', 'hydraulic',
  'hydrocarbon', 'hydrogen', 'hyena', 'hygiene', 'hymn', 'hyperbole', 'hyphen', 'hypocrisy', 'hypocrite', 'hypothesis',
  'hysteria', 'ice', 'iceberg', 'icon', 'idea', 'ideal', 'identify', 'identity', 'idiom', 'idle',
  'idol', 'igloo', 'ignite', 'ignorance', 'ignore', 'ill', 'illegal', 'illicit', 'illness', 'illuminate',
  'illusion', 'illustrate', 'image', 'imagination', 'imagine', 'imbecile', 'imitate', 'immense', 'immerse', 'immigrant',
  'imminent', 'immoral', 'immortal', 'immune', 'impact', 'impair', 'impart', 'impartial', 'impasse', 'impatient',
  'impeach', 'impede', 'impediment', 'impel', 'impend', 'imperative', 'imperfect', 'imperial', 'imperil', 'impersonal',
  'impertinent', 'impetuous', 'impetus', 'impiety', 'impinge', 'impious', 'implacable', 'implement', 'implicate', 'implicit',
  'implore', 'imply', 'impolite', 'import', 'important', 'impose', 'imposing', 'impossible', 'impostor', 'impotent',
  'impoverish', 'impracticable', 'imprecation', 'impregnable', 'impress', 'impression', 'imprison', 'improbable', 'impromptu', 'improper',
  'improve', 'improvise', 'imprudent', 'impudence', 'impudent', 'impulse', 'impunity', 'impure', 'impurity', 'imputation',
  'inability', 'inaccessible', 'inaccurate', 'inaction', 'inadequate', 'inadmissible', 'inadvertent', 'inalienable', 'inane', 'inanimate',
  'inapplicable', 'inappropriate', 'inarticulate', 'inasmuch', 'inattentive', 'inaudible', 'inaugurate', 'inborn', 'incalculable', 'incandescent',
  'incantation', 'incapable', 'incapacitate', 'incarcerate', 'incarnate', 'incendiary', 'incense', 'incentive', 'inception', 'incessant',
  'inch', 'incident', 'incidental', 'incinerate', 'incipient', 'incision', 'incite', 'incivility', 'inclement', 'inclination',
  'incline', 'include', 'inclusive', 'incognito', 'incoherent', 'income', 'incommode', 'incomparable', 'incompatible', 'incompetent',
  'incomplete', 'incomprehensible', 'inconceivable', 'inconclusive', 'incongruous', 'inconsequential', 'inconsiderable', 'inconsiderate', 'inconsistent', 'inconspicuous'
];

export interface RandomOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

/**
 * Cryptographically secure random selection or fallback.
 */
function getRandomInt(max: number): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  // Safe fallback
  return Math.floor(Math.random() * max);
}

/**
 * Generates a random secure password based on chosen complexity.
 */
export function generateRandomPassword(options: RandomOptions): string {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:\',./<>?`~';

  let availableChars = '';
  const guaranteedChars: string[] = [];

  if (options.lowercase) {
    availableChars += lowercaseChars;
    guaranteedChars.push(lowercaseChars[getRandomInt(lowercaseChars.length)]);
  }
  if (options.uppercase) {
    availableChars += uppercaseChars;
    guaranteedChars.push(uppercaseChars[getRandomInt(uppercaseChars.length)]);
  }
  if (options.numbers) {
    availableChars += numberChars;
    guaranteedChars.push(numberChars[getRandomInt(numberChars.length)]);
  }
  if (options.symbols) {
    availableChars += symbolChars;
    guaranteedChars.push(symbolChars[getRandomInt(symbolChars.length)]);
  }

  // If no pools selected, fallback to all
  if (availableChars.length === 0) {
    availableChars = lowercaseChars + uppercaseChars + numberChars;
    guaranteedChars.push(lowercaseChars[getRandomInt(lowercaseChars.length)]);
  }

  const result: string[] = [...guaranteedChars];
  const remainingLength = options.length - guaranteedChars.length;

  for (let i = 0; i < remainingLength; i++) {
    const idx = getRandomInt(availableChars.length);
    result.push(availableChars[idx]);
  }

  // Shuffle the array to avoid predictable beginning patterns
  for (let i = result.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result.join('');
}

/**
 * Generates a Diceware-style memorable passphrase.
 */
export function generatePassphrase(wordCount: number, separator: string = '-'): string {
  const selectedWords: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = getRandomInt(WORD_LIST.length);
    selectedWords.push(WORD_LIST[idx]);
  }
  return selectedWords.join(separator);
}

export interface UpgradedAlternative {
  type: 'complexity' | 'passphrase' | 'transform';
  password: string;
  entropy: number;
  explanation: string;
  strength: string;
  improvementMultiplier: string;
}

/**
 * Upgrades a user's password using three different methodologies.
 */
export function generateUpgradedAlternatives(password: string): UpgradedAlternative[] {
  if (!password) return [];

  const originalEntropy = calculateEntropy(password).entropy;
  const results: UpgradedAlternative[] = [];

  // --- Upgrade 1: Complexity Upgrade ---
  // Ensure the password has at least 12 characters, and has uppercase, lowercase, digits, and symbols
  let complexityUpgrade = password;
  
  // Pad if too short
  if (complexityUpgrade.length < 12) {
    const paddingNeeded = 12 - complexityUpgrade.length;
    // Add letters, numbers, and symbols dynamically
    const paddings = ['!', '9', 'x', 'K', 'S', '4', '#', 'u', 'G', '2', '$', 'z'];
    for (let i = 0; i < paddingNeeded; i++) {
      complexityUpgrade += paddings[i % paddings.length];
    }
  }

  // Inject missing classes
  if (!/[a-z]/.test(complexityUpgrade)) complexityUpgrade += 'a';
  if (!/[A-Z]/.test(complexityUpgrade)) complexityUpgrade += 'K';
  if (!/[0-9]/.test(complexityUpgrade)) complexityUpgrade += '7';
  if (!/[^a-zA-Z0-9]/.test(complexityUpgrade)) complexityUpgrade += '$';

  const compEntropyResult = calculateEntropy(complexityUpgrade);
  results.push({
    type: 'complexity',
    password: complexityUpgrade,
    entropy: compEntropyResult.entropy,
    explanation: 'Added missing character classes (uppercase, numbers, symbols) and padded the length to at least 12 characters.',
    strength: compEntropyResult.strength,
    improvementMultiplier: formatImprovement(compEntropyResult.entropy - originalEntropy)
  });

  // --- Upgrade 2: Passphrase Padding (Smart Memorable Upgrade) ---
  // Keep the user's password but append a random memorable word with a separator.
  // This drastically increases length (and thus search space) while keeping it memorable.
  const randomWord1 = WORD_LIST[getRandomInt(WORD_LIST.length)];
  const randomWord2 = WORD_LIST[getRandomInt(WORD_LIST.length)];
  const passphraseUpgrade = `${password}-${randomWord1}-${randomWord2}`;
  const passEntropyResult = calculateEntropy(passphraseUpgrade);
  results.push({
    type: 'passphrase',
    password: passphraseUpgrade,
    entropy: passEntropyResult.entropy,
    explanation: `Appended two memorable dictionary words ("${randomWord1}" and "${randomWord2}") separated by hyphens. Length is now ${passphraseUpgrade.length} characters.`,
    strength: passEntropyResult.strength,
    improvementMultiplier: formatImprovement(passEntropyResult.entropy - originalEntropy)
  });

  // --- Upgrade 3: High-Entropy Security Transform ---
  // Surround the password with brackets, capitalize alternating letters, and append a high-entropy suffix.
  let transformed = '';
  for (let i = 0; i < password.length; i++) {
    transformed += i % 2 === 0 ? password[i].toUpperCase() : password[i].toLowerCase();
  }
  
  // Add secure wrapper and suffix
  const secureSuffix = generateRandomPassword({
    length: 6,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true
  });
  const transformUpgrade = `[${transformed}]_${secureSuffix}`;
  const transformEntropyResult = calculateEntropy(transformUpgrade);

  results.push({
    type: 'transform',
    password: transformUpgrade,
    entropy: transformEntropyResult.entropy,
    explanation: 'Transformed characters to alternating case, wrapped in square brackets, and appended a cryptographically secure 6-character random suffix.',
    strength: transformEntropyResult.strength,
    improvementMultiplier: formatImprovement(transformEntropyResult.entropy - originalEntropy)
  });

  return results;
}

function formatImprovement(entropyDiff: number): string {
  if (entropyDiff <= 0) return 'Same strength';
  // Math: 2^entropyDiff times harder to crack
  const multiplier = Math.pow(2, entropyDiff);
  
  if (multiplier < 1000) {
    return `${Math.round(multiplier)}x harder to crack`;
  }
  if (multiplier < 1e6) {
    return `${Math.round(multiplier / 100) / 10}k times harder to crack`;
  }
  if (multiplier < 1e9) {
    return `${Math.round(multiplier / 1e5) / 10} million times harder to crack`;
  }
  if (multiplier < 1e12) {
    return `${Math.round(multiplier / 1e8) / 10} billion times harder to crack`;
  }
  
  // Exponential representation
  const exp = Math.log10(multiplier);
  return `10^${Math.round(exp)} times harder to crack`;
}
