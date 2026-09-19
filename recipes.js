// UTMCraft - Recipes Database & Gemini Flash-Lite Course Generator
// Focus: Discovering real UTM courses matching keywords and academic disciplines

export const GEMINI_API_KEY_DEFAULT = 'AQ.Ab8RN6KB3GbjGfZGrUkLzsaK9QUJybTNzl0bsrixNyq8NDAzAg';
export const GEMINI_MODEL = 'gemini-3.5-flash-lite';

export const CATEGORIES = {
    all: { label: 'All Elements', icon: '✨' },
    starter: { label: 'Core Disciplines', icon: '🌱' },
    year: { label: 'Year Levels', icon: '🎓' },
    math: { label: 'Math & Stats', icon: '📐' },
    cs: { label: 'Computer Science', icon: '💻' },
    art: { label: 'Art & Visual Studies', icon: '🎨' },
    science: { label: 'Sciences', icon: '🔬' },
    english: { label: 'English & Drama', icon: '📖' },
    writing: { label: 'Writing & Rhetoric', icon: '✍️' },
    presentation: { label: 'Comm & Media', icon: '🎤' },
    humanities: { label: 'Humanities & Phil', icon: '🏛️' },
    social: { label: 'Social & Commerce', icon: '💼' }
};

// Year Levels (1st Year to 4th Year Max)
export const YEAR_ELEMENTS = {
    year1: {
        id: 'year1',
        name: '1st Year',
        emoji: '1️⃣',
        category: 'year',
        yearLevel: 1,
        desc: 'Foundational freshman year at UTM. Merge with another 1st Year to advance to 2nd Year, or merge with courses to level them!'
    },
    year2: {
        id: 'year2',
        name: '2nd Year',
        emoji: '2️⃣',
        category: 'year',
        yearLevel: 2,
        desc: 'Sophomore year at UTM: advancing past POSt into core degree requirements.'
    },
    year3: {
        id: 'year3',
        name: '3rd Year',
        emoji: '3️⃣',
        category: 'year',
        yearLevel: 3,
        desc: 'Junior year at UTM: upper-level seminars, specialized electives, and advanced theory.'
    },
    year4: {
        id: 'year4',
        name: '4th Year',
        emoji: '4️⃣',
        category: 'year',
        yearLevel: 4,
        desc: 'Senior year at UTM: capstone projects, thesis research, and the maximum year level.'
    }
};

// Core Starting Default Elements: Disciplines including Computer Science & Art + 1st Year
export const BASE_ELEMENTS = [
    {
        id: 'math',
        name: 'Math',
        emoji: '📐',
        category: 'starter',
        desc: 'Pure numbers, equations, calculus, and quantitative problem-solving.'
    },
    {
        id: 'science',
        name: 'Science',
        emoji: '🔬',
        category: 'starter',
        desc: 'The physical and natural universe: chemistry, biology, physics, and empirical observation.'
    },
    {
        id: 'computerscience',
        name: 'Computer Science',
        emoji: '💻',
        category: 'starter',
        desc: 'Algorithms, data structures, software architecture, Python, and computation.'
    },
    {
        id: 'art',
        name: 'Art',
        emoji: '🎨',
        category: 'starter',
        desc: 'Visual studies, studio practice, art history, aesthetics, and creative media.'
    },
    {
        id: 'english',
        name: 'English',
        emoji: '📖',
        category: 'starter',
        desc: 'Literature, critical analysis of texts, narrative theory, and language.'
    },
    {
        id: 'logic',
        name: 'Logic',
        emoji: '🧠',
        category: 'starter',
        desc: 'Deductive reasoning, formal proof structures, symbolic operators, and truth analysis.'
    },
    {
        id: 'writing',
        name: 'Writing',
        emoji: '✍️',
        category: 'starter',
        desc: 'Academic clarity, essay construction, research citations, and persuasive prose.'
    },
    {
        id: 'presentation',
        name: 'Presentation',
        emoji: '🎤',
        category: 'starter',
        desc: 'Rhetoric, oral delivery, slide synthesis, public communication, and debate.'
    },
    YEAR_ELEMENTS.year1
];

// Curated element lookup
export const CURATED_ELEMENTS = {};
BASE_ELEMENTS.forEach(b => {
    CURATED_ELEMENTS[b.id] = b;
});
Object.values(YEAR_ELEMENTS).forEach(y => {
    CURATED_ELEMENTS[y.id] = y;
});

// Helper to normalize pair key
export function getPairKey(idA, idB) {
    return [idA, idB].sort().join('___');
}

export function isYearElement(elem) {
    if (!elem) return false;
    return elem.category === 'year' || /^year[1-4]$/.test(elem.id);
}

export function getYearLevel(elem) {
    if (!elem) return null;
    if (elem.yearLevel) return elem.yearLevel;
    const match = elem.id && elem.id.match(/^year([1-4])$/);
    if (match) return parseInt(match[1], 10);
    if (elem.name && elem.name.includes('1st Year')) return 1;
    if (elem.name && elem.name.includes('2nd Year')) return 2;
    if (elem.name && elem.name.includes('3rd Year')) return 3;
    if (elem.name && elem.name.includes('4th Year')) return 4;
    return null;
}

// Year + Year Progression
export function resolveYearProgression(yearElemA, yearElemB) {
    const lvlA = getYearLevel(yearElemA);
    const lvlB = getYearLevel(yearElemB);
    if (!lvlA || !lvlB) return null;

    // Both are 4th year or either is 4th year -> strictly capped at 4th Year max
    if (lvlA === 4 || lvlB === 4) {
        return {
            ...YEAR_ELEMENTS.year4,
            isMaxLevel: true
        };
    }

    let targetLevel = Math.max(lvlA, lvlB) + 1;
    if (targetLevel > 4) targetLevel = 4;

    const targetKey = `year${targetLevel}`;
    return YEAR_ELEMENTS[targetKey] || YEAR_ELEMENTS.year4;
}

// Concept Keywords that can be forged from merging default basic words
export const CONCEPT_KEYWORDS = [
    [['science', 'science'], {
        id: 'biology',
        name: 'Biology',
        emoji: '🧬',
        category: 'science',
        desc: 'The study of living organisms, cells, genetics, and ecology at UTM.'
    }],
    [['science', 'math'], {
        id: 'physics',
        name: 'Physics',
        emoji: '⚛️',
        category: 'science',
        desc: 'Empirical laws of motion, gravitation, optics, and spacetime.'
    }],
    [['science', 'writing'], {
        id: 'chemistry',
        name: 'Chemistry',
        emoji: '🧪',
        category: 'science',
        desc: 'Atomic composition, molecular transformations, synthesis, and kinetics.'
    }],
    [['science', 'logic'], {
        id: 'psychology',
        name: 'Psychology',
        emoji: '🧠',
        category: 'science',
        desc: 'Mind, perception, cognition, behavioral science, and neuroscience.'
    }],
    [['logic', 'presentation'], {
        id: 'philosophy',
        name: 'Philosophy',
        emoji: '🏛️',
        category: 'humanities',
        desc: 'Classical and analytic inquiry into ethics, reality, and truth.'
    }],
    [['math', 'writing'], {
        id: 'economics',
        name: 'Economics',
        emoji: '💰',
        category: 'social',
        desc: 'Market microeconomics, macro-policy, econometrics, and game theory.'
    }],
    [['presentation', 'writing'], {
        id: 'management',
        name: 'Management',
        emoji: '💼',
        category: 'social',
        desc: 'Commerce, financial strategy, and organizational leadership at UTM.'
    }],
    [['art', 'presentation'], {
        id: 'media',
        name: 'Digital Media',
        emoji: '🎬',
        category: 'presentation',
        desc: 'Visual culture, interactive cinema, communication technology, and platforms.'
    }],
    [['art', 'art'], {
        id: 'design',
        name: 'Visual Design',
        emoji: '🎨',
        category: 'art',
        desc: 'Graphic composition, typography, studio craft, and visual aesthetics.'
    }],
    [['computerscience', 'computerscience'], {
        id: 'algorithms',
        name: 'Algorithms',
        emoji: '⚡',
        category: 'cs',
        desc: 'Systematic methods for solving computational problems: sorting, searching, graphs, and complexity.'
    }],
    [['logic', 'computerscience'], {
        id: 'theory',
        name: 'Theory of Computation',
        emoji: '🔁',
        category: 'cs',
        desc: 'Formal languages, automata, Turing machines, decidability, and complexity theory.'
    }],
    [['science', 'computerscience'], {
        id: 'hardware',
        name: 'Hardware',
        emoji: '🖥️',
        category: 'cs',
        desc: 'Computer organization: digital logic, circuits, memory hierarchy, and microarchitecture.'
    }],
    [['math', 'computerscience'], {
        id: 'datastructures',
        name: 'Data Structures',
        emoji: '🌳',
        category: 'cs',
        desc: 'Abstract data types: stacks, queues, trees, heaps, graphs, and hash tables.'
    }],
    [['presentation', 'computerscience'], {
        id: 'networks',
        name: 'Networks',
        emoji: '🌐',
        category: 'cs',
        desc: 'Computer networking: protocols, TCP/IP, routing, and distributed communication systems.'
    }],
    [['hardware', 'logic'], {
        id: 'circuits',
        name: 'Logic Circuits',
        emoji: '🔌',
        category: 'cs',
        desc: 'Digital circuit design: Boolean algebra, combinational and sequential logic gates.'
    }],
    [['writing', 'computerscience'], {
        id: 'softwareengineering',
        name: 'Software Engineering',
        emoji: '🏗️',
        category: 'cs',
        desc: 'Software development methodologies, design patterns, testing, and team collaboration.'
    }]
];

