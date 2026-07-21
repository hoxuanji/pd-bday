// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT CONFIGURATION — all content lives here
// ─────────────────────────────────────────────────────────────────────────────

import { computeAge } from "./utils";

const _dob = new Date("1999-05-22T00:00:00");
const _age = computeAge(_dob); // recomputed on every page load

export const SUBJECT = {
  name: "PAPIYA",
  displayName: "Papiya",
  initials: "PD",
  dob: _dob,
  age: _age,
  nickname: "Tumpa",
  timezone: "Europe/Rome",
  location: "Perugia, Italy",
};

// ─── BOOT SCREEN ─────────────────────────────────────────────────────────────

export const BOOT_SYSTEM_CHECKS = [
  { label: "CPU",  value: `OVERTHINKING ENGINE v${_age}.0 + GUILT_PROCESSOR`, status: "OK"   as const },
  { label: "RAM",  value: "WARDROBE INDEX  [OVERFLOW — CRITICAL]",             status: "CRIT" as const },
  { label: "GPU",  value: "DANCE_FLOOR_RENDERER · ATTENTION_MAGNET",           status: "OK"   as const },
  { label: "NET",  value: "SELECTIVE_CHAOS_NETWORK  [ON DEMAND]",              status: "OK"   as const },
  { label: "PWR",  value: "FROOTY + WINE + SPITE  [LOW_COFFEE MODE]",          status: "WARN" as const },
  { label: "OS",   value: `PD-OS v${_age}.0  ·  GEMINI EDITION  ·  ITALY ARC`, status: "OK"   as const },
];

export const BOOT_TRAIT_LOADS = [
  { name: "DRAMA_ENGINE  [HUNGER_LINKED]",      duration: 320, success: true  },
  { name: "ITALIAN_ASSIMILATION_MODULE",         duration: 440, success: true  },
  { name: "GUILT_TRIP_PROCESSOR  [INDIA_CTX]",  duration: 260, success: true  },
  { name: "DANCE_FLOOR_PROTOCOL",               duration: 180, success: true  },
  { name: "SHRINJAYEE_DAS_BLOCKER",             duration: 150, success: true  },
  { name: "EMOTIONAL_STABILITY",                duration: 600, success: false },
] as const;

// ─── PHYSICAL STATS ───────────────────────────────────────────────────────────

export const PHYSICAL_STATS = [
  {
    id: "height",
    label: "HEIGHT",
    rawValue: "5′2″",
    unit: "IMPERIAL",
    comparison: "≈ 3.1 baguettes stacked · optimal for being underestimated",
    subtext: "Has been proving people wrong at this exact height since 1999.",
    color: "lime",
  },
  {
    id: "weight",
    label: "WEIGHT",
    rawValue: "59",
    unit: "KG",
    comparison: "Exactly the density of someone who takes up the right amount of space",
    subtext: "Number is irrelevant. Presence is not.",
    color: "blue",
  },
  {
    id: "wardrobe",
    label: "WARDROBE STATUS",
    rawValue: "∞",
    unit: "OVERFLOW",
    comparison: "Clothes-to-wardrobe ratio: incalculable. New clothes arrive. Wardrobes do not.",
    subtext: "Youngest sister. Has been fighting for closet space since birth. Still fighting.",
    color: "pink",
  },
  {
    id: "proposals",
    label: "PROPOSALS RECEIVED",
    rawValue: "10k+",
    unit: "TOTAL",
    comparison: "All rejected. Qualification threshold: exists. Has been since teenage.",
    subtext: "Eye candy certified. Standards non-negotiable. Shrinjayee Das excluded from all lists.",
    color: "orange",
  },
  {
    id: "lateness",
    label: "PUNCTUALITY",
    rawValue: "0",
    unit: "ON-TIME EVENTS",
    comparison: "Has never arrived on time. Not once. Not even for her own birthday (probably).",
    subtext: "20-min delay is considered early. The group has adjusted accordingly. No complaints filed.",
    color: "yellow",
  },
  {
    id: "loyalty",
    label: "LOYALTY RATING",
    rawValue: "×100",
    unit: "AFGHAN HOUNDS",
    comparison: "When she is your person, she is completely, devastatingly your person.",
    subtext: "See also: The ₹2,100 Restaurant Incident, 2015. Case closed.",
    color: "lime",
  },
] as const;

// ─── PERSONALITY ENGINE ───────────────────────────────────────────────────────

