import { ChatContext, SessionRecord, SessionTurn, VisitorProfile } from "./contracts";

// In-memory sliding session store with 2-hour TTL
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_TURNS_PER_SESSION = 30;

const sessions = new Map<string, SessionRecord>();

/**
 * Clean up expired sessions
 */
function pruneExpiredSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.updatedAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

/**
 * Retrieve or create a session record for a visitor
 */
export function getOrCreateSession(
  sessionId?: string,
  initialContext?: Partial<ChatContext>,
): SessionRecord {
  pruneExpiredSessions();

  const id = sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  let session = sessions.get(id);
  if (!session) {
    const profile: VisitorProfile = {
      detectedIntent: "explore",
      viewedProjects: initialContext?.projectSlug ? [initialContext.projectSlug] : [],
      interestedCategories: initialContext?.selectedCategory
        ? [initialContext.selectedCategory]
        : [],
      briefInProgress: false,
    };

    session = {
      sessionId: id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      context: {
        sessionId: id,
        ...initialContext,
      },
      profile,
      turns: [],
    };
    sessions.set(id, session);
  } else {
    // Update context
    session.updatedAt = Date.now();
    if (initialContext) {
      session.context = {
        ...session.context,
        ...initialContext,
        sessionId: id,
      };

      if (
        initialContext.projectSlug &&
        !session.profile.viewedProjects.includes(initialContext.projectSlug)
      ) {
        session.profile.viewedProjects.push(initialContext.projectSlug);
      }
      if (
        initialContext.selectedCategory &&
        !session.profile.interestedCategories.includes(initialContext.selectedCategory)
      ) {
        session.profile.interestedCategories.push(initialContext.selectedCategory);
      }
    }
  }

  return session;
}

/**
 * Record a completed user/assistant turn into session history
 */
export function recordTurn(
  sessionId: string,
  turn: {
    userText: string;
    assistantText: string;
    toolsUsed?: string[];
    action?: string;
  },
): void {
  const session = getOrCreateSession(sessionId);
  session.updatedAt = Date.now();

  const newTurn: SessionTurn = {
    id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    userText: turn.userText,
    assistantText: turn.assistantText,
    toolsUsed: turn.toolsUsed,
    action: turn.action,
  };

  session.turns.push(newTurn);

  if (session.turns.length > MAX_TURNS_PER_SESSION) {
    session.turns.shift();
  }

  // Detect visitor intent heuristics
  const textLower = turn.userText.toLowerCase();
  if (
    textLower.includes("hire") ||
    textLower.includes("quote") ||
    textLower.includes("cost") ||
    textLower.includes("brief") ||
    textLower.includes("budget") ||
    textLower.includes("timeline")
  ) {
    session.profile.detectedIntent = "hire";
  } else if (textLower.includes("collaborate") || textLower.includes("partner")) {
    session.profile.detectedIntent = "collaborate";
  }

  if (turn.action === "start_brief") {
    session.profile.briefInProgress = true;
  }
}

/**
 * Get recent session history as formatted context summary
 */
export function getSessionSummaryContext(sessionId?: string): string {
  if (!sessionId) return "";
  const session = sessions.get(sessionId);
  if (!session || session.turns.length === 0) return "";

  const recentTurns = session.turns.slice(-4);
  const turnsText = recentTurns
    .map(
      (t, idx) =>
        `Turn ${idx + 1}:\nUser: ${t.userText}\nAssistant: ${t.assistantText.substring(0, 200)}...`,
    )
    .join("\n\n");

  const viewed =
    session.profile.viewedProjects.length > 0
      ? `Viewed Projects: ${session.profile.viewedProjects.join(", ")}`
      : "";
  const categories =
    session.profile.interestedCategories.length > 0
      ? `Interested Categories: ${session.profile.interestedCategories.join(", ")}`
      : "";

  return `\nVISITOR SESSION MEMORY:
- Session ID: ${session.sessionId}
- Detected Intent: ${session.profile.detectedIntent || "explore"}
${viewed ? `- ${viewed}\n` : ""}${categories ? `- ${categories}\n` : ""}
Recent Exchanges:
${turnsText}`;
}

/**
 * Get active session
 */
export function getSession(sessionId: string): SessionRecord | undefined {
  return sessions.get(sessionId);
}
