import type { Quest } from "./store";

const WOODS_LETTERS = [
  { l: "m", w: "map", ph: ["m", "a", "p"] }, { l: "s", w: "sat", ph: ["s", "a", "t"] },
  { l: "a", w: "ant", ph: ["a", "n", "t"] }, { l: "t", w: "top", ph: ["t", "o", "p"] },
  { l: "p", w: "pan", ph: ["p", "a", "n"] }, { l: "n", w: "net", ph: ["n", "e", "t"] },
  { l: "c", w: "cup", ph: ["c", "u", "p"] }, { l: "r", w: "rat", ph: ["r", "a", "t"] },
  { l: "d", w: "dog", ph: ["d", "o", "g"] }, { l: "f", w: "fin", ph: ["f", "i", "n"] }
];
const BRIDGE_WORDS = ["cat", "pin", "hot", "bed", "cup", "dog", "map", "van", "box", "lip"];
const BRIDGE_NONCE = ["vop", "zib", "lat", "pem", "sut", "gop", "mib", "dax", "feb", "rul"];
const CAVE_DIGRAPHS = [
  { d: "sh", w: "ship", ph: ["sh", "i", "p"] }, { d: "ch", w: "chip", ph: ["ch", "i", "p"] },
  { d: "th", w: "thin", ph: ["th", "i", "n"] }, { d: "wh", w: "whip", ph: ["wh", "i", "p"] },
  { d: "ck", w: "sock", ph: ["s", "o", "ck"] }, { d: "ng", w: "sing", ph: ["s", "i", "ng"] },
  { d: "sh", w: "shop", ph: ["sh", "o", "p"] }, { d: "ch", w: "chat", ph: ["ch", "a", "t"] },
  { d: "th", w: "bath", ph: ["b", "a", "th"] }, { d: "ee", w: "feet", ph: ["f", "ee", "t"] }
];

function woodsQuest(i: number): Quest {
  const f = WOODS_LETTERS[i % WOODS_LETTERS.length];
  const g = WOODS_LETTERS[(i + 3) % WOODS_LETTERS.length];
  return {
    id: `woods-${i + 1}`,
    region: "woods",
    title: `Whisper ${i + 1}: The ${f.l.toUpperCase()} Trail`,
    story: `Pip the fox hears /${f.l}/ in the leaves. Help wake the sound.`,
    skill: "letter-sound",
    minutes: 12,
    items: [
      { id: `w${i}-1`, kind: "sound-match", skill: "letter-sound", instruction: "Tap the letter that makes this sound.", prompt: `/${f.l}/ as in ${f.w}`, target: f.l, choices: [f.l, g.l, "o", "e"], hint: `It is the first sound in ${f.w}.`, phonemes: [f.l] },
      { id: `w${i}-2`, kind: "segment-tap", skill: "segmenting", instruction: "Tap once for each sound you hear.", prompt: f.w, target: String(f.ph.length), phonemes: f.ph, hint: `Slow down: ${f.ph.join("... ")}.`, choices: ["2", "3", "4"] },
      { id: `w${i}-3`, kind: "tile-blend", skill: "blending", instruction: "Build the word. Tap each tile to hear it.", prompt: f.w, target: f.w, tiles: [...f.ph], hint: `First sound is /${f.ph[0]}/.`, phonemes: f.ph },
      { id: `w${i}-4`, kind: "spell-cast", skill: "spelling", instruction: "Spell the word to cast the spell.", prompt: f.w, target: f.w, tiles: [...f.ph, g.l].sort(), hint: `It starts with ${f.l}.`, phonemes: f.ph },
      { id: `w${i}-5`, kind: "sound-match", skill: "phonemic-awareness", instruction: "Which word starts with the same sound?", prompt: f.w, target: f.w, choices: [f.w, g.w, "ox"], hint: "Say both words slowly.", phonemes: f.ph },
      { id: `w${i}-6`, kind: "boss-battle", skill: "fluency", instruction: "Read each word with Moss the boss.", prompt: "boss-list", target: `${f.w}|${g.w}|am`, passage: `${f.w} ${g.w} am`, hint: "Take your time. There is no timer.", phonemes: [] }
    ]
  };
}