export type PersonalityMetric = {
  id: string;
  label: string;
  value: number;
  color: "lime" | "pink" | "blue" | "orange" | "yellow";
  descriptor: string;
  detail: string;
};

export const PERSONALITY_METRICS: PersonalityMetric[] = [
  {
    id: "chaos",
    label: "CHAOS INDEX",
    value: 72,
    color: "orange",
    descriptor: "SELECTIVE DEPLOYMENT",
    detail:
      "Chaos is not constant — it is a choice, deployed at moments of maximum impact. This is somehow more alarming than full-time chaos. You cannot prepare for selective chaos.",
  },
  {
    id: "drama",
    label: "DRAMA COEFFICIENT",
    value: 94,
    color: "pink",
    descriptor: "OLYMPIC GRADE",
    detail:
      "Peaks sharply when hungry, during periods (no pills — on principle, with full conviction), and when something stops working as intended. Frooty unavailability triggers secondary spike.",
  },
  {
    id: "sleep",
    label: "SLEEP PROTOCOL",
    value: 97,
    color: "yellow",
    descriptor: "CRITICALLY COMPROMISED",
    detail:
      "Operates on 3-hour cycles or 8-hour marathons. No middle setting exists. The body has abandoned negotiation. Runs on schedule designed by no one, agreed to by no one, sustained by spite.",
  },
  {
    id: "loyalty",
    label: "LOYALTY RATING",
    value: 98,
    color: "lime",
    descriptor: "100 AFGHAN HOUNDS",
    detail:
      "Once you are her person, you are her person permanently. Evidence: school friendships since 2015, the ₹2,100 restaurant incident, and the fact that she will always, always show up.",
  },
  {
    id: "stability",
    label: "EMOTIONAL STABILITY",
    value: 16,
    color: "pink",
    descriptor: "GEMINI-GRADE VARIANCE",
    detail:
      "Possessive for 2 seconds, completely unbothered the next. Gets quiet for hours, then is the most vocal person in the room. Moody to the power ∞. The face provides zero useful data.",
  },
  {
    id: "italian",
    label: "ITALIAN ASSIMILATION",
    value: 41,
    color: "blue",
    descriptor: "IN PROGRESS",
    detail:
      "Arrived in Italy for a PhD. Immediately located the tiramisu. Currently learning to gesture with both hands while speaking. Frooty withdrawal ongoing. Pizza already mastered (pre-Italy).",
  },
];

// ─── DAY SIMULATOR ────────────────────────────────────────────────────────────

export type SimulatorChoice = {
  id: string;
  text: string;
  effect: { chaos?: number; drama?: number; food?: number; sleep?: number };
  reaction: string;
};

export type SimulatorStep = {
  id: string;
  phase: "morning" | "afternoon" | "evening";
  situation: string;
  context: string;
  choices: [SimulatorChoice, SimulatorChoice];
};

