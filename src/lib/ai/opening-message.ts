import { executeWithModelFallback } from "./config";
import type { ChatContext } from "./agent";

// In-memory set of seen message hashes with an LRU ring buffer for duplicate prevention
const seenHashes = new Set<string>();
const sessionSeenHashes = new Map<string, Set<string>>();

/**
 * Asynchronous cryptographic hash generator for message canonicalization and duplicate prevention.
 * Uses crypto.subtle.digest ("SHA-256") to produce a deterministic hex digest.
 */
export async function computeMessageHash(text: string): Promise<string> {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hasSeenOpeningMessage(hash: string, sessionId?: string): boolean {
  if (seenHashes.has(hash)) return true;
  if (sessionId && sessionSeenHashes.get(sessionId)?.has(hash)) return true;
  return false;
}

export function storeOpeningMessageHash(hash: string, sessionId?: string): void {
  seenHashes.add(hash);
  if (sessionId) {
    if (!sessionSeenHashes.has(sessionId)) {
      sessionSeenHashes.set(sessionId, new Set());
    }
    sessionSeenHashes.get(sessionId)?.add(hash);
    // Cleanup old sessions if map grows too large
    if (sessionSeenHashes.size > 2000) {
      const oldestSession = sessionSeenHashes.keys().next().value;
      if (oldestSession) sessionSeenHashes.delete(oldestSession);
    }
  }

  // Cap global size to prevent unbounded memory growth
  if (seenHashes.size > 5000) {
    const firstItem = seenHashes.values().next().value;
    if (firstItem) seenHashes.delete(firstItem);
  }
}

// Diverse, high-craft context-aware fallback pool if API quota is reached
const CONTEXT_FALLBACK_POOL: Record<string, string[]> = {
  portfolio: [
    "Form only commands enduring attention when every detail answers to unmistakable intent.",
    "True visual identity is not decorative styling, but the structural voice of a brand.",
    "Precision in typography and composition turns visual noise into memorable authority.",
    "A great portfolio is proof of problems solved with clarity, conviction, and restraint.",
  ],
  services: [
    "Design systems endure when visual elegance is engineered for seamless scalability.",
    "Art direction elevates ideas by finding the precise visual tension that commands curiosity.",
    "Strategic branding transforms business ambition into unmistakable cultural resonance.",
    "Every brand rollout succeeds on the harmony between bold concept and meticulous execution.",
  ],
  contact: [
    "Enduring collaborations begin with an honest question and a shared commitment to craft.",
    "Transforming complex brand challenges into clear visual direction begins with conversation.",
    "Great work is forged where deep strategic curiosity meets rigorous visual standards.",
    "When ambition meets disciplined execution, original brands come to life.",
  ],
  credentials: [
    "Six years of consistent creative execution build trust across industries and continents.",
    "Creative credibility is earned through delivered impact, not fleeting trends.",
    "Craftsmanship is the compounding interest of every deliberate design decision.",
  ],
  default: [
    "Direction is the discipline that turns raw ambition into enduring form.",
    "Simplicity is not the absence of clutter, but the mastery of proportion and clarity.",
    "Design with intent, build with precision, and let the work speak for itself.",
    "Originality begins where conventional compromises end.",
    "Every visual system must earn its right to exist through purpose and restraint.",
    "A brand gains authority not by shouting louder, but by communicating with absolute clarity.",
  ],
};

async function getUnseenFallbackMessage(category: string, sessionId?: string): Promise<string> {
  const pool = CONTEXT_FALLBACK_POOL[category] || CONTEXT_FALLBACK_POOL.default;
  for (const message of pool) {
    const hash = await computeMessageHash(message);
    if (!hasSeenOpeningMessage(hash, sessionId)) {
      storeOpeningMessageHash(hash, sessionId);
      return message;
    }
  }
  // If all pool items have been seen, pick random and return
  const fallback = pool[Math.floor(Math.random() * pool.length)];
  return fallback.replace(/\*/g, "");
}

export function sanitizeTextWithoutAsterisks(text: string): string {
  return text.replace(/\*/g, "").trim();
}

export async function generateOpeningMessage(
  sessionId?: string,
  context?: ChatContext,
): Promise<{
  message: string;
  isFresh: boolean;
  modelUsed: string;
}> {
  const requestId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Determine contextual angle based on current visitor journey
  let contextSubject = "creative vision, design craft, and deliberate brand direction";
  let fallbackKey = "default";

  if (context?.projectTitle || context?.projectSlug) {
    contextSubject = `case study deep-dives, visual systems, and bespoke art direction for "${context.projectTitle || context.projectSlug}"`;
    fallbackKey = "portfolio";
  } else if (context?.pathname?.includes("/portfolio")) {
    contextSubject = "portfolio curation, brand identity rollouts, and visual design craftsmanship";
    fallbackKey = "portfolio";
  } else if (context?.pathname?.includes("/services")) {
    contextSubject =
      "creative services, full brand systems, art direction, and digital design strategy";
    fallbackKey = "services";
  } else if (context?.pathname?.includes("/contact")) {
    contextSubject = "creative collaboration, scoping ambitious briefs, and strategic partnerships";
    fallbackKey = "contact";
  } else if (context?.pathname?.includes("/credentials")) {
    contextSubject =
      "creative track record, enterprise client impact, and multi-year design discipline";
    fallbackKey = "credentials";
  }

  const systemPrompt = `You are a world-class Creative Director representing Edmundo Kutuzov.
Generate a single, highly sophisticated, thought-provoking motivational sentence about ${contextSubject}.

STRICT FORMATTING & STYLISTIC RULES:
- Exactly ONE sentence.
- Max 18 words.
- ABSOLUTE PROHIBITION ON ASTERISKS: Never output any asterisk character (*) for any reason.
- Do NOT use quotation marks.
- Do NOT use cliché corporate hype, generic cheerleading, or empty buzzwords.
- Tone: Intellectually sharp, visually articulate, calm, architectural, and inspiring.`;

  try {
    const { result, diagnostics } = await executeWithModelFallback(
      requestId,
      sessionId,
      async (ai, modelName) => {
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          attempts++;
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate a distinct, fresh motivational thought for this session (attempt ${attempts}, seed: ${Math.random().toString(36).slice(2, 6)}).`,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.95 + attempts * 0.05,
            },
          });

          const rawText = sanitizeTextWithoutAsterisks(
            (response.text || "").replace(/["']/g, "").trim(),
          );
          if (!rawText || rawText.length < 10) continue;

          const hash = await computeMessageHash(rawText);
          if (!hasSeenOpeningMessage(hash, sessionId)) {
            storeOpeningMessageHash(hash, sessionId);
            return { message: rawText, isFresh: true };
          }
        }

        // If generation returned seen messages, generate with explicit high entropy
        const fallbackGen = await ai.models.generateContent({
          model: modelName,
          contents:
            "Provide a rare, deeply insightful axiom on creative integrity, restraint, and visual execution.",
          config: {
            systemInstruction: systemPrompt,
            temperature: 1.0,
          },
        });
        const finalCandidate = sanitizeTextWithoutAsterisks(
          (fallbackGen.text || "").replace(/["']/g, "").trim(),
        );

        if (finalCandidate && finalCandidate.length >= 10) {
          const finalHash = await computeMessageHash(finalCandidate);
          storeOpeningMessageHash(finalHash, sessionId);
          return { message: finalCandidate, isFresh: true };
        }

        const poolFallback = await getUnseenFallbackMessage(fallbackKey, sessionId);
        return { message: poolFallback, isFresh: true };
      },
    );

    return {
      message: sanitizeTextWithoutAsterisks(result.message),
      isFresh: result.isFresh,
      modelUsed: diagnostics.modelUsed,
    };
  } catch (error) {
    console.error(
      "[Opening Message] Error during dynamic generation, using contextual fallback:",
      error,
    );
    const poolFallback = await getUnseenFallbackMessage(fallbackKey, sessionId);
    return {
      message: sanitizeTextWithoutAsterisks(poolFallback),
      isFresh: false,
      modelUsed: "fallback_pool",
    };
  }
}
