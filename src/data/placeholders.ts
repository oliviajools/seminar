const ALL_STIMULI = [
  {
    id: 1,
    label: "Werbung 1",
    imageUrl: "/ads/Ad1.jpg",
    brand: "Marke 1",
  },
  {
    id: 2,
    label: "Werbung 2",
    imageUrl: "/ads/Ad2.jpg",
    brand: "Marke 2",
  },
  {
    id: 3,
    label: "Werbung 3",
    imageUrl: "/ads/Ad3.png",
    brand: "Marke 3",
  },
  {
    id: 4,
    label: "Werbung 4",
    imageUrl: "/ads/Ad4.png",
    brand: "Marke 4",
  },
  {
    id: 5,
    label: "Werbung 5",
    imageUrl: "/ads/Ad5.jpeg",
    brand: "Marke 5",
  },
  {
    id: 6,
    label: "Werbung 6",
    imageUrl: "/ads/Ad6.jpeg",
    brand: "Marke 6",
  },
  {
    id: 7,
    label: "Werbung 7",
    imageUrl: "/ads/Ad7.jpg",
    brand: "Marke 7",
  },
  {
    id: 8,
    label: "Distraktor 1",
    imageUrl: "/ads/Ad+1.png",
    brand: "Marke 8",
  },
  {
    id: 9,
    label: "Distraktor 2",
    imageUrl: "/ads/Ad+2.png",
    brand: "Marke 9",
  },
  {
    id: 10,
    label: "Distraktor 3",
    imageUrl: "/ads/Ad+3.jpg",
    brand: "Marke 10",
  },
  {
    id: 11,
    label: "Distraktor 4",
    imageUrl: "/ads/Ad+4.png",
    brand: "Marke 11",
  },
  {
    id: 12,
    label: "Distraktor 5",
    imageUrl: "/ads/Ad+5.jpg",
    brand: "Marke 12",
  },
  {
    id: 13,
    label: "Distraktor 6",
    imageUrl: "/ads/Ad+6.jpg",
    brand: "Marke 13",
  },
  {
    id: 14,
    label: "Distraktor 7",
    imageUrl: "/ads/Ad+7.jpg",
    brand: "Marke 14",
  },
  {
    id: 15,
    label: "Distraktor 8",
    imageUrl: "/ads/Ad+8.jpg",
    brand: "Marke 15",
  },
  {
    id: 16,
    label: "Distraktor 9",
    imageUrl: "/ads/Ad+9.png",
    brand: "Marke 16",
  },
  {
    id: 17,
    label: "Distraktor 10",
    imageUrl: "/ads/Ad+10.jpeg",
    brand: "Marke 17",
  },
  {
    id: 18,
    label: "Distraktor 11",
    imageUrl: "/ads/Ad+11.png",
    brand: "Marke 18",
  },
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const STIMULI = shuffleArray(ALL_STIMULI);

// Original 7 ads for exposure phase (not shuffled)
export const EXPOSURE_STIMULI = ALL_STIMULI.slice(0, 7);

// Face images for priming
export const FACES = [
  { id: 1, gender: "male", imageUrl: "/faces/portrait1.jpeg" },
  { id: 2, gender: "male", imageUrl: "/faces/portrait2.jpeg" },
  { id: 3, gender: "male", imageUrl: "/faces/portrait3.jpeg" },
  { id: 4, gender: "male", imageUrl: "/faces/portrait4.jpeg" },
  { id: 5, gender: "male", imageUrl: "/faces/portrait5.jpeg" },
  { id: 6, gender: "male", imageUrl: "/faces/portrait6.jpeg" },
  { id: 7, gender: "female", imageUrl: "/faces/portrait1w.jpeg" },
  { id: 8, gender: "female", imageUrl: "/faces/portrait2w.jpg" },
  { id: 9, gender: "female", imageUrl: "/faces/portrait3w.jpeg" },
  { id: 10, gender: "female", imageUrl: "/faces/portrait4w.jpeg" },
  { id: 11, gender: "female", imageUrl: "/faces/portrait5w.jpeg" },
  { id: 12, gender: "female", imageUrl: "/faces/portrait6w.jpeg" },
];

export const PRIMING_WORDS: {
  word: string;
  category: "positive" | "negative" | "neutral";
}[] = [
  { word: "Liebe", category: "positive" },
  { word: "Freude", category: "positive" },
  { word: "Vertrauen", category: "positive" },
  { word: "Wärme", category: "positive" },
  { word: "Erfolg", category: "positive" },
  { word: "Mut", category: "positive" },
  { word: "Harmonie", category: "positive" },
  { word: "Angst", category: "negative" },
  { word: "Wut", category: "negative" },
  { word: "Ekel", category: "negative" },
  { word: "Trauer", category: "negative" },
  { word: "Schmerz", category: "negative" },
  { word: "Schuld", category: "negative" },
  { word: "Tisch", category: "neutral" },
  { word: "Stuhl", category: "neutral" },
  { word: "Fenster", category: "neutral" },
  { word: "Papier", category: "neutral" },
  { word: "Uhr", category: "neutral" },
  { word: "Stein", category: "neutral" },
  { word: "Wolke", category: "neutral" },
];

export const BRANDS = [
  "Apple",
  "Nike",
  "IKEA",
  "Tesla",
  "Coca-Cola",
  "Patagonia",
  "Lego",
  "Red Bull",
];

export const BRAND_QUADRANT_EXPLANATIONS: Record<
  string,
  {
    mainQuadrant: "CARE" | "LUST" | "PLAY" | "SEEKING";
    explanation: string;
  }
> = {
  Apple: {
    mainQuadrant: "SEEKING",
    explanation: "Apple verkörpert das Streben nach Innovation und Entdeckung. Die Marke steht für technologischen Fortschritt, Neugier und den Wunsch, die Zukunft zu gestalten.",
  },
  Nike: {
    mainQuadrant: "PLAY",
    explanation: "Nike repräsentiert Bewegung, Sport und Spaß. Die Marke fördert spielerische Aktivität, Wettkampf und die Freude an körperlicher Betätigung.",
  },
  IKEA: {
    mainQuadrant: "CARE",
    explanation: "IKEA steht für Fürsorge und Zuhause. Die Marke bietet erschwingliche Lösungen für ein gemütliches, geschütztes Zuhause und kümmert sich um das alltägliche Wohlbefinden.",
  },
  Tesla: {
    mainQuadrant: "SEEKING",
    explanation: "Tesla symbolisiert das Streben nach nachhaltiger Innovation und technologischer Spitzenleistung. Die Marke verkörpert Neugier, Entdeckungsdrang und die Vision einer besseren Zukunft.",
  },
  "Coca-Cola": {
    mainQuadrant: "LUST",
    explanation: "Coca-Cola verkörpert Genuss und Vergnügen. Die Marke steht für Freude, Geschmackserlebnisse und das pure Vergnügen eines kühlen Getränks.",
  },
  Patagonia: {
    mainQuadrant: "CARE",
    explanation: "Patagonia verkörpert echte Fürsorge für die Umwelt. Die Marke steht für Nachhaltigkeit, Schutz der Natur und Verantwortung für zukünftige Generationen.",
  },
  Lego: {
    mainQuadrant: "PLAY",
    explanation: "Lego ist die Essenz des Spiels und der Kreativität. Die Marke fördert spielerisches Lernen, Fantasie und die Freude am Erschaffen.",
  },
  "Red Bull": {
    mainQuadrant: "SEEKING",
    explanation: "Red Bull verkörpert das Streben nach Abenteuer und Grenzerfahrung. Die Marke steht für Energie, Mut und den Wunsch, das eigene Potenzial zu entdecken und zu erweitern.",
  },
};

export const QUADRANTS = [
  { id: "CARE", label: "CARE / Fürsorge", position: "top-left" },
  { id: "LUST", label: "LUST / Begehren", position: "top-right" },
  { id: "PLAY", label: "PLAY / Spiel", position: "bottom-left" },
  { id: "SEEKING", label: "SEEKING / Erkundung", position: "bottom-right" },
] as const;

export const FREE_ENERGY_SCENARIOS = [
  {
    id: "morning-routine",
    label: "Morgenroutine",
    description: "Ihr gewohnter Morgenablauf: Aufstehen, Kaffee, Weg zur Arbeit",
  },
  {
    id: "surprise-trip",
    label: "Spontanreise",
    description: "Ein unerwarteter Kurztrip in eine fremde Stadt",
  },
  {
    id: "new-product",
    label: "Neues Produkt",
    description: "Sie entdecken ein völlig neuartiges Produkt im Regal",
  },
  {
    id: "weekly-grocery",
    label: "Wocheneinkauf",
    description: "Der reguläre Gang zum Supermarkt",
  },
];

export const EMOTIONAL_SYSTEMS = ["SEEKING", "LUST", "CARE", "PLAY"] as const;

export type EmotionalSystem = (typeof EMOTIONAL_SYSTEMS)[number];

export type VariableKey = "activation" | "goalDirectedness" | "freeEnergy";

// Klartext-Achsen: übersetzen den Neuro-Jargon in team-taugliche Fragen.
// Grundlage: FRAMEWORK.md Abschnitt 4.1
export const VARIABLE_AXES: Record<
  VariableKey,
  {
    label: string;
    jargon: string;
    question: string;
    low: string;
    mid: string;
    high: string;
  }
> = {
  activation: {
    label: "Aktivierung",
    jargon: "Activation",
    question: "Wie viel Energie löst der Reiz aus?",
    low: "ruhig, sicher, reduziert",
    mid: "aufmerksam, interessiert",
    high: "energiegeladen, intensiv",
  },
  goalDirectedness: {
    label: "Zielstrebigkeit",
    jargon: "Goal Directedness",
    question: "Wie klar ist die nächste Handlung?",
    low: "offen, explorativ",
    mid: "Orientierung mit Wahlfreiheit",
    high: "klare CTA, direkte Handlung",
  },
  freeEnergy: {
    label: "Überraschung",
    jargon: "Free Energy",
    question: "Wie neu/unerwartet ist der Reiz?",
    low: "vertraut, erwartbar",
    mid: "neu, aber verständlich",
    high: "stark neu, irritierend, riskant",
  },
};

// Soll-Profile je System als Wertebereiche [min, max] auf der 1–10-Skala.
// Grundlage: FRAMEWORK.md Abschnitt 4.2 (aus den Seminar-Slides abgeleitet)
export const SYSTEM_PROFILES: Record<
  EmotionalSystem,
  Record<VariableKey, [number, number]>
> = {
  SEEKING: { activation: [8, 10], goalDirectedness: [3, 6], freeEnergy: [8, 10] },
  PLAY: { activation: [6, 9], goalDirectedness: [2, 4], freeEnergy: [4, 7] },
  LUST: { activation: [6, 9], goalDirectedness: [4, 7], freeEnergy: [4, 7] },
  CARE: { activation: [3, 6], goalDirectedness: [8, 10], freeEnergy: [2, 4] },
};

export const SENSORY_RECOMMENDATIONS: Record<
  string,
  {
    color: string;
    form: string;
    motion: string;
    sound: string;
    timing: string;
    copyStyle: string;
  }
> = {
  SEEKING: {
    color: "Gelb-Orange, warm leuchtend",
    form: "Offen, expandierend, Pfeile",
    motion: "Schnell, nach vorne gerichtet",
    sound: "Aufsteigende Tonfolgen, Neugier-Sounds",
    timing: "Schnelle Schnitte, dynamisch",
    copyStyle: "Fragen stellen, Neugier wecken, 'Entdecke...'",
  },
  LUST: {
    color: "Rot, Gold, Schwarz – sinnlich & premium",
    form: "Rund, weich, organisch",
    motion: "Langsam, fließend, sinnlich",
    sound: "Tiefe Bässe, samtiger Klang",
    timing: "Langsame Reveals, Suspense",
    copyStyle: "Sinnlich, genussvoll, 'Spüre...'",
  },
  CARE: {
    color: "Pastelltöne, Blau, warmes Weiß",
    form: "Rund, einschließend, schützend",
    motion: "Sanft, wiegend, beruhigend",
    sound: "Warme Stimmen, Naturklänge",
    timing: "Ruhiger Rhythmus, keine Hektik",
    copyStyle: "Fürsorglich, 'Wir sind für dich da'",
  },
  PLAY: {
    color: "Bunt, kontrastreich, überraschend",
    form: "Unregelmäßig, spielerisch, eckig",
    motion: "Hüpfend, überraschend, unvorhersehbar",
    sound: "Verspielte Melodien, Lachen",
    timing: "Schnelle Wechsel, Überraschungsmomente",
    copyStyle: "Humorvoll, verspielt, 'Was wäre wenn...'",
  },
};