export const SIMULATOR_STEPS: SimulatorStep[] = [
  {
    id: "alarm",
    phase: "morning",
    situation: "9:47 AM — THE SEVENTH ALARM",
    context:
      "You were supposed to be somewhere at 10am. The first alarm fired at 8. You have silenced six of them. This is the seventh and final. You have 13 minutes. The auto takes 15.",
    choices: [
      {
        id: "sprint",
        text: "Get up. Move. You have done this before.",
        effect: { chaos: +10, sleep: -10 },
        reaction:
          "You are dressed in 4 minutes flat. A personal record. You arrive 22 minutes late, which everyone agrees is extremely on time for you.",
      },
      {
        id: "text",
        text: "'On my way' — sent from horizontal position.",
        effect: { drama: +15, chaos: +5 },
        reaction:
          "You are not on your way. You are lying down composing a detailed excuse. It is a good excuse. It will not help.",
      },
    ],
  },
  {
    id: "hunger",
    phase: "morning",
    situation: "1:00 PM — THE HUNGER EMERGENCY",
    context:
      "You have not eaten since last night. Your laptop is doing something unexpected. These two facts feel equally catastrophic and are absolutely related.",
    choices: [
      {
        id: "eat",
        text: "Eat first. Frooty + actual food. Laptop waits.",
        effect: { food: -25, drama: -20, chaos: -10 },
        reaction:
          "Revolutionary. You eat. The laptop problem is still there but it is now a manageable laptop problem and not a sign that everything is falling apart.",
      },
      {
        id: "laptop",
        text: "One more fix. Then food.",
        effect: { food: +30, drama: +30, chaos: +20 },
        reaction:
          "It is 4pm. The one fix became eleven fixes. You have not eaten. You are running on Frooty and a very specific kind of rage that only hunger produces.",
      },
    ],
  },
  {
    id: "chicken",
    phase: "afternoon",
    situation: "2:30 PM — THE CHICKEN SITUATION",
    context:
      "There is chicken curry in front of you. There is significantly too much chicken in it. This was not what you ordered, emotionally speaking.",
    choices: [
      {
        id: "extract",
        text: "Surgical extraction. Every piece. The rest is perfect.",
        effect: { chaos: -5, drama: -5 },
        reaction:
          "You spend 4 minutes removing every piece of chicken with the focus of a neurosurgeon. The remaining dish is perfect. You are at peace. This is correct behaviour.",
      },
      {
        id: "endure",
        text: "Eat around it. You are fine. You are not fine.",
        effect: { chaos: +10, drama: +15 },
        reaction:
          "You eat around it. Every bite near a piece of chicken is a small act of suffering. You say you're fine. Everyone present knows you are not fine.",
      },
    ],
  },
  {
    id: "evening",
    phase: "evening",
    situation: "8:00 PM — THE EVENING PLAN",
    context:
      "Your people are going out. There will be music. There will be wine. There will definitely be people watching. Someone will probably suggest a LIIT.",
    choices: [
      {
        id: "go",
        text: "Go. Dance like everyone is watching. They are.",
        effect: { drama: +10, chaos: -10 },
        reaction:
          "You are the best person on the dance floor and you know it. The real you comes out. Everyone is watching. You are better for it. A LIIT is ordered. You handle it with dignity (the first one).",
      },
      {
        id: "stay",
        text: "Cancel. Rom-com + Frooty + Hrithik Roshan. Alone.",
        effect: { sleep: -5, food: +20 },
        reaction:
          "You are in bed by 9pm watching Kaho Naa Pyaar Hai for the fourteenth time. You are completely unbothered. This is, in fact, a perfect evening.",
      },
    ],
  },
  {
    id: "night",
    phase: "evening",
    situation: "1:30 AM — NIGHT PROTOCOL",
    context:
      "You are awake. You are always awake at 1:30am. Someone on the internet is wrong about something. Also you just remembered Shrinjayee Das exists.",
    choices: [
      {
        id: "sleep",
        text: "Force sleep. PhD meeting at 9am is real.",
        effect: { sleep: -15, chaos: -10 },
        reaction:
          "You are in bed. Eyes open. Brain reviewing every decision made since 2014. You fall asleep at 3am and call it an early night.",
      },
      {
        id: "engage",
        text: "Engage. They are wrong. This requires correction.",
        effect: { chaos: +30, drama: +15, sleep: +45 },
        reaction:
          "It is 4:47am. You have won the argument (you were right), started three new conversations, watched a rom-com trailer, and sent two voice notes that begin with 'okay but listen—'",
      },
    ],
  },
];

export type SimulatorOutcome = {
  title: string;
  description: string;
  stats: string;
};

export function getSimulatorOutcome(stats: {
  chaos: number;
  drama: number;
  food: number;
  sleep: number;
}): SimulatorOutcome {
  const total = stats.chaos + stats.drama + stats.sleep;
  if (total > 160) {
    return {
      title: "MAXIMUM PAPIYA UNLOCKED",
      description:
        "Chaos deployed. Drama peaked. Sleep debt compounded. Chicken extracted. And yet — somehow — everything worked out. It always does. That is the actual superpower.",
      stats: `Chaos: ${stats.chaos}% · Drama: ${stats.drama}% · Food Regret: ${stats.food}% · Sleep Debt: ${stats.sleep}%`,
    };
  }
  if (total > 90) {
    return {
      title: "STANDARD PAPIYA DAY",
      description:
        "A perfectly calibrated mix of drama, selective chaos, and at least one correct food decision. The chicken was handled. The evening had music. This is what a good day looks like.",
      stats: `Chaos: ${stats.chaos}% · Drama: ${stats.drama}% · Food Regret: ${stats.food}% · Sleep Debt: ${stats.sleep}%`,
    };
  }
  return {
    title: "ANOMALOUS — DATA UNDER REVIEW",
    description:
      "Suspiciously functional. This result will be treated as an outlier. Not representative of the dataset. Do not extrapolate. A LIIT was probably not involved.",
    stats: `Chaos: ${stats.chaos}% · Drama: ${stats.drama}% · Food Regret: ${stats.food}% · Sleep Debt: ${stats.sleep}%`,
  };
}