// Fallback catalog of authentic UTM courses for offline or immediate cached hits
const FAST_OFFLINE_RECIPES = [
    // Computer Science Core Foundations (CSC108 & CSC148)
    [['computerscience', 'logic'], {
        code: 'CSC108H5',
        name: 'CSC108: Intro to Programming',
        emoji: '🐍',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Programming fundamentals in Python: procedural control flow, data models, functions, and unit testing.'
    }],
    [['computerscience', 'year1'], {
        code: 'CSC108H5',
        name: 'CSC108: Intro to Programming',
        emoji: '🐍',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'The foundational 1st-year computer science programming course at UTM.'
    }],
    [['computerscience', 'science'], {
        code: 'CSC108H5',
        name: 'CSC108: Intro to Programming',
        emoji: '🐍',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Introductory Python computation and empirical algorithm modeling.'
    }],
    [['computerscience', 'math'], {
        code: 'CSC148H5',
        name: 'CSC148: Introduction to Computer Science',
        emoji: '🌳',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Abstract data types, recursive structures, trees, object-oriented design, and POSt crucible in Python.'
    }],
    [['csc108h5', 'math'], {
        code: 'CSC148H5',
        name: 'CSC148: Introduction to Computer Science',
        emoji: '🌳',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Advancing from basic coding into recursion, trees, and object-oriented computer science.'
    }],
    [['csc108h5', 'logic'], {
        code: 'CSC148H5',
        name: 'CSC148: Introduction to Computer Science',
        emoji: '🌳',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Applying formal algorithmic logic to recursive trees and object-oriented data structures.'
    }],
    [['csc108h5', 'computerscience'], {
        code: 'CSC148H5',
        name: 'CSC148: Introduction to Computer Science',
        emoji: '🌳',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Leveling up programming mastery to UTM computer science POSt rigor.'
    }],
    [['csc108h5', 'csc148h5'], {
        code: 'CSC207H5',
        name: 'CSC207: Software Design',
        emoji: '💻',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Combining first-year CS fundamentals into team-based Java design patterns and Clean Architecture.'
    }],
    [['csc148h5', 'logic'], {
        code: 'CSC236H5',
        name: 'CSC236: Intro to Theory of Computation',
        emoji: '🧠',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Theoretical computer science: mathematical induction, correctness proofs, and regular languages.'
    }],
    [['csc148h5', 'mat102h5'], {
        code: 'CSC236H5',
        name: 'CSC236: Intro to Theory of Computation',
        emoji: '🧠',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'The legendary UTM combination of CSC148 + MAT102 powering CS POSt and computational theory.'
    }],
    [['computerscience', 'art'], {
        code: 'CCT111H5',
        name: 'CCT111: Critical Coding and Digital Art',
        emoji: '🎨',
        category: 'cs',
        department: 'Institute of Communication, Culture, Information & Technology',
        desc: 'Interactive creative computation, generative art, and creative coding for digital media.'
    }],

    // Art & Visual Studies Foundations
    [['art', 'writing'], {
        code: 'FAH101H5',
        name: 'FAH101: Introduction to Art History',
        emoji: '🏛️',
        category: 'art',
        department: 'Visual Studies',
        desc: 'Critical visual analysis of monuments, paintings, sculptures, and historical culture.'
    }],
    [['art', 'year1'], {
        code: 'FAH101H5',
        name: 'FAH101: Introduction to Art History',
        emoji: '🏛️',
        category: 'art',
        department: 'Visual Studies',
        desc: 'Foundational first-year UTM introduction to the history and theory of art.'
    }],
    [['art', 'presentation'], {
        code: 'FAS143H5',
        name: 'FAS143: Foundations in Studio Practice',
        emoji: '🖌️',
        category: 'art',
        department: 'Visual Studies',
        desc: 'Studio art foundations: observational drawing, spatial composition, and critical critique.'
    }],
    [['art', 'science'], {
        code: 'VCC101H5',
        name: 'VCC101: Introduction to Visual Culture',
        emoji: '👁️',
        category: 'art',
        department: 'Visual Studies',
        desc: 'The social and scientific construction of sight, photography, and digital image culture.'
    }],
    [['art', 'english'], {
        code: 'CIN101H5',
        name: 'CIN101: An Introduction to Cinema Studies',
        emoji: '📽️',
        category: 'art',
        department: 'Visual Studies',
        desc: 'Form and narrative in film: cinematography, montage editing, sound design, and mise-en-scène.'
    }],
    [['art', 'logic'], {
        code: 'FAH289H5',
        name: 'FAH289: Art and the Environment',
        emoji: '🌿',
        category: 'art',
        department: 'Visual Studies',
        desc: 'Critical aesthetic philosophies regarding ecological transformation and built landscapes.'
    }],

    // Hard-to-reach CS courses via new keywords
    [['algorithms', 'math'], {
        code: 'CSC263H5',
        name: 'CSC263: Data Structures and Analysis',
        emoji: '📊',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Priority queues, amortized analysis, union-find, and hashing with formal complexity bounds.'
    }],
    [['algorithms', 'logic'], {
        code: 'CSC236H5',
        name: 'CSC236: Intro to Theory of Computation',
        emoji: '🧠',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Mathematical induction, correctness proofs, regular languages, and the pumping lemma.'
    }],
    [['theory', 'algorithms'], {
        code: 'CSC236H5',
        name: 'CSC236: Intro to Theory of Computation',
        emoji: '🧠',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Combining formal theory with algorithmic reasoning for UTM\'s CS POSt gateway.'
    }],
    [['hardware', 'computerscience'], {
        code: 'CSC258H5',
        name: 'CSC258: Computer Organization',
        emoji: '🖥️',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Digital logic, binary arithmetic, ALUs, datapaths, and MIPS assembly architecture.'
    }],
    [['circuits', 'computerscience'], {
        code: 'CSC258H5',
        name: 'CSC258: Computer Organization',
        emoji: '🖥️',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'From logic gates to full computer datapaths — the classic UTM hardware course.'
    }],
    [['hardware', 'math'], {
        code: 'CSC258H5',
        name: 'CSC258: Computer Organization',
        emoji: '🖥️',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Mathematical foundations of digital hardware design and binary computation.'
    }],
    [['datastructures', 'algorithms'], {
        code: 'CSC263H5',
        name: 'CSC263: Data Structures and Analysis',
        emoji: '📊',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Rigorous analysis of classical data structures and algorithm complexity classes.'
    }],
    [['networks', 'computerscience'], {
        code: 'CSC358H5',
        name: 'CSC358: Principles of Computer Networks',
        emoji: '🌐',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'OSI model, TCP/IP protocols, routing algorithms, and network security fundamentals.'
    }],
    [['softwareengineering', 'computerscience'], {
        code: 'CSC301H5',
        name: 'CSC301: Introduction to Software Engineering',
        emoji: '🏗️',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Agile development, requirements engineering, testing, and software project management.'
    }],
    [['algorithms', 'datastructures'], {
        code: 'CSC373H5',
        name: 'CSC373: Algorithm Design and Analysis',
        emoji: '⚡',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Greedy, divide-and-conquer, dynamic programming, and NP-completeness reductions.'
    }],
    [['networks', 'science'], {
        code: 'CSC358H5',
        name: 'CSC358: Principles of Computer Networks',
        emoji: '🌐',
        category: 'cs',
        department: 'Mathematical and Computational Sciences',
        desc: 'Network protocols and empirical data communications science.'
    }],
    // Math & Proofs
    [['math', 'logic'], {
        code: 'MAT102H5',
        name: 'MAT102: Mathematical Proofs',
        emoji: '🧩',
        category: 'math',
        department: 'Mathematical and Computational Sciences',
        desc: 'The legendary UTM crucible where Math meets strict formal Logic to build rigorous proofs.'
    }],
    [['math', 'science'], {
        code: 'MAT135H5',
        name: 'MAT135: Differential Calculus',
        emoji: '📈',
        category: 'math',
        department: 'Mathematical and Computational Sciences',
        desc: 'Calculus modeled for science applications, rates of change, and derivatives.'
    }],
    [['english', 'writing'], {
        code: 'ENG100H5',
        name: 'ENG100: Effective Writing',
        emoji: '✍️',
        category: 'writing',
        department: 'English and Drama',
        desc: 'Foundational university writing, textual rhetoric, argument construction, and style.'
    }],
    [['writing', 'presentation'], {
        code: 'ISP100H5',
        name: 'ISP100: Writing for University',
        emoji: '📝',
        category: 'writing',
        department: 'Institute for the Study of University Pedagogy',
        desc: 'Writing and presentation rhetoric essential for university scholarly discourse.'
    }],
    [['presentation', 'logic'], {
        code: 'PHL245H5',
        name: 'PHL245H5: Critical Reasoning',
        emoji: '⚖️',
        category: 'humanities',
        department: 'Philosophy',
        desc: 'Evaluating arguments, detecting rhetorical fallacies, and structuring persuasive discourse.'
    }],
    [['english', 'presentation'], {
        code: 'DRE121H5',
        name: 'DRE121: Traditions of Theatre',
        emoji: '🎭',
        category: 'english',
        department: 'English and Drama',
        desc: 'Exploring theatrical performance, dramatic presence, and spoken word narrative.'
    }],
    [['logic', 'writing'], {
        code: 'PHL245H5',
        name: 'PHL245: Modern Symbolic Logic',
        emoji: '🧠',
        category: 'humanities',
        department: 'Philosophy',
        desc: 'Truth-tables, quantification theory, natural deduction, and formal syntax.'
    }],
    [['math', 'presentation'], {
        code: 'STA107H5',
        name: 'STA107: Data Representation & Modelling',
        emoji: '📊',
        category: 'math',
        department: 'Mathematical and Computational Sciences',
        desc: 'Presenting and interpreting statistical distributions and empirical models.'
    }]
];

