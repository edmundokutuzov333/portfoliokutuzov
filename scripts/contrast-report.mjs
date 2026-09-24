const TOKENS = {
  betao: "#d6d4ce",
  cal: "#f2f2ef",
  preto: "#000000",
  chapa: "#3f3e3b",
  fumo: "#b9b7b0",
  workDefault: "#2f4bff",
  live: "#4ade80",
};

function rgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16) / 255);
}

function linear(value) {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const pairs = [
  ["Cal on Preto", TOKENS.cal, TOKENS.preto],
  ["Fumo on Preto", TOKENS.fumo, TOKENS.preto],
  ["Preto on Betao", TOKENS.preto, TOKENS.betao],
  ["Chapa on Betao", TOKENS.chapa, TOKENS.betao],
  ["Preto on Cal", TOKENS.preto, TOKENS.cal],
  ["Chapa on Cal", TOKENS.chapa, TOKENS.cal],
  ["Live on Preto", TOKENS.live, TOKENS.preto],
  ["Live on Chapa", TOKENS.live, TOKENS.chapa],
  ["Work default on Cal", TOKENS.workDefault, TOKENS.cal],
];

const failures = [];
for (const [label, foreground, background] of pairs) {
  const ratio = contrast(foreground, background);
  console.log(label.padEnd(24) + ratio.toFixed(2));
  if (ratio < 4.5) failures.push(label);
}

if (failures.length) {
  console.error("AA failures:", failures.join(", "));
  process.exit(1);
}

console.log("AA contrast gate: PASS");