// ─── MEMORY VAULT ─────────────────────────────────────────────────────────────

export type MemoryCardType = "memory" | "classified" | "audio" | "photo";
export type MemoryCard = {
  id: string;
  type: MemoryCardType;
  title: string;
  date: string;
  size: "large" | "medium" | "small";
  preview: string;
  full: string;
  tag: string;
  image?: string; // real photo, shown full-brightness in the modal
};

export const MEMORY_VAULT: MemoryCard[] = [
  {
    id: "restaurant",
    type: "memory",
    title: "THE ₹2,100 INCIDENT",
    date: "2015",
    size: "large",
    preview: "A restaurant. A bill. ₹900 in one pocket. A bundle in hers.",
    full:
      "The bill was ₹2,100. I had ₹900 in my pocket and was doing serious mental arithmetic about plate-washing logistics. She pulled out a bundle without a second thought. Day saved. Dignity preserved. She has not paid for food since — and somehow this is exactly as it should be. Some debts are structural. This is one of them.",
    tag: "MEMORY / FOUNDING INCIDENT / 2015",
    image: "/papiya_5.jpg",
  },
  {
    id: "school-gate",
    type: "memory",
    title: "THE SCHOOL GATE INCIDENT",
    date: "SCHOOL DAYS",
    size: "large",
    preview: "She was late. I left. She was denied entry. I received a formal threat.",
    full:
      "She was late. To be specific: late as a government promise, late as a period, late as puberty — a lateness so structural it could not be negotiated with. I waited. Then I left without her. She arrived after the gate closed. Entry was denied. Later that day I received a formal notice: one more incident and I would lose 100 out of 100 friendship points. I want it on record that I weighed the options and left anyway. I want it further on record that I have never done it since. The 100 points remain. Barely.",
    tag: "MEMORY / SCHOOL DAYS / GATE INCIDENT",
  },
  {
    id: "vengeful-admirer",
    type: "classified",
    title: "THE VENGEFUL ADMIRER",
    date: "CLASSIFIED — EXACT DATE WITHHELD",
    size: "medium",
    preview: "THREAT RECEIVED · LOCATION: MY HOUSE · STATUS: SURVIVED",
    full:
      "[CLASSIFIED] A man was very fond of her. I suggested, with full sincerity and zero regret, that she block him. She did. He came to my house. To threaten me. Personally. In person. At my home. I want to be clear: I looked him in the eye. I did not blink first. (I blinked. Once. Maybe twice. The light was bad.) I saw vengeance in his eyes. He left. I remained. She remains blocked. This is the correct outcome and I stand by the original advice.",
    tag: "CLASSIFIED / THREAT INCIDENT / RESOLVED",
  },
  {
    id: "not-a-good-guy",
    type: "classified",
    title: "THE REPUTATION FILE",
    date: "ONGOING · EST. SCHOOL DAYS",
    size: "medium",
    preview: "VERDICT: NOT A GOOD GUY · CURRENT STATUS: STILL HERE",
    full:
      "[CLASSIFIED] Multiple individuals — friends, acquaintances, interested third parties — delivered the same verdict over an extended period: not a good guy. The feedback was consistent. It was also ignored. She kept him anyway. He kept showing up anyway. None of the people who delivered the verdict are in the picture. Both of them are. Draw your own conclusions. The file remains open but the outcome is not in dispute.",
    tag: "CLASSIFIED / REPUTATION / UNRESOLVED (RESOLVED)",
  },
  {
    id: "italy",
    type: "memory",
    title: "THE ITALY DEPARTURE",
    date: "2023",
    size: "medium",
    preview: "First time out of the house. Destination: PhD. First discovery: tiramisu.",
    full:
      "She left home for the first time at 24, to do a PhD in Italy. Packed more clothes than any wardrobe she would find there. Arrived. Immediately located the tiramisu. Began a new chapter with the same guilt, the same loyalty, the same inability to date outside India because that would be 'doing all this' when she came to study. The PhD is going well. The tiramisu expertise is going better.",
    tag: "MEMORY / MILESTONE / ITALY ARC",
    image: "/papiya_4.jpg",
  },
  {
    id: "proposals",
    type: "classified",
    title: "THE PROPOSAL ARCHIVE",
    date: "ONGOING · EST. TEENAGE",
    size: "small",
    preview: "COUNT: 10,000+ · STATUS: ALL REJECTED",
    full:
      "[CLASSIFIED] Since approximately age 16, proposals numbering in the tens of thousands. All declined. Qualification threshold exists but is not published. Eye candy status: certified, self-aware, unbothered. The archive grows. The answer stays the same.",
    tag: "CLASSIFIED / ROMANTIC / ONGOING",
    image: "/papiya_1.jpg",
  },
  {
    id: "shrinjayee",
    type: "classified",
    title: "THE SHRINJAYEE DAS FILE",
    date: "PERPETUAL",
    size: "small",
    preview: "BLOCKER STATUS: ACTIVE · PRIORITY: MAXIMUM · REASON: [REDACTED]",
    full:
      "[CLASSIFIED — LEVEL 5] The subject known as Shrinjayee Das holds permanent negative status. Duration: indefinite. Reason: [REDACTED]. The SHRINJAYEE_DAS_BLOCKER runs at boot, cannot be suspended, and is not open for discussion. This is not a bug. Do not file a ticket.",
    tag: "CLASSIFIED / INTERPERSONAL / PERPETUAL",
  },
  {
    id: "liit",
    type: "classified",
    title: "THE LIIT INCIDENT(S)",
    date: "MULTIPLE OCCURRENCES",
    size: "small",
    preview: "NEMESIS: LONG ISLAND ICED TEA · OUTCOMES: CONSISTENT",
    full:
      "[CLASSIFIED] LIIT has been identified as the consistent nemesis. Body's actual limit: ~2 drinks. Ego's stated limit: significantly higher. The subject has described her tolerance as 'equivalent to two drinks.' This is accurate and entirely the problem. Outcomes across all documented incidents are consistent and non-negotiable. The LIIT remains at large.",
    tag: "CLASSIFIED / BEVERAGE / NEMESIS",
    image: "/papiya_6.jpg",
  },
  {
    id: "dance",
    type: "memory",
    title: "THE DANCE FLOOR PROTOCOL",
    date: "RECURRING",
    size: "medium",
    preview: "When she's safe — with her people — the real her arrives.",
    full:
      "She does not open up easily. Gets quiet first. Then, when it is her people, the real self comes out. The real self dances like everyone is watching, because everyone is watching, and she is better for it. This is not performance. This is a person who knows exactly what they're doing and has decided to do it anyway. It's one of the best things about her.",
    tag: "MEMORY / CHARACTER / RECURRING",
    image: "/papiya_2.jpg",
  },
];

