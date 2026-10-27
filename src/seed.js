export const lessons = [
  {
    id: 'biology-basics',
    title: 'Biology: The Basics of Life',
    category: 'Foundations of Biology',
    level: 'Beginner',
    duration: '12 min',
    icon: '🧬',
    summary: 'Explore cells, living systems, and the characteristics shared by living organisms.',
    objectives: ['Describe a cell as a basic unit of life', 'Identify common characteristics of living things', 'Explain why observation and evidence matter in biology'],
    sections: [
      { heading: 'What is biology?', body: 'Biology is the scientific study of living organisms and their interactions with one another and their environments. Veterinary science draws on biology to understand how animals are built, how they function, and how their health can be supported.' },
      { heading: 'Cells: the basic units of life', body: 'Cells are the smallest units generally considered living. Some organisms consist of a single cell; animals are multicellular and contain specialised cells that work together in tissues and organs.' },
      { heading: 'Thinking like a scientist', body: 'Scientific explanations are built from observations, testable questions, evidence, and repeatable methods. A single observation may suggest an idea, but further evidence is needed before drawing a reliable conclusion.' }
    ],
    safetyNote: 'This lesson is educational and does not provide a method for diagnosing an animal.'
  },
  {
    id: 'animal-body-systems',
    title: 'Introduction to Animal Body Systems',
    category: 'Anatomy & Physiology',
    level: 'Beginner',
    duration: '15 min',
    icon: '🫀',
    summary: 'Learn how organs and body systems cooperate to keep an animal alive.',
    objectives: ['Distinguish cells, tissues, organs, and organ systems', 'Name several major body systems', 'Explain why body systems depend on one another'],
    sections: [
      { heading: 'From cells to systems', body: 'Similar cells can form tissues; tissues combine to form organs; and organs cooperate within organ systems. For example, the heart is an organ that works with blood vessels as part of the cardiovascular system.' },
      { heading: 'Major body systems', body: 'Major systems include the skeletal, muscular, nervous, respiratory, cardiovascular, digestive, urinary, endocrine, immune, and reproductive systems. Their structures and functions vary among species.' },
      { heading: 'Systems work together', body: 'The respiratory system brings oxygen into the body, while the cardiovascular system transports oxygen in blood. The nervous and endocrine systems help coordinate many body functions.' }
    ],
    safetyNote: 'Animal anatomy differs by species. A learning diagram is not a substitute for veterinary examination or professional training.'
  },
  {
    id: 'animal-welfare',
    title: 'Animal Welfare and Responsible Care',
    category: 'Animal Health & Welfare',
    level: 'Beginner',
    duration: '10 min',
    icon: '🐾',
    summary: 'Understand welfare, basic needs, humane handling, and when to seek professional help.',
    objectives: ['Describe animal welfare in simple terms', 'Recognise the importance of species-specific needs', 'Identify situations that require qualified help'],
    sections: [
      { heading: 'What is animal welfare?', body: 'Animal welfare concerns an animal’s physical and mental state. It includes health, comfort, nutrition, safety, opportunities to express relevant natural behaviours, and protection from avoidable pain, fear, and distress.' },
      { heading: 'Needs differ by species', body: 'Dogs, cats, birds, reptiles, livestock, and wildlife have different environmental, dietary, social, and behavioural needs. Care should be based on reliable species-specific guidance rather than assumptions that all animals need the same things.' },
      { heading: 'When to seek help', body: 'Sudden difficulty breathing, severe bleeding, collapse, suspected poisoning, major injury, or marked distress can be emergencies. Contact a registered veterinarian or appropriate wildlife or animal welfare service promptly; do not attempt unfamiliar procedures.' }
    ],
    safetyNote: 'This is general learning material, not veterinary advice. Never give an animal human medication or attempt a procedure based on a website lesson.'
  },
  {
    id: 'wildlife-ecosystems',
    title: 'Wildlife, Habitats, and Ecosystems',
    category: 'Wildlife & Conservation',
    level: 'Beginner',
    duration: '11 min',
    icon: '🌍',
    summary: 'Discover how animals interact with habitats, food webs, and conservation efforts.',
    objectives: ['Define habitat and ecosystem', 'Explain the idea of a food web', 'Describe how conservation supports biodiversity'],
    sections: [
      { heading: 'Habitats and ecosystems', body: 'A habitat is the place where an organism lives. An ecosystem includes living organisms and the non-living parts of their environment, along with the interactions between them.' },
      { heading: 'Food webs', body: 'Food webs show feeding relationships among organisms. Changes to one population can affect others, so understanding ecological relationships helps explain why protecting habitats matters.' },
      { heading: 'Conservation and health', body: 'Conservation aims to protect species, habitats, and biodiversity. Human, domestic animal, and wildlife health can be connected through shared environments, which is one reason responsible land use and disease monitoring matter.' }
    ],
    safetyNote: 'Do not approach, feed, capture, or handle wild animals. Follow local wildlife guidance and contact trained wildlife professionals when assistance is needed.'
  }
];

export const quizQuestions = [
  {
    id: 'q1',
    question: 'What is generally considered the basic unit of life?',
    options: ['An organ', 'A cell', 'A habitat', 'An ecosystem'],
    answerIndex: 1,
    explanation: 'Cells are the basic structural and functional units of living organisms.'
  },
  {
    id: 'q2',
    question: 'Which statement best describes animal welfare?',
    options: ['Only whether an animal has food', 'Only whether an animal is free of disease', 'An animal’s physical and mental state', 'Whether an animal lives outdoors'],
    answerIndex: 2,
    explanation: 'Welfare includes physical health and comfort as well as mental state and opportunities to meet relevant behavioural needs.'
  },
  {
    id: 'q3',
    question: 'What is a habitat?',
    options: ['The place where an organism lives', 'A group of organs', 'A type of cell', 'A veterinary qualification'],
    answerIndex: 0,
    explanation: 'A habitat is the environment or place in which an organism lives.'
  },
  {
    id: 'q4',
    question: 'An animal has sudden severe difficulty breathing. What is the safest response?',
    options: ['Wait several days', 'Give human medication', 'Try an invasive procedure', 'Contact a veterinarian or emergency animal service promptly'],
    answerIndex: 3,
    explanation: 'Severe breathing difficulty may be an emergency. Seek qualified veterinary help promptly and avoid untrained treatment.'
  }
];