export const STATIC_RECIPES_MAP = new Map();

// Register concept keyword recipes
CONCEPT_KEYWORDS.forEach(([pair, concept]) => {
    CURATED_ELEMENTS[concept.id] = concept;
    STATIC_RECIPES_MAP.set(getPairKey(pair[0], pair[1]), concept);
});

// Register standard offline course recipes
FAST_OFFLINE_RECIPES.forEach(([pair, course]) => {
    const id = course.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    CURATED_ELEMENTS[id] = { id, ...course };
    STATIC_RECIPES_MAP.set(getPairKey(pair[0], pair[1]), CURATED_ELEMENTS[id]);
});

// Register new concept keywords into CURATED_ELEMENTS
const NEW_CONCEPT_IDS = ['algorithms', 'theory', 'hardware', 'datastructures', 'networks', 'circuits', 'softwareengineering'];

// Register Year + Year progression recipes into STATIC_RECIPES_MAP
STATIC_RECIPES_MAP.set(getPairKey('year1', 'year1'), YEAR_ELEMENTS.year2);
STATIC_RECIPES_MAP.set(getPairKey('year2', 'year1'), YEAR_ELEMENTS.year3);
STATIC_RECIPES_MAP.set(getPairKey('year2', 'year2'), YEAR_ELEMENTS.year3);
STATIC_RECIPES_MAP.set(getPairKey('year3', 'year1'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year3', 'year2'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year3', 'year3'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year4', 'year1'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year4', 'year2'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year4', 'year3'), YEAR_ELEMENTS.year4);
STATIC_RECIPES_MAP.set(getPairKey('year4', 'year4'), YEAR_ELEMENTS.year4);

// Comprehensive catalog of authentic UTM courses across year levels 1 to 4
export const UTM_YEAR_COURSES = {
    // Mathematics
    'mat102': {
        2: { code: 'MAT202H5', name: 'MAT202: Introduction to Discrete Mathematics', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'The natural 2nd-year successor to MAT102, expanding proofs into discrete structures, relations, and combinatorics.' },
        3: { code: 'MAT301H5', name: 'MAT301: Groups and Symmetry', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Abstract algebra, homomorphisms, and group theory building on proof mastery.' },
        4: { code: 'MAT401H5', name: 'MAT401: Polynomial Equations and Fields', emoji: '🔬', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Advanced field theory, Galois extensions, and solvability by radicals.' }
    },
    'mat102h5': {
        2: { code: 'MAT202H5', name: 'MAT202: Introduction to Discrete Mathematics', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'The natural 2nd-year successor to MAT102, expanding proofs into discrete structures, relations, and combinatorics.' },
        3: { code: 'MAT301H5', name: 'MAT301: Groups and Symmetry', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Abstract algebra, homomorphisms, and group theory building on proof mastery.' },
        4: { code: 'MAT401H5', name: 'MAT401: Polynomial Equations and Fields', emoji: '🔬', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Advanced field theory, Galois extensions, and solvability by radicals.' }
    },
    'mat135': {
        2: { code: 'MAT232H5', name: 'MAT232: Calculus of Several Variables', emoji: '📈', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Extending calculus into multivariable planes, partial derivatives, and multiple integrals.' },
        3: { code: 'MAT311H5', name: 'MAT311: Partial Differential Equations', emoji: '📊', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Fourier analysis, wave equations, and boundary value problems.' },
        4: { code: 'MAT405H5', name: 'MAT405: Real Analysis II', emoji: '📜', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Measure theory, Lebesgue integration, and functional analysis.' }
    },
    'mat202': {
        1: { code: 'MAT102H5', name: 'MAT102: Mathematical Proofs', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'The foundational 1st-year UTM proof crucible.' },
        3: { code: 'MAT302H5', name: 'MAT302: Introduction to Number Theory', emoji: '🔢', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Divisibility, modular arithmetic, prime distributions, and RSA cryptography.' },
        4: { code: 'MAT402H5', name: 'MAT402: Classical Geometries', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Projective, affine, hyperbolic, and non-Euclidean geometries.' }
    },
    'mat202h5': {
        1: { code: 'MAT102H5', name: 'MAT102: Mathematical Proofs', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'The foundational 1st-year UTM proof crucible.' },
        3: { code: 'MAT302H5', name: 'MAT302: Introduction to Number Theory', emoji: '🔢', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Divisibility, modular arithmetic, prime distributions, and RSA cryptography.' },
        4: { code: 'MAT402H5', name: 'MAT402: Classical Geometries', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Projective, affine, hyperbolic, and non-Euclidean geometries.' }
    },

    // Astronomy
    'ast101': {
        2: { code: 'AST201H5', name: 'AST201H5: Exploration of the Solar System', emoji: '🪐', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Planetary astronomy examining the origin, composition, atmospheres, and exploration of solar worlds.' },
        3: { code: 'AST320H5', name: 'AST320H5: Observational Astronomy', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Telescopic observation, astronomical CCD imaging, and stellar spectral classification.' },
        4: { code: 'CPS489Y5', name: 'CPS489Y5: Research in Astronomical & Physical Sciences', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Senior UTM research capstone covering high-energy astrophysics and cosmic expansion.' }
    },
    'ast101h5': {
        2: { code: 'AST201H5', name: 'AST201H5: Exploration of the Solar System', emoji: '🪐', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Planetary astronomy examining the origin, composition, atmospheres, and exploration of solar worlds.' },
        3: { code: 'AST320H5', name: 'AST320H5: Observational Astronomy', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Telescopic observation, astronomical CCD imaging, and stellar spectral classification.' },
        4: { code: 'CPS489Y5', name: 'CPS489Y5: Research in Astronomical & Physical Sciences', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Senior UTM research capstone covering high-energy astrophysics and cosmic expansion.' }
    },
    'ast201h5': {
        1: { code: 'AST101H5', name: 'AST101: Exploring the Universe', emoji: '✨', category: 'science', department: 'Chemical and Physical Sciences', desc: 'The 1st-year introduction to galaxies, stars, and cosmological wonders.' },
        3: { code: 'AST320H5', name: 'AST320H5: Observational Astronomy', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Telescopic observation, astronomical CCD imaging, and stellar spectral classification.' },
        4: { code: 'CPS489Y5', name: 'CPS489Y5: Research in Astronomical & Physical Sciences', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Senior UTM research capstone covering high-energy astrophysics and cosmic expansion.' }
    },

    // Computer Science
    'csc108': {
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '💻', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Object-oriented architecture, design patterns, clean code principles, and team programming.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Kernel processes, concurrency, virtual memory management, and file systems.' },
        4: { code: 'CSC409H5', name: 'CSC409: Software Systems Integration', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Large-scale distributed systems, microservices, and enterprise cloud integration.' }
    },
    'csc108h5': {
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '💻', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Object-oriented architecture, design patterns, clean code principles, and team programming.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Kernel processes, concurrency, virtual memory management, and file systems.' },
        4: { code: 'CSC409H5', name: 'CSC409: Software Systems Integration', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Large-scale distributed systems, microservices, and enterprise cloud integration.' }
    },
    'csc148': {
        2: { code: 'CSC236H5', name: 'CSC236: Intro to Theory of Computation', emoji: '🧠', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Structural induction, algorithm correctness proofs, and regular languages.' },
        3: { code: 'CSC373H5', name: 'CSC373: Algorithm Design and Analysis', emoji: '⚡', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Dynamic programming, greedy algorithms, network flow, and complexity classes.' },
        4: { code: 'CSC413H5', name: 'CSC413H5: Machine Learning & Data Mining', emoji: '🤖', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Neural architectures, statistical inference, regression, and optimization algorithms.' }
    },
    'csc148h5': {
        2: { code: 'CSC236H5', name: 'CSC236: Intro to Theory of Computation', emoji: '🧠', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Structural induction, algorithm correctness proofs, and regular languages.' },
        3: { code: 'CSC373H5', name: 'CSC373: Algorithm Design and Analysis', emoji: '⚡', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Dynamic programming, greedy algorithms, network flow, and complexity classes.' },
        4: { code: 'CSC413H5', name: 'CSC413H5: Machine Learning & Data Mining', emoji: '🤖', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Neural architectures, statistical inference, regression, and optimization algorithms.' }
    },

    // Computer Science Base & Aliases
    'computerscience': {
        1: { code: 'CSC108H5', name: 'CSC108: Intro to Programming', emoji: '🐍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Foundational programming in Python.' },
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '💻', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Software design patterns and clean Java architecture.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Processes, memory systems, and UNIX internals.' },
        4: { code: 'CSC409H5', name: 'CSC409: Software Systems Integration', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Distributed cloud architecture and scalable systems.' }
    },
    'cs': {
        1: { code: 'CSC108H5', name: 'CSC108: Intro to Programming', emoji: '🐍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Foundational programming in Python.' },
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '💻', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Software design patterns and clean Java architecture.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Processes, memory systems, and UNIX internals.' },
        4: { code: 'CSC409H5', name: 'CSC409: Software Systems Integration', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Distributed cloud architecture and scalable systems.' }
    },

    // Art & Visual Studies
    'art': {
        1: { code: 'FAH101H5', name: 'FAH101: Introduction to Art History', emoji: '🏛️', category: 'art', department: 'Visual Studies', desc: 'Critical visual analysis of monuments, paintings, and historical culture.' },
        2: { code: 'FAS247H5', name: 'FAS247: Studio Painting I', emoji: '🖌️', category: 'art', department: 'Visual Studies', desc: 'Studio painting practice: color theory, surface dynamics, and visual expression.' },
        3: { code: 'FAH310H5', name: 'FAH310: Curatorial Practice & Museum Studies', emoji: '🖼️', category: 'art', department: 'Visual Studies', desc: 'Exhibition curation, archiving, and museum politics.' },
        4: { code: 'FAS450Y5', name: 'FAS450Y5: Senior Studio Project Capstone', emoji: '🌟', category: 'art', department: 'Visual Studies', desc: 'Senior graduating studio exhibition and artist portfolio.' }
    },
    'fah101': {
        2: { code: 'FAH289H5', name: 'FAH289: Art and the Environment', emoji: '🌿', category: 'art', department: 'Visual Studies', desc: 'Ecological aesthetics and site-specific landscape installations.' },
        3: { code: 'FAH310H5', name: 'FAH310: Curatorial Practice & Museum Studies', emoji: '🖼️', category: 'art', department: 'Visual Studies', desc: 'Exhibition curation, archiving, and museum politics.' },
        4: { code: 'FAH480H5', name: 'FAH480H5: Advanced Studies in Art History', emoji: '📜', category: 'art', department: 'Visual Studies', desc: 'Senior seminar in archival art historical methodologies.' }
    },
    'fah101h5': {
        2: { code: 'FAH289H5', name: 'FAH289: Art and the Environment', emoji: '🌿', category: 'art', department: 'Visual Studies', desc: 'Ecological aesthetics and site-specific landscape installations.' },
        3: { code: 'FAH310H5', name: 'FAH310: Curatorial Practice & Museum Studies', emoji: '🖼️', category: 'art', department: 'Visual Studies', desc: 'Exhibition curation, archiving, and museum politics.' },
        4: { code: 'FAH480H5', name: 'FAH480H5: Advanced Studies in Art History', emoji: '📜', category: 'art', department: 'Visual Studies', desc: 'Senior seminar in archival art historical methodologies.' }
    },

    // Concept Keywords Year Levels
    'biology': {
        1: { code: 'BIO152H5', name: 'BIO152: Introduction to Evolution', emoji: '🧬', category: 'science', department: 'Biology', desc: 'Evolutionary mechanisms and biological diversity.' },
        2: { code: 'BIO202H5', name: 'BIO202: Introductory Molecular Biology', emoji: '🔬', category: 'science', department: 'Biology', desc: 'DNA replication, transcription, and translation.' },
        3: { code: 'BIO310H5', name: 'BIO310: Physiology of Microorganisms', emoji: '🧫', category: 'science', department: 'Biology', desc: 'Microbial energetics and metabolic paths.' },
        4: { code: 'BIO400Y5', name: 'BIO400Y5: Capstone in Molecular Biology', emoji: '🧪', category: 'science', department: 'Biology', desc: 'Senior laboratory investigation.' }
    },
    'physics': {
        1: { code: 'PHY136H5', name: 'PHY136: Intro to Physics I', emoji: '⚡', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Mechanics, kinematics, and Newtonian dynamics.' },
        2: { code: 'PHY241H5', name: 'PHY241: Classical Mechanics', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Lagrangian mechanics and central force motions.' },
        3: { code: 'PHY325H5', name: 'PHY325H5: Quantum Mechanics', emoji: '⚛️', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Wave functions, operators, and Schrödinger equation.' },
        4: { code: 'PHY426H5', name: 'PHY426H5: Physics Capstone Thesis', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Senior physics laboratory research project.' }
    },
    'chemistry': {
        1: { code: 'CHM110H5', name: 'CHM110: Chemical Principles I', emoji: '🧪', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Chemical kinetics, equilibria, and stoichiometry.' },
        2: { code: 'CHM242H5', name: 'CHM242: Organic Chemistry I', emoji: '⚗️', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Reaction mechanisms, synthesis, and functional groups.' },
        3: { code: 'CHM341H5', name: 'CHM341: Advanced Organic Chemistry', emoji: '🔬', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Stereochemistry and catalytic reactions.' },
        4: { code: 'CHM489Y5', name: 'CHM489Y5: Chemistry Research Project', emoji: '🧪', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Independent fourth-year chemistry thesis.' }
    },
    'psychology': {
        1: { code: 'PSY100Y5', name: 'PSY100Y5: Intro to Psychology', emoji: '🧠', category: 'science', department: 'Psychology', desc: 'Perception, cognition, and behavioral sciences.' },
        2: { code: 'PSY201H5', name: 'PSY201: Research Design & Analysis', emoji: '📊', category: 'science', department: 'Psychology', desc: 'Psychological statistics and experimental testing.' },
        3: { code: 'PSY310H5', name: 'PSY310: Cognitive Neuroscience', emoji: '🔬', category: 'science', department: 'Psychology', desc: 'Brain structures, memory networks, and neuro-imaging.' },
        4: { code: 'PSY400Y5', name: 'PSY400Y5: Senior Thesis in Psychology', emoji: '🧬', category: 'science', department: 'Psychology', desc: 'Independent empirical psychological thesis.' }
    },
    'philosophy': {
        1: { code: 'PHL103H5', name: 'PHL103: Intro to Philosophy', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Classical epistemology and ethics.' },
        2: { code: 'PHL245H5', name: 'PHL245: Modern Symbolic Logic', emoji: '🧠', category: 'humanities', department: 'Philosophy', desc: 'Propositional and symbolic logic.' },
        3: { code: 'PHL345H5', name: 'PHL345: Advanced Symbolic Logic', emoji: '⚖️', category: 'humanities', department: 'Philosophy', desc: 'Metatheoretic soundness and completeness.' },
        4: { code: 'PHL400H5', name: 'PHL400H5: Advanced Seminar in Philosophy', emoji: '📜', category: 'humanities', department: 'Philosophy', desc: 'Senior philosophical investigation.' }
    },
    'economics': {
        1: { code: 'ECO101H5', name: 'ECO101H5: Intro to Economics', emoji: '💰', category: 'social', department: 'Economics', desc: 'Supply, demand, macro-stability, and market mechanisms.' },
        2: { code: 'ECO200Y5', name: 'ECO200Y5: Microeconomic Theory', emoji: '📊', category: 'social', department: 'Economics', desc: 'Consumer utility, firm production, and competitive equilibrium.' },
        3: { code: 'ECO310H5', name: 'ECO310H5: International Trade', emoji: '🌐', category: 'social', department: 'Economics', desc: 'Global commerce, exchange rates, and tariffs.' },
        4: { code: 'ECO400Y5', name: 'ECO400Y5: Advanced Microeconomics', emoji: '📈', category: 'social', department: 'Economics', desc: 'Game theory, mechanism design, and information economics.' }
    },
    'management': {
        1: { code: 'MGM101H5', name: 'MGM101: Principles of Management', emoji: '💼', category: 'social', department: 'Management', desc: 'Core fundamentals of organizational management.' },
        2: { code: 'MGT220H5', name: 'MGT220: Financial Accounting', emoji: '📊', category: 'social', department: 'Management', desc: 'Financial balance sheets, cash flows, and valuation.' },
        3: { code: 'MGT330H5', name: 'MGT330: Corporate Finance', emoji: '📈', category: 'social', department: 'Management', desc: 'Capital budgeting, corporate valuation, and investment analysis.' },
        4: { code: 'MGT420H5', name: 'MGT420H5: Strategic Management Capstone', emoji: '🏆', category: 'social', department: 'Management', desc: 'Senior capstone in corporate strategy and competitive advantage.' }
    },
    'media': {
        1: { code: 'CCT110H5', name: 'CCT110: Rhetoric and Media', emoji: '🎤', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Public speech and digital media rhetoric.' },
        2: { code: 'CCT200H5', name: 'CCT200: Communication, Information & Culture', emoji: '📡', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Socio-cultural dynamics of communications.' },
        3: { code: 'CCT300H5', name: 'CCT300: Critical Media Theory', emoji: '🎥', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Critical digital studies and algorithms.' },
        4: { code: 'CCT410H5', name: 'CCT410: Senior Capstone in Media & Tech', emoji: '🌟', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Graduating showcase project.' }
    },
    'design': {
        1: { code: 'FAS143H5', name: 'FAS143: Foundations in Studio Practice', emoji: '🖌️', category: 'art', department: 'Visual Studies', desc: 'Foundations of drawing, visual composition, and studio critique.' },
        2: { code: 'CCT211H5', name: 'CCT211: Interactive Media Design', emoji: '🎨', category: 'art', department: 'Institute of Communication, Culture, Information & Technology', desc: 'UI/UX design, visual hierarchy, and prototyping.' },
        3: { code: 'FAH310H5', name: 'FAH310: Curatorial Practice & Museum Studies', emoji: '🖼️', category: 'art', department: 'Visual Studies', desc: 'Exhibition curation and museum installation design.' },
        4: { code: 'FAS450Y5', name: 'FAS450Y5: Senior Studio Project Capstone', emoji: '🌟', category: 'art', department: 'Visual Studies', desc: 'Graduating capstone showcase and exhibition.' }
    },

    // Statistics
    'sta107': {
        2: { code: 'STA256H5', name: 'STA256: Probability and Statistics I', emoji: '📊', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Formal probability, discrete/continuous random variables, and central limit theorems.' },
        3: { code: 'STA302H5', name: 'STA302: Methods of Data Analysis', emoji: '📉', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Linear regression modeling, diagnostic testing, and empirical analysis in R.' },
        4: { code: 'STA457H5', name: 'STA457: Time Series Analysis', emoji: '📈', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Stochastic models, ARIMA forecasting, and spectral density estimation.' }
    },

    // English & Writing
    'eng100': {
        2: { code: 'ENG202H5', name: 'ENG202: British Literature Survey', emoji: '📖', category: 'english', department: 'English and Drama', desc: 'Chronological exploration of canonical British texts from medieval to Victorian.' },
        3: { code: 'ENG308Y5', name: 'ENG308Y5: Shakespeare', emoji: '🎭', category: 'english', department: 'English and Drama', desc: 'In-depth textual criticism and staging considerations of major Shakespearean plays.' },
        4: { code: 'ENG400H5', name: 'ENG400H5: Advanced Studies in English', emoji: '📜', category: 'english', department: 'English and Drama', desc: 'Senior undergraduate seminar in advanced literary critique and research.' }
    },
    'isp100': {
        2: { code: 'WRI273H5', name: 'WRI273H5: Expressive Writing', emoji: '✍️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Developing rhetorical craft, creative non-fiction essays, and reflective prose.' },
        3: { code: 'WRI360H5', name: 'WRI360: Technical Writing', emoji: '📋', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Communicating complex scientific, technical, and engineering data clearly.' },
        4: { code: 'WRI410H5', name: 'WRI410: Senior Seminar in Writing', emoji: '🖋️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Senior portfolio development and manuscript editing for professional publication.' }
    },

    // Sciences
    'sci100': {
        2: { code: 'BIO202H5', name: 'BIO202: Introductory Molecular Biology', emoji: '🧬', category: 'science', department: 'Biology', desc: 'Replication, gene transcription, RNA regulation, and protein translation.' },
        3: { code: 'BIO310H5', name: 'BIO310: Physiology of Microorganisms', emoji: '🧫', category: 'science', department: 'Biology', desc: 'Microbial bioenergetics, cellular transport, and metabolic control.' },
        4: { code: 'BIO400Y5', name: 'BIO400Y5: Capstone in Molecular Biology', emoji: '🔬', category: 'science', department: 'Biology', desc: 'Senior experimental laboratory project in contemporary molecular biology.' }
    },
    'bio152': {
        2: { code: 'BIO206H5', name: 'BIO206: Introductory Cell Biology', emoji: '🔬', category: 'science', department: 'Biology', desc: 'Eukaryotic organelle dynamics, membrane trafficking, and signal transduction.' },
        3: { code: 'BIO360H5', name: 'BIO360: Biometrics', emoji: '📊', category: 'science', department: 'Biology', desc: 'Experimental statistical design, sampling protocols, and biological hypothesis testing.' },
        4: { code: 'BIO481Y5', name: 'BIO481Y5: Biology Research Thesis', emoji: '🧬', category: 'science', department: 'Biology', desc: 'Year-long faculty-supervised empirical research thesis in UTM biology labs.' }
    },

    // Philosophy & Logic
    'phl245h5': {
        1: { code: 'PHL103H5', name: 'PHL103: Intro to Philosophy', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Core philosophical questions in epistemology, ethics, and political thought.' },
        2: { code: 'PHL245H5', name: 'PHL245: Modern Symbolic Logic', emoji: '🧠', category: 'humanities', department: 'Philosophy', desc: 'Natural deduction, quantifier logic, truth trees, and formal semantics.' },
        3: { code: 'PHL345H5', name: 'PHL345: Advanced Symbolic Logic', emoji: '⚖️', category: 'humanities', department: 'Philosophy', desc: 'Metatheory, soundness, completeness proofs, and formal model theory.' },
        4: { code: 'PHL400H5', name: 'PHL400H5: Advanced Seminar in Philosophy', emoji: '📜', category: 'humanities', department: 'Philosophy', desc: 'Intensive research seminar in contemporary analytic and continental thought.' }
    },
    'phl245': {
        1: { code: 'PHL103H5', name: 'PHL103: Intro to Philosophy', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Core philosophical questions in epistemology, ethics, and political thought.' },
        3: { code: 'PHL345H5', name: 'PHL345: Advanced Symbolic Logic', emoji: '⚖️', category: 'humanities', department: 'Philosophy', desc: 'Metatheory, soundness, completeness proofs, and formal model theory.' },
        4: { code: 'PHL400H5', name: 'PHL400H5: Advanced Seminar in Philosophy', emoji: '📜', category: 'humanities', department: 'Philosophy', desc: 'Intensive research seminar in contemporary analytic and continental thought.' }
    },

    // Base Starter Disciplines + Year Levels
    'math': {
        1: { code: 'MAT102H5', name: 'MAT102: Mathematical Proofs', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Foundational UTM proof crucible.' },
        2: { code: 'MAT202H5', name: 'MAT202: Introduction to Discrete Mathematics', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Discrete structures, relations, and combinatorics.' },
        3: { code: 'MAT301H5', name: 'MAT301: Groups and Symmetry', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Abstract algebra, groups, and permutations.' },
        4: { code: 'MAT401H5', name: 'MAT401: Polynomial Equations and Fields', emoji: '🔬', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Advanced field theory and Galois structures.' }
    },
    'science': {
        1: { code: 'AST101H5', name: 'AST101: Exploring the Universe', emoji: '✨', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Cosmic inquiry and empirical observation of celestial bodies.' },
        2: { code: 'AST201H5', name: 'AST201H5: Exploration of the Solar System', emoji: '🪐', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Planetary structures, atmospheres, and space exploration.' },
        3: { code: 'CHM361H5', name: 'CHM361: Biochemistry I', emoji: '🧪', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Protein structures, enzyme kinetics, and metabolic pathways.' },
        4: { code: 'BIO400Y5', name: 'BIO400Y5: Capstone in Molecular Biology', emoji: '🧫', category: 'science', department: 'Biology', desc: 'Advanced laboratory research and bio-analysis.' }
    },
    'english': {
        1: { code: 'ENG100H5', name: 'ENG100: Effective Writing', emoji: '📖', category: 'english', department: 'English and Drama', desc: 'University textual rhetoric and essay analysis.' },
        2: { code: 'ENG202H5', name: 'ENG202: British Literature Survey', emoji: '📚', category: 'english', department: 'English and Drama', desc: 'Survey of canonical British literature across eras.' },
        3: { code: 'ENG308Y5', name: 'ENG308Y5: Shakespeare', emoji: '🎭', category: 'english', department: 'English and Drama', desc: 'Advanced textual criticism of Shakespeare.' },
        4: { code: 'ENG400H5', name: 'ENG400H5: Advanced Studies in English', emoji: '📜', category: 'english', department: 'English and Drama', desc: 'Senior literary critique seminar.' }
    },
    'logic': {
        1: { code: 'PHL103H5', name: 'PHL103H5: Introduction to Philosophy', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Classical epistemology, metaphysics, and philosophical inquiry.' },
        2: { code: 'PHL245H5', name: 'PHL245: Modern Symbolic Logic', emoji: '⚖️', category: 'humanities', department: 'Philosophy', desc: 'Propositional and predicate logic calculus.' },
        3: { code: 'PHL345H5', name: 'PHL345: Advanced Symbolic Logic', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Soundness, completeness, and logical metatheory.' },
        4: { code: 'CSC413H5', name: 'CSC413H5: Machine Learning & Data Mining', emoji: '🤖', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Computational logic applied to algorithmic inference.' }
    },
    'writing': {
        1: { code: 'ISP100H5', name: 'ISP100: Writing for University', emoji: '✍️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Foundational scholarly communication.' },
        2: { code: 'WRI273H5', name: 'WRI273H5: Expressive Writing', emoji: '📝', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Voice, style, and creative non-fiction.' },
        3: { code: 'WRI360H5', name: 'WRI360: Technical Writing', emoji: '📋', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Clear documentation for technical systems.' },
        4: { code: 'WRI410H5', name: 'WRI410: Senior Seminar in Writing', emoji: '🖋️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Professional manuscript development and publication.' }
    },
    'presentation': {
        1: { code: 'CCT110H5', name: 'CCT110: Rhetoric and Media', emoji: '🎤', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Public communication, rhetoric, and visual media.' },
        2: { code: 'CCT200H5', name: 'CCT200: Communication, Information & Culture', emoji: '📡', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Cultural and sociological impacts of communication networks.' },
        3: { code: 'CCT300H5', name: 'CCT300: Critical Media Theory', emoji: '🎥', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Critical perspectives on digital platforms and multimedia.' },
        4: { code: 'CCT410H5', name: 'CCT410: Senior Capstone in Media & Tech', emoji: '🌟', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Senior digital media project and presentation showcase.' }
    },
    // New concept keywords
    'algorithms': {
        1: { code: 'CSC148H5', name: 'CSC148: Introduction to Computer Science', emoji: '🌳', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Foundational data structures and algorithm design.' },
        2: { code: 'CSC263H5', name: 'CSC263: Data Structures and Analysis', emoji: '📊', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Priority queues, amortized analysis, and hashing.' },
        3: { code: 'CSC373H5', name: 'CSC373: Algorithm Design and Analysis', emoji: '⚡', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Greedy, DP, and NP-completeness.' },
        4: { code: 'CSC413H5', name: 'CSC413H5: Machine Learning & Data Mining', emoji: '🤖', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Statistical learning theory and neural inference.' }
    },
    'theory': {
        1: { code: 'MAT102H5', name: 'MAT102: Mathematical Proofs', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'The proof foundation for theoretical CS.' },
        2: { code: 'CSC236H5', name: 'CSC236: Intro to Theory of Computation', emoji: '🧠', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Induction, correctness, and regular languages.' },
        3: { code: 'CSC363H5', name: 'CSC363: Computational Complexity', emoji: '🔁', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Decidability, Turing machines, and complexity classes.' },
        4: { code: 'CSC488H5', name: 'CSC488: Compilers and Interpreters', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Lexical analysis, parsing, and code generation.' }
    },
    'hardware': {
        1: { code: 'CSC108H5', name: 'CSC108: Intro to Programming', emoji: '🐍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Software foundations before hardware architecture.' },
        2: { code: 'CSC258H5', name: 'CSC258: Computer Organization', emoji: '🖥️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'ALUs, datapaths, memory, and MIPS assembly.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Kernel, memory management, and hardware abstraction.' },
        4: { code: 'CSC469H5', name: 'CSC469: OS Design and Implementation', emoji: '🔧', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Advanced kernel design and systems implementation.' }
    },
    'datastructures': {
        1: { code: 'CSC148H5', name: 'CSC148: Introduction to Computer Science', emoji: '🌳', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Abstract types, recursion, and basic structures.' },
        2: { code: 'CSC263H5', name: 'CSC263: Data Structures and Analysis', emoji: '📊', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Advanced structures with amortized analysis.' },
        3: { code: 'CSC343H5', name: 'CSC343: Introduction to Databases', emoji: '🗄️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Relational algebra, SQL, and data modeling.' },
        4: { code: 'CSC409H5', name: 'CSC409: Scalable Computing', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Distributed data stores and cloud scalability.' }
    },
    'networks': {
        1: { code: 'CSC108H5', name: 'CSC108: Intro to Programming', emoji: '🐍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Programming foundations before network systems.' },
        2: { code: 'CSC209H5', name: 'CSC209: Software Tools & Systems Programming', emoji: '🌐', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'OSI model, routing, and TCP/IP protocols.' },
        3: { code: 'CSC309H5', name: 'CSC309: Programming on the Web', emoji: '🌍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Full-stack web applications and HTTP protocols.' },
        4: { code: 'CSC458H5', name: 'CSC458: Computer Networks', emoji: '📡', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Advanced networking, BGP, and security.' }
    },
    'softwareengineering': {
        1: { code: 'CSC148H5', name: 'CSC148: Introduction to Computer Science', emoji: '🌳', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Abstract data types, recursion, and object-oriented foundations.' },
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '🏗️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Agile methodology, requirements, and testing.' },
        3: { code: 'CSC301H5', name: 'CSC301H5: Engineering Large Systems', emoji: '🏛️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Architectural design of enterprise software.' },
        4: { code: 'CSC490H5', name: 'CSC490: Capstone Design Course', emoji: '🎓', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Senior capstone team project and product deployment.' }
    }
};

// Department-level fallbacks when a generic course code is leveled up
export const DEPARTMENT_YEAR_FALLBACKS = {
    mat: {
        1: { code: 'MAT102H5', name: 'MAT102: Mathematical Proofs', emoji: '🧩', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Foundational UTM proof crucible.' },
        2: { code: 'MAT202H5', name: 'MAT202: Introduction to Discrete Mathematics', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Discrete structures, relations, and combinatorics.' },
        3: { code: 'MAT301H5', name: 'MAT301: Groups and Symmetry', emoji: '📐', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Abstract algebra, groups, and permutations.' },
        4: { code: 'MAT401H5', name: 'MAT401: Polynomial Equations and Fields', emoji: '🔬', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Advanced field theory and Galois structures.' }
    },
    ast: {
        1: { code: 'AST101H5', name: 'AST101: Exploring the Universe', emoji: '✨', category: 'science', department: 'Chemical and Physical Sciences', desc: '1st-year cosmic exploration.' },
        2: { code: 'AST201H5', name: 'AST201H5: Exploration of the Solar System', emoji: '🪐', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Solar system exploration and planetary science.' },
        3: { code: 'AST320H5', name: 'AST320H5: Observational Astronomy', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Telescopic observation and spectral analysis.' },
        4: { code: 'CPS489Y5', name: 'CPS489Y5: Research in Astronomical & Physical Sciences', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Advanced astrophysics research seminar.' }
    },
    csc: {
        1: { code: 'CSC108H5', name: 'CSC108: Intro to Programming', emoji: '🐍', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Python programming fundamentals.' },
        2: { code: 'CSC207H5', name: 'CSC207: Software Design', emoji: '💻', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Object-oriented software design in Java.' },
        3: { code: 'CSC369H5', name: 'CSC369: Operating Systems', emoji: '⚙️', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Operating system kernels and concurrency in C.' },
        4: { code: 'CSC409H5', name: 'CSC409: Software Systems Integration', emoji: '🚀', category: 'cs', department: 'Mathematical and Computational Sciences', desc: 'Enterprise distributed cloud systems.' }
    },
    fah: {
        1: { code: 'FAH101H5', name: 'FAH101: Introduction to Art History', emoji: '🏛️', category: 'art', department: 'Visual Studies', desc: 'Monuments, paintings, and art history.' },
        2: { code: 'FAH289H5', name: 'FAH289: Art and the Environment', emoji: '🌿', category: 'art', department: 'Visual Studies', desc: 'Ecological aesthetics and landscape art.' },
        3: { code: 'FAH310H5', name: 'FAH310: Curatorial Practice & Museum Studies', emoji: '🖼️', category: 'art', department: 'Visual Studies', desc: 'Exhibition curation and museum archiving.' },
        4: { code: 'FAH480H5', name: 'FAH480H5: Advanced Studies in Art History', emoji: '📜', category: 'art', department: 'Visual Studies', desc: 'Senior art history methodology research.' }
    },
    fas: {
        1: { code: 'FAS143H5', name: 'FAS143: Foundations in Studio Practice', emoji: '🖌️', category: 'art', department: 'Visual Studies', desc: 'Drawing, observation, and studio foundation.' },
        2: { code: 'FAS247H5', name: 'FAS247: Studio Painting I', emoji: '🎨', category: 'art', department: 'Visual Studies', desc: 'Studio painting practice and color dynamics.' },
        3: { code: 'FAS343Y5', name: 'FAS343Y5: Advanced Drawing Practices', emoji: '✏️', category: 'art', department: 'Visual Studies', desc: 'Conceptual drawing and mixed media.' },
        4: { code: 'FAS450Y5', name: 'FAS450Y5: Senior Studio Project Capstone', emoji: '🌟', category: 'art', department: 'Visual Studies', desc: 'Senior graduating studio exhibition.' }
    },
    sta: {
        1: { code: 'STA107H5', name: 'STA107: Data Representation & Modelling', emoji: '📊', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Foundational statistical modeling.' },
        2: { code: 'STA256H5', name: 'STA256: Probability and Statistics I', emoji: '📈', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Probability distributions and expectations.' },
        3: { code: 'STA302H5', name: 'STA302: Methods of Data Analysis', emoji: '📉', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Applied regression analysis in R.' },
        4: { code: 'STA457H5', name: 'STA457: Time Series Analysis', emoji: '📊', category: 'math', department: 'Mathematical and Computational Sciences', desc: 'Forecasting and stochastic modeling.' }
    },
    bio: {
        1: { code: 'BIO152H5', name: 'BIO152: Introduction to Evolution', emoji: '🧬', category: 'science', department: 'Biology', desc: 'Evolutionary mechanisms and biological diversity.' },
        2: { code: 'BIO202H5', name: 'BIO202: Introductory Molecular Biology', emoji: '🔬', category: 'science', department: 'Biology', desc: 'DNA replication, transcription, and translation.' },
        3: { code: 'BIO310H5', name: 'BIO310: Physiology of Microorganisms', emoji: '🧫', category: 'science', department: 'Biology', desc: 'Microbial energetics and metabolic paths.' },
        4: { code: 'BIO400Y5', name: 'BIO400Y5: Capstone in Molecular Biology', emoji: '🧪', category: 'science', department: 'Biology', desc: 'Senior laboratory investigation.' }
    },
    chm: {
        1: { code: 'CHM110H5', name: 'CHM110: Chemical Principles I', emoji: '🧪', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Chemical kinetics, equilibria, and stoichiometry.' },
        2: { code: 'CHM242H5', name: 'CHM242: Organic Chemistry I', emoji: '⚗️', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Reaction mechanisms, synthesis, and functional groups.' },
        3: { code: 'CHM341H5', name: 'CHM341: Advanced Organic Chemistry', emoji: '🔬', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Stereochemistry and catalytic reactions.' },
        4: { code: 'CHM489Y5', name: 'CHM489Y5: Chemistry Research Project', emoji: '🧪', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Independent fourth-year chemistry thesis.' }
    },
    phy: {
        1: { code: 'PHY136H5', name: 'PHY136: Intro to Physics I', emoji: '⚡', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Mechanics, kinematics, and Newtonian dynamics.' },
        2: { code: 'PHY241H5', name: 'PHY241: Classical Mechanics', emoji: '🔭', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Lagrangian mechanics and central force motions.' },
        3: { code: 'PHY325H5', name: 'PHY325H5: Quantum Mechanics', emoji: '⚛️', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Wave functions, operators, and Schrödinger equation.' },
        4: { code: 'PHY426H5', name: 'PHY426H5: Physics Capstone Thesis', emoji: '🌌', category: 'science', department: 'Chemical and Physical Sciences', desc: 'Senior physics laboratory research project.' }
    },
    eng: {
        1: { code: 'ENG100H5', name: 'ENG100: Effective Writing', emoji: '📖', category: 'english', department: 'English and Drama', desc: 'Foundational university writing.' },
        2: { code: 'ENG202H5', name: 'ENG202: British Literature Survey', emoji: '📚', category: 'english', department: 'English and Drama', desc: 'Historical British literature review.' },
        3: { code: 'ENG308Y5', name: 'ENG308Y5: Shakespeare', emoji: '🎭', category: 'english', department: 'English and Drama', desc: 'Shakespearean drama and critical texts.' },
        4: { code: 'ENG400H5', name: 'ENG400H5: Advanced Studies in English', emoji: '📜', category: 'english', department: 'English and Drama', desc: 'Senior literary critique seminar.' }
    },
    wri: {
        1: { code: 'ISP100H5', name: 'ISP100: Writing for University', emoji: '✍️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Scholarly writing foundations.' },
        2: { code: 'WRI273H5', name: 'WRI273H5: Expressive Writing', emoji: '📝', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Narrative voice and expressive essay craft.' },
        3: { code: 'WRI360H5', name: 'WRI360: Technical Writing', emoji: '📋', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Professional technical communications.' },
        4: { code: 'WRI410H5', name: 'WRI410: Senior Seminar in Writing', emoji: '🖋️', category: 'writing', department: 'Institute for the Study of University Pedagogy', desc: 'Senior publishing portfolio seminar.' }
    },
    cct: {
        1: { code: 'CCT110H5', name: 'CCT110: Rhetoric and Media', emoji: '🎤', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Public speech and digital media rhetoric.' },
        2: { code: 'CCT200H5', name: 'CCT200: Communication, Information & Culture', emoji: '📡', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Socio-cultural dynamics of communications.' },
        3: { code: 'CCT300H5', name: 'CCT300: Critical Media Theory', emoji: '🎥', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Critical digital studies and algorithms.' },
        4: { code: 'CCT410H5', name: 'CCT410: Senior Capstone in Media & Tech', emoji: '🌟', category: 'presentation', department: 'Institute of Communication, Culture, Information & Technology', desc: 'Graduating showcase project.' }
    },
    phl: {
        1: { code: 'PHL103H5', name: 'PHL103: Intro to Philosophy', emoji: '🏛️', category: 'humanities', department: 'Philosophy', desc: 'Classical epistemology and ethics.' },
        2: { code: 'PHL245H5', name: 'PHL245: Modern Symbolic Logic', emoji: '🧠', category: 'humanities', department: 'Philosophy', desc: 'Propositional and symbolic logic.' },
        3: { code: 'PHL345H5', name: 'PHL345: Advanced Symbolic Logic', emoji: '⚖️', category: 'humanities', department: 'Philosophy', desc: 'Metatheoretic soundness and completeness.' },
        4: { code: 'PHL400H5', name: 'PHL400H5: Advanced Seminar in Philosophy', emoji: '📜', category: 'humanities', department: 'Philosophy', desc: 'Senior philosophical investigation.' }
    },
    psy: {
        1: { code: 'PSY100Y5', name: 'PSY100Y5: Intro to Psychology', emoji: '🧠', category: 'science', department: 'Psychology', desc: 'Perception, cognition, and behavioral sciences.' },
        2: { code: 'PSY201H5', name: 'PSY201: Research Design & Analysis', emoji: '📊', category: 'science', department: 'Psychology', desc: 'Psychological statistics and experimental testing.' },
        3: { code: 'PSY310H5', name: 'PSY310: Cognitive Neuroscience', emoji: '🔬', category: 'science', department: 'Psychology', desc: 'Brain structures, memory networks, and neuro-imaging.' },
        4: { code: 'PSY400Y5', name: 'PSY400Y5: Senior Thesis in Psychology', emoji: '🧬', category: 'science', department: 'Psychology', desc: 'Independent empirical psychological thesis.' }
    },
    soc: {
        1: { code: 'SOC100H5', name: 'SOC100: Intro to Sociology', emoji: '👥', category: 'social', department: 'Sociology', desc: 'Social structures, institutions, and community.' },
        2: { code: 'SOC205H5', name: 'SOC205: Quantitative Research Methods', emoji: '📈', category: 'social', department: 'Sociology', desc: 'Survey methodology and social statistics.' },
        3: { code: 'SOC301H5', name: 'SOC301H5: Advanced Sociological Theory', emoji: '📚', category: 'social', department: 'Sociology', desc: 'Marx, Weber, Durkheim, and modern critical theory.' },
        4: { code: 'SOC401H5', name: 'SOC401H5: Senior Seminar in Sociology', emoji: '🏛️', category: 'social', department: 'Sociology', desc: 'Senior thesis on institutional inequality.' }
    },
    eco: {
        1: { code: 'ECO101H5', name: 'ECO101H5: Intro to Economics', emoji: '💰', category: 'social', department: 'Economics', desc: 'Supply, demand, macro-stability, and market mechanisms.' },
        2: { code: 'ECO200Y5', name: 'ECO200Y5: Microeconomic Theory', emoji: '📊', category: 'social', department: 'Economics', desc: 'Consumer utility, firm production, and competitive equilibrium.' },
        3: { code: 'ECO310H5', name: 'ECO310H5: International Trade', emoji: '🌐', category: 'social', department: 'Economics', desc: 'Global commerce, exchange rates, and tariffs.' },
        4: { code: 'ECO400Y5', name: 'ECO400Y5: Advanced Microeconomics', emoji: '📈', category: 'social', department: 'Economics', desc: 'Game theory, mechanism design, and information economics.' }
    },
    mgm: {
        1: { code: 'MGM101H5', name: 'MGM101: Principles of Management', emoji: '💼', category: 'social', department: 'Management', desc: 'Organizational management foundations.' },
        2: { code: 'MGT220H5', name: 'MGT220: Financial Accounting', emoji: '📊', category: 'social', department: 'Management', desc: 'Corporate balance sheets and cash flows.' },
        3: { code: 'MGT330H5', name: 'MGT330: Corporate Finance', emoji: '📈', category: 'social', department: 'Management', desc: 'Capital investments and equity valuation.' },
        4: { code: 'MGT420H5', name: 'MGT420H5: Strategic Management Capstone', emoji: '🏆', category: 'social', department: 'Management', desc: 'Senior strategy and business governance.' }
    }
};

// Course + Year Level Progression Resolver
export function resolveCourseYearProgression(elemA, elemB) {
    const isYearA = isYearElement(elemA);
    const isYearB = isYearElement(elemB);

    if (isYearA && isYearB) {
        return resolveYearProgression(elemA, elemB);
    }

    let courseElem = null;
    let yearElem = null;

    if (isYearA && !isYearB) {
        yearElem = elemA;
        courseElem = elemB;
    } else if (isYearB && !isYearA) {
        yearElem = elemB;
        courseElem = elemA;
    } else {
        return null;
    }

    const targetYear = getYearLevel(yearElem);
    if (!targetYear) return null;

    const rawId = (courseElem.id || '').toLowerCase().trim();
    const cleanCourseId = rawId.replace(/[^a-z0-9]/g, '');
    const cleanCode = (courseElem.code || courseElem.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

    // 1. Direct course key lookup in UTM_YEAR_COURSES (handles e.g. mat102 -> MAT202, ast101 -> AST201H5, computerscience -> CSC)
    if (UTM_YEAR_COURSES[cleanCourseId] && UTM_YEAR_COURSES[cleanCourseId][targetYear]) {
        const item = UTM_YEAR_COURSES[cleanCourseId][targetYear];
        const id = item.code.toLowerCase().replace(/[^a-z0-9]/g, '');
        return { id, ...item, parents: [courseElem.name, yearElem.name] };
    }

    // Try without trailing h5 or leading codes
    const baseCodeMatch = cleanCode.match(/^([A-Z]{3}\d{3})/);
    if (baseCodeMatch) {
        const shortCode = baseCodeMatch[1].toLowerCase();
        if (UTM_YEAR_COURSES[shortCode] && UTM_YEAR_COURSES[shortCode][targetYear]) {
            const item = UTM_YEAR_COURSES[shortCode][targetYear];
            const id = item.code.toLowerCase().replace(/[^a-z0-9]/g, '');
            return { id, ...item, parents: [courseElem.name, yearElem.name] };
        }
    }

    // 2. Base starter discipline lookup (e.g. math, science, art, computerscience, etc.)
    if (UTM_YEAR_COURSES[courseElem.id] && UTM_YEAR_COURSES[courseElem.id][targetYear]) {
        const item = UTM_YEAR_COURSES[courseElem.id][targetYear];
        const id = item.code.toLowerCase().replace(/[^a-z0-9]/g, '');
        return { id, ...item, parents: [courseElem.name, yearElem.name] };
    }

    // 3. Department prefix fallback (e.g. MAT, AST, CSC, FAH, FAS, BIO, etc.)
    const codePrefixMatch = cleanCode.match(/^([A-Z]{3})/);
    const prefix = codePrefixMatch ? codePrefixMatch[1].toLowerCase() : null;

    if (prefix && DEPARTMENT_YEAR_FALLBACKS[prefix] && DEPARTMENT_YEAR_FALLBACKS[prefix][targetYear]) {
        const item = DEPARTMENT_YEAR_FALLBACKS[prefix][targetYear];
        const id = item.code.toLowerCase().replace(/[^a-z0-9]/g, '');
        return { id, ...item, parents: [courseElem.name, yearElem.name] };
    }

    // 4. Dynamic UTM Catalog matching for ANY keyword, discipline, or custom element + Year Level
    if (typeof window !== 'undefined' && window.UTM_COURSES_DB && Array.isArray(window.UTM_COURSES_DB)) {
        const kw = (courseElem.name || courseElem.id || '').replace(/^(custom_|_)/i, '').toLowerCase().trim();
        const yearStr = String(targetYear);

        const candidates = window.UTM_COURSES_DB.filter(c => c.code && c.code.length >= 5 && c.code[3] === yearStr);

        // Priority 1: Department code matches keyword prefix (e.g. ECO for Economics, BIO for Biology, PHL for Philosophy)
        let match = candidates.find(c => {
            const dept = (c.dept_code || '').toLowerCase();
            return dept && (kw.startsWith(dept) || (kw.length >= 3 && dept.startsWith(kw.slice(0, 3))));
        });

        // Priority 2: Keyword is inside the Course Title
        if (!match) {
            match = candidates.find(c => (c.title || '').toLowerCase().includes(kw));
        }

        // Priority 3: Keyword is inside the Course Description
        if (!match) {
            match = candidates.find(c => (c.description || '').toLowerCase().includes(kw));
        }

        if (match) {
            return {
                id: match.code.toLowerCase().replace(/[^a-z0-9]/g, ''),
                code: match.code,
                name: `${match.code}: ${match.title}`,
                emoji: courseElem.emoji || '📚',
                category: match.distribution ? match.distribution.toLowerCase() : (courseElem.category || 'math'),
                department: match.dept_code ? `${match.dept_code} Department` : 'UTM',
                desc: match.description || `An authentic Year ${targetYear} UTM course in ${courseElem.name}.`,
                parents: [courseElem.name, yearElem.name]
            };
        }
    }

    return null;
}

// Lookup a course code in the utm_courses.json dataset (loaded as window.UTM_COURSES_DB)
export function lookupUTMCourseByCode(code) {
    if (typeof window === 'undefined' || !window.UTM_COURSES_DB) return null;
    const clean = code.toUpperCase().trim();
    return window.UTM_COURSES_DB.find(c => c.code === clean) || null;
}

// Lookup courses by department prefix
export function lookupUTMCoursesByDept(deptCode) {
    if (typeof window === 'undefined' || !window.UTM_COURSES_DB) return [];
    const clean = deptCode.toUpperCase().trim();
    return window.UTM_COURSES_DB.filter(c => c.dept_code === clean);
}

// Call Gemini Flash-Lite to generate authentic UTM course matching the two inputs
export async function generateCourseWithGemini(elemA, elemB, customApiKey = null) {
    const savedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('utmcraft_custom_api_key') : null;
    const apiKey = customApiKey || savedKey || GEMINI_API_KEY_DEFAULT;

    const nameA = elemA.name;
    const nameB = elemB.name;
    const codeA = elemA.code || '';
    const codeB = elemB.code || '';

    // Check if API key is present and looks like a valid Google AI key (AIzaSy...)
    const hasValidKey = apiKey && apiKey.startsWith('AIzaSy');

    if (hasValidKey) {
        try {
            const prompt = `You are an expert University of Toronto Mississauga (UTM) academic course advisor and Infinite Craft game engine.
The player combines two concepts/courses at UTM to discover a new, authentic UTM undergraduate course related to those keywords:
Concept/Course 1: "${nameA}" ${codeA ? `(${codeA})` : ''}
Concept/Course 2: "${nameB}" ${codeB ? `(${codeB})` : ''}

Your task:
1. Determine whether there is a genuine, meaningful academic connection between these two concepts or courses.
2. COMPATIBILITY & NO-CONNECTION RULE:
   If the two concepts or courses DO NOT merge well together, have no meaningful connection, or there is no legitimate, authentic UTM undergraduate course that genuinely combines or connects both topics (for example: completely unrelated topics with no plausible academic intersection at UTM):
   You MUST return ONLY:
   {
     "no_match": true
   }
3. If there IS an authentic connection:
   Identify a real, authentic undergraduate course actually offered at UTM (e.g., CSC108H5, CSC148H5, MAT102H5, MAT135H5, BIO152H5, CHM110H5, PHY136H5, PSY100Y5, SOC100H5, ECO101H5, etc.). Do not hallucinate fake course codes.

Return ONLY a valid JSON object.
If compatible:
{
  "no_match": false,
  "code": "CSC148H5",
  "name": "Introduction to Computer Science",
  "emoji": "🌳",
  "category": "cs",
  "department": "Mathematical and Computational Sciences",
  "desc": "Brief 1-2 sentence description explaining how this UTM course connects both concepts."
}
If incompatible or no good connection:
{
  "no_match": true
}

Valid categories: "math", "cs", "art", "science", "english", "writing", "presentation", "humanities", "social", "year".
Output ONLY pure JSON.`;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json'
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (candidate) {
                    const parsed = JSON.parse(candidate);
                    if (parsed.no_match === true || !parsed.code) {
                        return null; // Explicitly no match / cannot merge
                    }

                    const cleanCode = parsed.code.trim().toUpperCase();

                    // Verify against loaded UTM courses database to prevent hallucinations
                    let verifiedCourse = null;
                    if (window.UTM_COURSES_DB && Array.isArray(window.UTM_COURSES_DB)) {
                        verifiedCourse = window.UTM_COURSES_DB.find(c => c.code.toUpperCase() === cleanCode);
                        if (!verifiedCourse) {
                            console.log(`Course ${cleanCode} not found in official UTM database. Rejecting hallucination.`);
                            return null;
                        }
                    }

                    const cleanId = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const titleText = verifiedCourse ? verifiedCourse.title : (parsed.name || cleanCode);
                    const displayName = `${cleanCode}: ${titleText.replace(/^[A-Z0-9]+:\s*/, '')}`;

                    return {
                        id: cleanId,
                        code: cleanCode,
                        name: displayName,
                        emoji: parsed.emoji || '📜',
                        category: parsed.category || (verifiedCourse && verifiedCourse.dept_code ? verifiedCourse.dept_code.toLowerCase() : 'math'),
                        department: parsed.department || (verifiedCourse && verifiedCourse.dept_code ? `${verifiedCourse.dept_code} Department` : 'University of Toronto Mississauga'),
                        desc: (verifiedCourse && verifiedCourse.description) || parsed.desc || `An authentic UTM course combining ${nameA} and ${nameB}.`,
                        isAiGenerated: true,
                        parents: [nameA, nameB]
                    };
                }
            }
        } catch (err) {
            console.warn('Gemini API call failed or timed out:', err);
        }
    }

    // Fallback: Check if there is an authentic course in window.UTM_COURSES_DB connecting both
    if (window.UTM_COURSES_DB && Array.isArray(window.UTM_COURSES_DB)) {
        const cleanNameA = nameA.replace(/^(custom_|_)/i, '').toLowerCase().trim();
        const cleanNameB = nameB.replace(/^(custom_|_)/i, '').toLowerCase().trim();
        const termsA = [cleanNameA, codeA.toLowerCase()].filter(Boolean);
        const termsB = [cleanNameB, codeB.toLowerCase()].filter(Boolean);

        // Find a real UTM course whose title, description, department or prerequisites mention meaningful elements of both
        const connecting = window.UTM_COURSES_DB.find(c => {
            const fullText = `${c.code} ${c.dept_code || ''} ${c.title} ${c.description || ''} ${c.prerequisites || ''}`.toLowerCase();
            const matchesA = termsA.some(t => t.length > 2 && fullText.includes(t));
            const matchesB = termsB.some(t => t.length > 2 && fullText.includes(t));
            return matchesA && matchesB && c.code !== codeA && c.code !== codeB;
        });

        if (connecting) {
            const cleanId = connecting.code.toLowerCase().replace(/[^a-z0-9]/g, '');
            return {
                id: cleanId,
                code: connecting.code,
                name: `${connecting.code}: ${connecting.title}`,
                emoji: '📚',
                category: connecting.distribution ? connecting.distribution.toLowerCase() : 'math',
                department: connecting.dept_code || 'UTM',
                desc: connecting.description || `An authentic UTM course connecting ${nameA} and ${nameB}.`,
                isCatalogMatched: true,
                parents: [nameA, nameB]
            };
        }
    }

    // No meaningful connection found between the two courses/concepts
    return null;
}

// Strict Validation Gatekeeper: Ensures every course element is an authentic entry in utm_courses.json
export function ensureAuthenticUTMCourse(elem) {
    if (!elem) return null;

    // Allow starter elements, year levels, or custom user keywords
    if (elem.category === 'starter' || elem.category === 'year' || elem.isCustom) {
        return elem;
    }

    const rawCode = (elem.code || elem.id || '').toUpperCase().trim();
    if (!rawCode) return null;

    if (typeof window !== 'undefined' && window.UTM_COURSES_DB && Array.isArray(window.UTM_COURSES_DB)) {
        const realCourse = window.UTM_COURSES_DB.find(c => c.code.toUpperCase() === rawCode);
        if (!realCourse) {
            console.warn(`[UTMCraft] REJECTED course "${rawCode}" because it is not an active course in utm_courses.json!`);
            return null;
        }

        // Enforce the exact official course code, title, and description from utm_courses.json
        return {
            ...elem,
            id: realCourse.code.toLowerCase().replace(/[^a-z0-9]/g, ''),
            code: realCourse.code,
            name: `${realCourse.code}: ${realCourse.title.replace(/^[A-Z0-9]+:\s*/, '')}`,
            officialTitle: realCourse.title,
            desc: realCourse.description || elem.desc || '',
            department: realCourse.dept_code ? `${realCourse.dept_code} Department` : (elem.department || 'UTM'),
            distribution: realCourse.distribution || elem.distribution || 'Science',
            isAuthenticUTM: true
        };
    }

    return elem;
}