// ─── CHAOS ANALYTICS ─────────────────────────────────────────────────────────

export const HUNGER_ANGER_DATA = [
  { hunger: 1, anger: 1.2 }, { hunger: 2, anger: 2.3 }, { hunger: 3, anger: 3.1 },
  { hunger: 4, anger: 4.2 }, { hunger: 5, anger: 5.5 }, { hunger: 6, anger: 6.3 },
  { hunger: 7, anger: 7.4 }, { hunger: 8, anger: 8.2 }, { hunger: 9, anger: 9.4 },
  { hunger: 10, anger: 10  }, { hunger: 3, anger: 3.0 }, { hunger: 7, anger: 7.1 },
  { hunger: 5, anger: 5.3 }, { hunger: 8, anger: 8.5 }, { hunger: 6, anger: 6.7 },
];

export const HOURLY_DRAMA = [
  { hour: 0,  val: 1.0 }, { hour: 1,  val: 1.2 }, { hour: 2,  val: 4.9 },
  { hour: 3,  val: 3.5 }, { hour: 4,  val: 1.0 }, { hour: 5,  val: 0.4 },
  { hour: 6,  val: 0.4 }, { hour: 7,  val: 0.6 }, { hour: 8,  val: 0.8 },
  { hour: 9,  val: 1.0 }, { hour: 10, val: 1.2 }, { hour: 11, val: 1.4 },
  { hour: 12, val: 1.2 }, { hour: 13, val: 3.8 }, { hour: 14, val: 2.5 },
  { hour: 15, val: 1.8 }, { hour: 16, val: 1.5 }, { hour: 17, val: 1.3 },
  { hour: 18, val: 1.8 }, { hour: 19, val: 2.2 }, { hour: 20, val: 2.8 },
  { hour: 21, val: 3.4 }, { hour: 22, val: 4.2 }, { hour: 23, val: 4.8 },
];