function bridgeQuest(i: number): Quest {
  const w = BRIDGE_WORDS[i % BRIDGE_WORDS.length];
  const n = BRIDGE_NONCE[i % BRIDGE_NONCE.length];
  const ph = w.split("");
  return {
    id: `bridge-${i + 1}`,
    region: "bridge",
    title: `Plank ${i + 1}: Cross with ${w}`,
    story: `The bridge wobbles. Blend each sound to step forward.`,
    skill: "blending",
    minutes: 15,
    items: [
      { id: `b${i}-1`, kind: "tile-blend", skill: "blending", instruction: "Push the sounds together.", prompt: w, target: w, tiles: [...ph], hint: `Sound it out: ${ph.join("... ")}.`, phonemes: ph },
      { id: `b${i}-2`, kind: "segment-tap", skill: "segmenting", instruction: "How many sounds in this silly word?", prompt: n, target: "3", choices: ["2", "3", "4"], phonemes: n.split(""), nonsense: true, hint: "Every silly word still has sounds." },
      { id: `b${i}-3`, kind: "sound-match", skill: "letter-sound", instruction: "Hear the middle sound. Find the letter.", prompt: `/${ph[1]}/ in ${w}`, target: ph[1], choices: [ph[1], "x", "q", "z"], hint: `Say ${w} very slowly.`, phonemes: [ph[1]] },
      { id: `b${i}-4`, kind: "spell-cast", skill: "spelling", instruction: `Spell the silly word ${n}.`, prompt: n, target: n, tiles: [...n.split(""), "x"].sort(), nonsense: true, hint: "Silly words follow the same rules.", phonemes: n.split("") },
      { id: `b${i}-5`, kind: "spell-cast", skill: "spelling", instruction: `Spell ${w}.`, prompt: w, target: w, tiles: [...ph, "e"].sort(), hint: `It starts with ${ph[0]}.`, phonemes: ph },
      { id: `b${i}-6`, kind: "boss-battle", skill: "fluency", instruction: "Boss Fluency Battle. Read with a friend.", prompt: "boss-list", target: `${w}|${n}|it`, passage: `${w} ${n} it`, hint: "The boss retreats if you keep trying.", phonemes: [] }
    ]
  };
}

function cavesQuest(i: number): Quest {
  const c = CAVE_DIGRAPHS[i % CAVE_DIGRAPHS.length];
  return {
    id: `caves-${i + 1}`,
    region: "caves",
    title: `Crystal ${i + 1}: The ${c.d} Glow`,
    story: `Two letters, one sound. Light the ${c.d} crystal.`,
    skill: "spelling",
    minutes: 15,
    items: [
      { id: `c${i}-1`, kind: "sound-match", skill: "letter-sound", instruction: `Find the team that says /${c.d}/.`, prompt: `/${c.d}/ as in ${c.w}`, target: c.d, choices: [c.d, c.d[0], "s", "t"], hint: "Two letters work as a team.", phonemes: [c.d] },
      { id: `c${i}-2`, kind: "tile-blend", skill: "blending", instruction: "Blend the team sound with the rest.", prompt: c.w, target: c.w, tiles: [...c.ph], hint: `Say ${c.ph.join("-")} fast.`, phonemes: c.ph },
      { id: `c${i}-3`, kind: "segment-tap", skill: "segmenting", instruction: `How many sounds in ${c.w}?`, prompt: c.w, target: "3", choices: ["2", "3", "4"], hint: "The team counts as one sound.", phonemes: c.ph },
      { id: `c${i}-4`, kind: "spell-cast", skill: "spelling", instruction: `Spell ${c.w}.`, prompt: c.w, target: c.w, tiles: [...c.w.split(""), "x"].sort(), hint: `Remember the ${c.d} team.`, phonemes: c.ph },
      { id: `c${i}-5`, kind: "spell-cast", skill: "spelling", instruction: "Spell a silly team word: zosh.", prompt: "zosh", target: "zosh", tiles: ["z", "o", "s", "h", "sh"], nonsense: true, hint: "/sh/ is spelled s-h.", phonemes: ["z", "o", "sh"] },
      { id: `c${i}-6`, kind: "boss-battle", skill: "fluency", instruction: "Read the crystal words.", prompt: "boss-list", target: `${c.w}|shop|she`, passage: `${c.w} shop she`, hint: "Slow and smooth wins.", phonemes: [] }
    ]
  };
}

export const QUESTS: Quest[] = [
  ...Array.from({ length: 10 }, (_, i) => woodsQuest(i)),
  ...Array.from({ length: 10 }, (_, i) => bridgeQuest(i)),
  ...Array.from({ length: 10 }, (_, i) => cavesQuest(i))
];

export const REGIONS = [
  { id: "woods", name: "Whispering Woods", desc: "Letter sounds and hearing sounds.", color: "#2E7D5B", emoji: "🌲" },
  { id: "bridge", name: "Blending Bridge", desc: "Push sounds into CVC words.", color: "#2E86C1", emoji: "🌉" },
  { id: "caves", name: "Crystal Caves", desc: "Digraph teams like sh and ch.", color: "#6C3CE0", emoji: "💎" }
] as const;
