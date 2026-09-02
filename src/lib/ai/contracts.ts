/**
 * Structured Response Contract & Type Definitions for AI Agent Architecture
 * Shared across server-side AI modules, route handlers, and client consumers.
 */

export interface ChatContext {
  pathname?: string;
  projectSlug?: string;
  projectTitle?: string;
  previousPage?: string;
  selectedCategory?: string;
  sessionId?: string;
  userLanguage?: "en" | "pt" | string;
  clientTimezone?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp?: number;
  id?: string;
}

export interface NormalizedProjectSummary {
  id: string;
  title: string;
  client: string;
  year?: string;
  category?: string;
  discipline?: string;
  description?: string;
  thumbnail?: string;
  slug: string;
  tags?: string[];
  role?: string;
  featured?: boolean;
}

export interface ActionEvent {
  action: string;
  projectSlug?: string | null;
  payload?: Record<string, string | number | boolean | null>;
}

export interface StreamError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Server-Sent Event (SSE) Stream Contract
 */
export type StreamEvent =
  | { type: "chunk"; text: string }
  | { type: "projects"; projects: NormalizedProjectSummary[] }
  | { type: "project_detail"; project: Record<string, unknown> }
  | {
      type: "action";
      action: string;
      projectSlug?: string | null;
      payload?: Record<string, string | number | boolean | null>;
    }
  | { type: "status"; message: string }
  | { type: "session_update"; sessionId: string; contextSummary?: Record<string, unknown> }
  | { type: "done"; modelUsed: string; latencyMs?: number }
  | { type: "error"; error: StreamError };

/**
 * In-Memory Session Memory & Visitor Profile
 */
export interface SessionTurn {
  id: string;
  timestamp: number;
  userText: string;
  assistantText: string;
  toolsUsed?: string[];
  action?: string;
}

export interface VisitorProfile {
  detectedIntent?: "hire" | "explore" | "collaborate" | "general";
  preferredLanguage?: "en" | "pt";
  viewedProjects: string[];
  interestedCategories: string[];
  briefInProgress?: boolean;
  briefSummary?: Record<string, unknown>;
}

export interface SessionRecord {
  sessionId: string;
  createdAt: number;
  updatedAt: number;
  context: ChatContext;
  profile: VisitorProfile;
  turns: SessionTurn[];
  conversationSummary?: string;
}