export const WEEKLY_EMOTIONAL = [
  { day: "MON", val: 5.5 }, { day: "TUE", val: 4.0 }, { day: "WED", val: 7.8 },
  { day: "THU", val: 4.5 }, { day: "FRI", val: 8.5 }, { day: "SAT", val: 9.2 },
  { day: "SUN", val: 3.0 },
];

export const ANALYTICS_STATS = [
  { label: "HUNGER → ANGER CORRELATION", value: "R² = 0.97",  sub: "p < 0.001 · practically causal · chicken shortage: multiplier effect" },
  { label: "PEAK CHAOS WINDOW",           value: "01:00–04:00", sub: "overlap with 'just one more thing' and Hrithik Roshan films" },
  { label: "SLEEP DEBT (CUMULATIVE)",     value: "~2,400 hrs",  sub: "compounding since 2019 · no signs of stopping" },
  { label: "LOYALTY INDEX",               value: "×100 AH",     sub: "AH = Afghan Hound units · verified by the 2015 restaurant dataset" },
];

// ─── TIME VISUALIZATION ───────────────────────────────────────────────────────

export const TIME_UNITS = [
  { id: "earth",      label: "EARTH YEARS",        compute: (ms: number) => (ms / (365.25 * 24 * 3600 * 1000)).toFixed(6),                                  unit: "yr"     },
  { id: "mercury",    label: "MERCURY YEARS",       compute: (ms: number) => (ms / (87.97  * 24 * 3600 * 1000)).toFixed(4),                                  unit: "Hg-yr"  },
  { id: "dog",        label: "DOG YEARS",           compute: (ms: number) => ((ms / (365.25 * 24 * 3600 * 1000)) * 7).toFixed(2),                            unit: "d-yr"   },
  { id: "afghan",     label: "AFGHAN HOUNDS",       compute: (ms: number) => Math.floor(ms / (365.25 * 24 * 3600 * 1000) * 100).toLocaleString(),            unit: "loyalty"},
  { id: "heartbeats", label: "HEARTBEATS",          compute: (ms: number) => Math.floor((ms / 60000) * 70).toLocaleString(),                                 unit: "BPM×t"  },
  { id: "frooty",     label: "FROOTY BOTTLES (EST.)",compute: (ms: number) => Math.floor(ms / (24 * 3600 * 1000) * 1.5).toLocaleString(),                   unit: "bottles"},
  { id: "tiramisu",   label: "TIRAMISU SERVINGS",   compute: (ms: number) => Math.floor(ms / (365.25 * 24 * 3600 * 1000) * 365 * 0.3).toLocaleString(),     unit: "slices" },
  { id: "cosmic",     label: "% OF UNIVERSE AGE",   compute: (ms: number) => ((ms / (13.8e9 * 365.25 * 24 * 3600 * 1000)) * 100).toExponential(4),          unit: "%"      },
];

// ─── BIRTHDAY ENDING ──────────────────────────────────────────────────────────

export const BIRTHDAY_MESSAGE = {
  systemLine: "OVERRIDING industrial_protocol.exe — switching to human_mode.v1",
  lines: [
    "Happy birthday to the person who was late to school as a government promise.",
    "",
    "I waited.",
    "Eventually, I left.",
    "",
    "You arrived just in time to be denied entry and deduct 100 friendship points from my account.",
    "",
    "I accepted the penalty with dignity.",
    "",
    "Or at least something that looked enough like dignity from a distance.",
    "",
    "There was also the incident with the guy who came to my house because I told you to block him.",
    "",
    "He arrived furious.",
    "I opened the door already regretting my involvement in your life.",
    "",
    "For a brief moment, it felt like one of us should apologize.",
    "",
    "Neither of us did.",
    "",
    "He left.",
    "History justified the decision.",
    "",
    "Baboon told you I wasn't a good guy.",
    "",
    "Your friends, especially.",
    "Very committed to the campaign.",
    "",
    "And yet, somehow, here we are.",
    "",
    "In 2015, you spent Rs. 2,100 to rescue my dignity.",
    "",
    "Since then, you've conveniently forgotten how to pay when we eat together.",
    "",
    "But you didn't hesitate that day.",
    "You have never once hesitated when it was me.",
    "That is the whole thing about you.",
    "",
    "At some point, patterns stop being accidents.",
    "",
    "Then there was December 2023 —",
    "your first official step toward becoming an NRI.",
    "",
    "You found tiramisu faster than you found your supervisor's office,",
    "which felt deeply consistent with the rest of your life.",
    "",
    "You have always moved through the world like this:",
    "slightly late,",
    "slightly dramatic,",
    "hungry at inappropriate times,",
    "completely unbothered by consequences,",
    "and somehow still dependable when it matters.",
    "",
    "That's the part people miss about you.",
    "",
    "Under all the chaos,",
    "all the mood swings,",
    "all the theatrical suffering,",
    "there is somebody impossibly loyal.",
    "",
    "The kind of person who stays.",
    "",
    "No matter how many better options exist.",
    "No matter how many opinions people have.",
    "No matter how loudly the world insists otherwise.",
    "",
    "Not even Shrinjayee Das stood a chance against that level of inevitability.",
    "",
    "You are stubborn in ways that should probably be studied professionally.",
    "",
    "You remove the chicken from a perfectly good plate of curry with the concentration of a surgeon,",
    "and with complete moral certainty.",
    "",
    "You dance like embarrassment is a problem invented for other people.",
    "",
    "And after all these years,",
    "you are still one of the warmest, strangest, most reliable people I know.",
    "",
    "Twenty-seven years of you feels statistically unlikely,",
    "but somehow exactly right.",
    "",
    "Happy birthday, Tumpa.",
    "",
    "Against all available evidence, you've remained one of my favourite people.",
    "",
    "Sorry, I remember intricate events that shouldn't matter to you anyway.",
    "",
    "Love you bro, Even when you're late.",
    "",
    "Maybe especially then.",
  ],
  closing: "— Jeemut, May 2026",
};

// ─── RIGHT NOW (hourly live status) ──────────────────────────────────────────

export type RightNowBlock = {
  hours: number[];
  icon: "moon" | "zzz" | "alarm" | "wave" | "fork" | "chicken" | "nap" | "wake" | "sparkle" | "night";
  label: string;
  description: string;
  accent: "lime" | "pink" | "blue" | "orange" | "yellow";
};

export const RIGHT_NOW_DATA: RightNowBlock[] = [
  {
    hours: [0, 1, 2],
    icon: "night",
    label: "MIDNIGHT OPERATIONS",
    description: "Spiral-texting someone about the nature of time. A LIIT may or may not be involved. The decisions made right now will be reviewed at 9am with full regret.",
    accent: "blue",
  },
  {
    hours: [3, 4, 5, 6],
    icon: "zzz",
    label: "SLEEP WINDOW (FINALLY)",
    description: "Asleep. The alarm is set for 3 hours from now. This will not help. The snooze button has already been forgiven in advance.",
    accent: "yellow",
  },
  {
    hours: [7, 8],
    icon: "alarm",
    label: "ALARM INCIDENT",
    description: "The alarm has been silenced. Multiple times. The body has not moved. The alarm has lost. This is not a surprise to anyone involved.",
    accent: "orange",
  },
  {
    hours: [9, 10],
    icon: "wave",
    label: "TRANSITIONAL STATE",
    description: "Horizontal but technically awake. 'On my way' was sent 40 minutes ago. This was aspirational. Current location: same.",
    accent: "pink",
  },
  {
    hours: [11, 12],
    icon: "fork",
    label: "PRE-LUNCH DETERIORATION",
    description: "Hungry. Committed to finishing one more task. The task has become five tasks. The hunger is becoming structural. ETA to eating: unknown.",
    accent: "orange",
  },
  {
    hours: [13, 14],
    icon: "chicken",
    label: "CULINARY OPERATIONS",
    description: "Carefully extracting all chicken from lunch with the focus of a neurosurgeon. The remainder of the meal will be perfect. This process cannot be rushed.",
    accent: "lime",
  },
  {
    hours: [15, 16],
    icon: "nap",
    label: "THE 20-MINUTE NAP",
    description: "A nap has been initiated. 'Just 20 minutes' was stated with full sincerity. Current elapsed time: unknown. ETA: 3 hours minimum.",
    accent: "blue",
  },
  {
    hours: [17, 18],
    icon: "wake",
    label: "RECOVERY PHASE",
    description: "Woke up from the 20-minute nap. It has been 3 hours. The evening has quietly begun without her. She is processing this.",
    accent: "yellow",
  },
  {
    hours: [19, 20, 21],
    icon: "sparkle",
    label: "GETTING READY",
    description: "Getting ready to go out. Will be 20 minutes late. Everyone involved has already adjusted their expectations accordingly. The wardrobe is open.",
    accent: "pink",
  },
  {
    hours: [22, 23],
    icon: "moon",
    label: "NIGHT PROTOCOL ACTIVE",
    description: "Most vocal or most silent person in the room. No instrument can determine which. The mode switches without announcement or pattern.",
    accent: "lime",
  },
];

// ─── CHAOS WEATHER (daily, day-of-week driven) ───────────────────────────────

export type WeatherIcon = "storm" | "cloud" | "crisis" | "clear" | "chaos" | "dance" | "dread";

export type ChaosWeatherDay = {
  forecast: string;
  icon: WeatherIcon;
  temp: string;
  conditions: { label: string; value: string }[];
};

// Index 0 = Sunday … 6 = Saturday
export const CHAOS_WEATHER: ChaosWeatherDay[] = [
  {
    forecast: "PRE-MONDAY ANXIETY",
    icon: "dread",
    temp: "COLD OPEN",
    conditions: [
      { label: "DREAD INDEX", value: "CRITICAL" },
      { label: "SUNDAY SCARIES", value: "ACTIVE" },
      { label: "MOTIVATION", value: "0%" },
    ],
  },
  {
    forecast: "STORM ADVISORY",
    icon: "storm",
    temp: "VOLATILE",
    conditions: [
      { label: "DRAMA PRESSURE", value: "HIGH" },
      { label: "TIRAMISU NEEDED", value: "YES" },
      { label: "APPROACH WITH", value: "CAUTION" },
    ],
  },
  {
    forecast: "PARTLY DRAMATIC",
    icon: "cloud",
    temp: "MILD CHAOS",
    conditions: [
      { label: "WARDROBE OVERFLOW", value: "MODERATE" },
      { label: "NAP RISK", value: "60%" },
      { label: "FROOTY SUPPLY", value: "RECOMMENDED" },
    ],
  },
  {
    forecast: "MIDWEEK CRISIS",
    icon: "crisis",
    temp: "PEAK VARIANCE",
    conditions: [
      { label: "CHAOS INDEX", value: "ELEVATED" },
      { label: "EMOTIONAL SPIKE", value: "IMMINENT" },
      { label: "STATUS", value: "SEND HELP" },
    ],
  },
  {
    forecast: "CLEARING",
    icon: "clear",
    temp: "IMPROVING",
    conditions: [
      { label: "RECOVERY", value: "IN PROGRESS" },
      { label: "FROOTY", value: "RECOMMENDED" },
      { label: "MOOD", value: "ACCEPTABLE" },
    ],
  },
  {
    forecast: "MAXIMUM CHAOS",
    icon: "chaos",
    temp: "HOT",
    conditions: [
      { label: "NIGHT MODE", value: "ACTIVATES 22:00" },
      { label: "LIIT RISK", value: "ELEVATED" },
      { label: "WARDROBE CHANGE", value: "IMMINENT" },
    ],
  },
  {
    forecast: "DANCE FLOOR CONDITIONS",
    icon: "dance",
    temp: "PEAK PAPIYA",
    conditions: [
      { label: "OPTIMAL FOR", value: "DANCING" },
      { label: "TIRAMISU", value: "MANDATORY" },
      { label: "CONSEQUENCES", value: "IGNORED" },
    ],
  },
];

// ─── MOOD ORB ─────────────────────────────────────────────────────────────────

export type MoodId = "chaos" | "fine" | "quiet" | "drama" | "tiramisu";

export type MoodOption = {
  id: MoodId;
  label: string;
  symbol: string;
  color: "lime" | "pink" | "blue" | "orange" | "yellow";
  sub: string;
};

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "chaos",     label: "CHAOS MODE",      symbol: "◈", color: "orange", sub: "running on spite and momentum"      },
  { id: "fine",      label: "FINE. (I'M FINE.)", symbol: "◉", color: "lime",   sub: "technically okay. probably."       },
  { id: "quiet",     label: "QUIET MODE",      symbol: "○", color: "blue",   sub: "not unavailable. just not here."   },
  { id: "drama",     label: "DRAMA QUEEN",     symbol: "◆", color: "pink",   sub: "something happened. it was a lot." },
  { id: "tiramisu",  label: "TIRAMISU NEEDED", symbol: "◇", color: "yellow", sub: "self-explanatory. send tiramisu."  },
];
