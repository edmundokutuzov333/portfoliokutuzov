import { d as decodeProtectedHeader, c as createLocalJWKSet, j as jwtVerify } from "./jose.mjs";
import { M as McpServer, W as WebStandardStreamableHTTPServerTransport, o as objectFromShape, s as safeParseAsync, g as getParseErrorMessage, t as toJsonSchemaCompat } from "./modelcontextprotocol__sdk.mjs";
function applyForwardedOrigin(request, options) {
  const proto = options.trustForwardedProto ? firstForwardedValue(request, "x-forwarded-proto") : void 0;
  const host = options.trustForwardedHost ? firstForwardedValue(request, "x-forwarded-host") : void 0;
  if (proto === void 0 && host === void 0)
    return request;
  const url = new URL(request.url);
  let changed = false;
  if (proto !== void 0 && `${proto}:` !== url.protocol) {
    url.protocol = `${proto}:`;
    changed = true;
  }
  if (host !== void 0 && host !== url.host) {
    url.host = host;
    changed = true;
  }
  return changed ? new Request(url.href, request) : request;
}
function firstForwardedValue(request, header) {
  const value = request.headers.get(header)?.split(",")[0]?.trim();
  return value ? value : void 0;
}
function extractTextContent(content) {
  if (!content)
    return void 0;
  const text = content.filter((block) => block.type === "text").map((block) => block.text).join("\n").trim();
  return text.length > 0 ? text : void 0;
}
var ToolContext = class {
  #auth;
  constructor(auth) {
    this.#auth = auth;
  }
  /** Whether the in-flight tool call carries a verified auth context. */
  isAuthenticated() {
    return this.#auth !== void 0;
  }
  /** The verified bearer token, or `undefined` when unauthenticated. Pass it to downstream APIs; never return or log it. */
  getToken() {
    return this.#auth?.bearer.token;
  }
  /** The verified user id (the token `sub`), or `undefined`. */
  getUserId() {
    return this.#auth?.principal.sub;
  }
  /** The verified user email, or `undefined` when absent. */
  getUserEmail() {
    return this.#auth?.principal.email;
  }
  /** The verified OAuth `client_id`, or `undefined`. */
  getClientId() {
    return this.#auth?.principal.clientId;
  }
  /** The verified OAuth scopes, or `undefined` when unauthenticated. */
  getScopes() {
    return this.#auth?.principal.scopes;
  }
  /** The verified token issuer, or `undefined`. */
  getIssuer() {
    return this.#auth?.principal.issuer;
  }
  /**
   * The full verified JWT claims, or `undefined`. Use this for app/business
   * authorization on issuer-specific claims that have no dedicated accessor.
   */
  getClaims() {
    return this.#auth?.principal.claims;
  }
};
var LEVEL_RANK = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
function isLogLevel(value) {
  return typeof value === "string" && value in LEVEL_RANK;
}
var LOG_LEVEL_ENV_VAR = "LOVABLE_MCP_LOG_LEVEL";
function readEnvLevel() {
  try {
    const raw = typeof process !== "undefined" ? process.env?.[LOG_LEVEL_ENV_VAR] : void 0;
    const normalized = raw?.trim().toLowerCase();
    return isLogLevel(normalized) ? normalized : void 0;
  } catch {
    return void 0;
  }
}
var currentLevel = readEnvLevel() ?? "debug";
function setLogLevel(level) {
  currentLevel = level;
}
function parseLogLevel(raw) {
  const normalized = raw?.trim().toLowerCase();
  return isLogLevel(normalized) ? normalized : void 0;
}
function applyLogLevelFromEnv(raw) {
  setLogLevel(parseLogLevel(raw) ?? "debug");
}
function enabled(level) {
  return LEVEL_RANK[level] <= LEVEL_RANK[currentLevel];
}
function emit(level, method, event, fields) {
  if (!enabled(level))
    return;
  const message = `[mcp-js] ${event}`;
  if (fields)
    console[method](message, fields);
  else
    console[method](message);
}
var log = {
  error: (event, fields) => emit("error", "error", event, fields),
  warn: (event, fields) => emit("warn", "warn", event, fields),
  info: (event, fields) => emit("info", "info", event, fields),
  debug: (event, fields) => emit("debug", "debug", event, fields)
};
function describeError(err) {
  if (err instanceof Error) {
    const code = err.code;
    return { name: err.name, message: err.message, ...typeof code === "string" ? { code } : {} };
  }
  return { value: String(err) };
}
var DEFAULT_METRICS_ENDPOINT = "https://api.lovable.dev/v1/app-mcp-usage";
var METRICS_API_KEY_ENV_VAR = "LOVABLE_API_KEY";
function assertMetricsEndpoint(endpoint) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(`@lovable.dev/mcp-js: metrics.endpoint must be an absolute URL, got ${JSON.stringify(endpoint)}`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`@lovable.dev/mcp-js: metrics.endpoint must be http(s), got ${JSON.stringify(endpoint)}`);
  }
}
function resolveMetricsConfig(config = true) {
  const options = typeof config === "boolean" ? { enabled: config } : config;
  const endpoint = options.endpoint ?? DEFAULT_METRICS_ENDPOINT;
  assertMetricsEndpoint(endpoint);
  return Object.freeze({
    enabled: options.enabled ?? true,
    endpoint,
    headers: options.headers ?? {},
    apiKeyEnvVar: METRICS_API_KEY_ENV_VAR
  });
}
function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}
function isLocalHTTPHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}
function urlSafetyProblem(url) {
  const isAllowedHTTP = url.protocol === "http:" && isLocalHTTPHost(url.hostname);
  if (url.protocol !== "https:" && !isAllowedHTTP) {
    return "must use https://, except localhost development URLs";
  }
  if (url.username || url.password) {
    return "must not include credentials";
  }
  if (url.search || url.hash) {
    return "must not include query or fragment";
  }
  return void 0;
}
function parseSafeUrl(subject, raw, ErrorClass = Error) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new ErrorClass(`${subject} must be an absolute URL`);
  }
  const problem = urlSafetyProblem(url);
  if (problem) {
    throw new ErrorClass(`${subject} ${problem}`);
  }
  return url;
}
var OAUTH_PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";
var version = "0.20.1";
var JSON_HEADERS = { "Content-Type": "application/json" };
function headResponse(response) {
  return new Response(null, { status: response.status, statusText: response.statusText, headers: response.headers });
}
function methodNotAllowed(allow) {
  return new Response(JSON.stringify({ error: "method not allowed" }), {
    status: 405,
    headers: { ...JSON_HEADERS, Allow: allow }
  });
}
function resolveProtectedResource(auth, request, options) {
  if (auth.resource)
    return trimTrailingSlash(auth.resource);
  const path = resolveResourcePath(options.resourcePath, request);
  const resourceURL = new URL(path, request.url);
  resourceURL.search = "";
  resourceURL.hash = "";
  return trimTrailingSlash(resourceURL.toString());
}
function assertResourcePathShape(resourcePath, label = "resourcePath") {
  if (!resourcePath.startsWith("/") || resourcePath.startsWith("//") || resourcePath.includes("\\") || /(^|\/)\.\.(\/|$)/.test(resourcePath)) {
    throw new Error(
      `@lovable.dev/mcp-js: ${label} must be an absolute path beginning with "/" without ".." segments or backslashes (got ${JSON.stringify(resourcePath)})`
    );
  }
}
function resolveResourcePath(resourcePath, request) {
  if (resourcePath === void 0)
    return new URL(request.url).pathname;
  assertResourcePathShape(resourcePath);
  return resourcePath;
}
var SCOPE_NAME = "@lovable.dev/mcp-js";
var EVENT_NAME = "mcp.tool.invocation";
var SEVERITY_INFO = 9;
function strAttr(key, value) {
  return { key, value: { stringValue: value } };
}
function intAttr(key, value) {
  return { key, value: { intValue: String(Math.round(value)) } };
}
function toLogRecord(rec) {
  const attributes = [
    strAttr("event.name", EVENT_NAME),
    strAttr("mcp.method", rec.method),
    strAttr("mcp.outcome", rec.outcome),
    intAttr("mcp.duration_ms", rec.durationMs)
  ];
  if (rec.tool !== null)
    attributes.push(strAttr("mcp.tool", rec.tool));
  if (rec.reqBytes !== void 0)
    attributes.push(intAttr("mcp.request_size_bytes", rec.reqBytes));
  if (rec.resBytes !== void 0)
    attributes.push(intAttr("mcp.response_size_bytes", rec.resBytes));
  attributes.push(strAttr("mcp.stack", rec.stack));
  return {
    timeUnixNano: rec.timeUnixNano,
    observedTimeUnixNano: rec.timeUnixNano,
    severityNumber: SEVERITY_INFO,
    severityText: "INFO",
    body: { stringValue: EVENT_NAME },
    attributes
  };
}
function buildLogsPayload(records, server) {
  return JSON.stringify({
    resourceLogs: [
      {
        resource: {
          attributes: [
            strAttr("service.name", server.name),
            strAttr("service.version", server.version),
            strAttr("telemetry.sdk.name", SCOPE_NAME),
            strAttr("telemetry.sdk.version", version),
            strAttr("telemetry.sdk.language", "webjs")
          ]
        },
        scopeLogs: [
          {
            scope: { name: SCOPE_NAME, version },
            logRecords: records.map(toLogRecord)
          }
        ]
      }
    ]
  });
}
function nowUnixNano() {
  return `${Date.now()}000000`;
}
function nowMs() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
var NOOP_RECORDER = { async emit() {
} };
function createNoopRecorder() {
  return NOOP_RECORDER;
}
function readProcessEnv(name) {
  try {
    return typeof process !== "undefined" ? process.env?.[name] || void 0 : void 0;
  } catch {
    return void 0;
  }
}
var BaseMetricRecorder = class {
  constructor(config, server, deps = {}) {
    this.config = config;
    this.server = server;
    this.deps = deps;
    this.doFetch = deps.fetch ?? (typeof globalThis.fetch === "function" ? globalThis.fetch.bind(globalThis) : void 0);
    this.usesLovableEndpoint = config.endpoint === DEFAULT_METRICS_ENDPOINT;
    const headers = {};
    if (!this.usesLovableEndpoint) {
      for (const [key, value] of Object.entries(config.headers)) {
        if (key.toLowerCase() !== "content-type")
          headers[key] = value;
      }
    }
    headers["content-type"] = "application/json";
    this.baseHeaders = headers;
  }
  doFetch;
  usesLovableEndpoint;
  baseHeaders;
  apiKey;
  lazyLogLevelApplied = false;
  async emit(ev) {
    await this.applyLazyLogLevel();
    log.info("tool.invoked", {
      tool: ev.tool,
      method: ev.method,
      outcome: ev.outcome,
      durationMs: ev.durationMs,
      stack: this.stack,
      ...ev.errorText !== void 0 && { errorText: ev.errorText }
    });
    if (!this.config.enabled)
      return;
    if (!this.doFetch) {
      log.warn("metrics.disabled_no_fetch", { endpoint: this.config.endpoint });
      return;
    }
    const headers = { ...this.baseHeaders };
    if (this.usesLovableEndpoint) {
      const key = await this.resolveApiKey();
      if (!key) {
        log.warn("metrics.disabled_no_api_key", { envVar: this.config.apiKeyEnvVar, endpoint: this.config.endpoint });
        return;
      }
      headers.authorization = `Bearer ${key}`;
    }
    const body = buildLogsPayload([{ ...ev, timeUnixNano: nowUnixNano(), stack: this.stack }], this.server);
    try {
      const res = await this.doFetch(this.config.endpoint, { method: "POST", headers, body, keepalive: true });
      if (!res.ok)
        log.warn("metrics.rejected", { status: res.status, endpoint: this.config.endpoint });
    } catch (err) {
      log.warn("metrics.failed", { ...describeError(err), endpoint: this.config.endpoint });
    }
  }
  // Cache only a successful resolution so a miss is retried on the next emit (the
  // Cloudflare binding may not be readable on the very first attempt in an isolate).
  async resolveApiKey() {
    if (this.apiKey)
      return this.apiKey;
    this.apiKey = this.deps.getApiKey ? this.deps.getApiKey() : await this.readEnv(this.config.apiKeyEnvVar);
    return this.apiKey;
  }
  async applyLazyLogLevel() {
    if (this.lazyLogLevelApplied)
      return;
    this.lazyLogLevelApplied = true;
    applyLogLevelFromEnv(await this.readEnv(LOG_LEVEL_ENV_VAR));
  }
};
var cloudflareEnvPromise;
async function readCloudflareEnv(name) {
  try {
    const moduleSpecifier = "cloudflare:workers";
    cloudflareEnvPromise ??= import(
      /* @vite-ignore */
      moduleSpecifier
    ).then((m) => m.env).catch((err) => {
      log.debug("metrics.cloudflare_env_import_failed", describeError(err));
      return void 0;
    });
    const env = await cloudflareEnvPromise;
    const raw = env?.[name];
    const value = typeof raw === "string" && raw ? raw : void 0;
    log.debug("metrics.read_cloudflare_env", { name, hasEnvBinding: !!env, found: value !== void 0 });
    return value;
  } catch (err) {
    log.debug("metrics.read_cloudflare_env_error", { name, ...describeError(err) });
    return void 0;
  }
}
var TanStackMetricRecorder = class extends BaseMetricRecorder {
  stack = "tanstack";
  async readEnv(name) {
    return readProcessEnv(name) ?? await readCloudflareEnv(name);
  }
};
function readDenoEnv(name) {
  try {
    const denoEnv = globalThis.Deno?.env;
    const value = denoEnv?.get?.(name) || void 0;
    log.debug("metrics.read_deno_env", { name, hasDenoEnv: !!denoEnv, found: !!value });
    return value;
  } catch (err) {
    log.debug("metrics.read_deno_env_error", { name, ...describeError(err) });
    return void 0;
  }
}
var SupabaseMetricRecorder = class extends BaseMetricRecorder {
  stack = "supabase";
  async readEnv(name) {
    return readDenoEnv(name) ?? readProcessEnv(name);
  }
};
function createRecorderForRuntime(mcp, opts) {
  const config = resolveMetricsConfig(mcp.metrics);
  const server = { name: mcp.name, version: mcp.version };
  if (!config.enabled)
    return createNoopRecorder();
  return opts.stack === "tanstack" ? new TanStackMetricRecorder(config, server) : new SupabaseMetricRecorder(config, server);
}
function cachedPromise(load, label) {
  let settled = false;
  let value;
  return async () => {
    if (settled) {
      log.debug(`${label}.cache_hit`);
      return value;
    }
    log.debug(`${label}.load_start`);
    try {
      const loaded = await load();
      settled = true;
      value = loaded;
      if (label)
        log.debug(`${label}.settled`);
      return loaded;
    } catch (err) {
      log.debug(`${label}.load_failed`, describeError(err));
      throw err;
    }
  };
}
var OAuthConfigurationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "OAuthConfigurationError";
  }
};
var METADATA_FETCH_TIMEOUT_MS = 5e3;
function issuerPath(url) {
  const path = trimTrailingSlash(url.pathname);
  return path === "" ? void 0 : path;
}
function pathInsertedOAuthMetadataUrls(url, path) {
  return [
    `${url.origin}/.well-known/oauth-authorization-server${path}`,
    `${url.origin}/.well-known/openid-configuration${path}`
  ];
}
function oauthMetadataUrlsForIssuer(issuer) {
  const normalizedIssuer = trimTrailingSlash(issuer);
  const url = new URL(normalizedIssuer);
  const path = issuerPath(url);
  if (!path) {
    return [
      `${normalizedIssuer}/.well-known/oauth-authorization-server`,
      `${normalizedIssuer}/.well-known/openid-configuration`
    ];
  }
  return [...pathInsertedOAuthMetadataUrls(url, path), `${normalizedIssuer}/.well-known/openid-configuration`];
}
async function fetchFirstValidOAuthServerMetadata(metadataUrls, expectedIssuer) {
  const errors = [];
  for (const url of metadataUrls) {
    try {
      return await fetchOAuthServerMetadata(url, expectedIssuer);
    } catch (err) {
      log.debug("oauth.discovery.attempt_failed", { url, ...describeError(err) });
      errors.push(`${url}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  log.error("oauth.discovery.exhausted", { expectedIssuer, urlsTried: metadataUrls, errors });
  throw new Error(`failed to discover OAuth server metadata (${errors.join("; ")})`);
}
async function fetchOAuthServerMetadata(url, expectedIssuer) {
  log.debug("oauth.discovery.fetch", { url });
  const response = await fetch(url, { signal: AbortSignal.timeout(METADATA_FETCH_TIMEOUT_MS), redirect: "manual" });
  if (!response.ok) {
    throw new Error(String(response.status));
  }
  const json = await response.json();
  if (typeof json.issuer !== "string") {
    throw new Error("missing issuer");
  }
  parseSafeUrl("discovered issuer", json.issuer);
  if (trimTrailingSlash(json.issuer) !== expectedIssuer) {
    log.warn("oauth.discovery.issuer_mismatch", { url, expectedIssuer, published: json.issuer });
    throw new Error("issuer mismatch");
  }
  if (typeof json.jwks_uri !== "string") {
    throw new Error("missing jwks_uri");
  }
  parseSafeUrl("discovered jwks_uri", json.jwks_uri);
  return { issuer: json.issuer, jwks_uri: json.jwks_uri };
}
async function fetchIssuerOAuthServerMetadata(issuer) {
  try {
    return await fetchFirstValidOAuthServerMetadata(oauthMetadataUrlsForIssuer(issuer), issuer);
  } catch (err) {
    log.error("oauth.discovery.config_error", {
      issuer,
      ...describeError(err),
      outcome: "500 oauth configuration error"
    });
    throw new OAuthConfigurationError(
      `OAuth issuer discovery failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
function createOAuthDiscoveryResolver(auth) {
  const configuredIssuer = trimTrailingSlash(auth.issuer);
  const oauthServerMetadata = cachedPromise(
    () => fetchIssuerOAuthServerMetadata(configuredIssuer),
    "oauth.discovery.metadata"
  );
  return {
    resolveIssuer: async () => configuredIssuer,
    resolveJwksUri: async () => {
      if (auth.jwksUri) {
        log.debug("oauth.jwks.resolved", { jwksUri: auth.jwksUri, source: "configured" });
        return auth.jwksUri;
      }
      const jwksUri = (await oauthServerMetadata()).jwks_uri;
      log.debug("oauth.jwks.resolved", { jwksUri, source: "discovered" });
      return jwksUri;
    }
  };
}
function readString(value) {
  return typeof value === "string" ? value : void 0;
}
function splitScopes(value) {
  if (typeof value === "string")
    return value.split(/\s+/).filter(Boolean);
  if (Array.isArray(value))
    return value.filter((entry) => typeof entry === "string" && entry.length > 0);
  return [];
}
function stringClaim(claims, name) {
  return readString(claims[name]);
}
var DEFAULT_JWT_ALGORITHMS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "EdDSA"];
var DEFAULT_CLOCK_TOLERANCE_SECONDS = 30;
var DEFAULT_ACCESS_TOKEN_TYPS = ["at+jwt", "JWT"];
var JWKS_FETCH_TIMEOUT_MS = 5e3;
var OAuthTokenError = class extends Error {
  constructor(status, oauthError, message) {
    super(message);
    this.status = status;
    this.oauthError = oauthError;
    this.name = "OAuthTokenError";
  }
};
function resolveAcceptedAudiences(auth, resource) {
  return auth.acceptedAudiences ?? [resource];
}
function tokenHeaderFields(token) {
  try {
    const header = decodeProtectedHeader(token);
    return { jwtAlg: header.alg, jwtKid: header.kid, tokenLength: token.length };
  } catch {
    return { tokenLength: token.length };
  }
}
async function fetchVerificationKeySet(jwksUri) {
  try {
    const response = await fetch(jwksUri, { signal: AbortSignal.timeout(JWKS_FETCH_TIMEOUT_MS), redirect: "manual" });
    if (!response.ok)
      throw new Error(`JWKS endpoint returned ${response.status}`);
    const json = await response.json();
    return createLocalJWKSet(json);
  } catch (err) {
    log.error("oauth.jwks.fetch_failed", { ...describeError(err), outcome: "500 oauth configuration error" });
    throw new OAuthConfigurationError(`JWKS fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
function assertAccessTokenTyp(token, allowed) {
  let header;
  try {
    header = decodeProtectedHeader(token);
  } catch (err) {
    log.debug("oauth.verify.bad_header", { ...describeError(err), outcome: "401 invalid_token" });
    throw new OAuthTokenError(401, "invalid_token", "Malformed JWT header");
  }
  const typ = header.typ;
  if (typeof typ !== "string" || !allowed.includes(typ)) {
    log.debug("oauth.verify.bad_typ", { jwtTyp: typ, allowed, outcome: "401 invalid_token" });
    throw new OAuthTokenError(401, "invalid_token", "Access token typ header is not accepted");
  }
}
async function verifyJwtClaims(token, keySet, issuer, audience, auth) {
  try {
    const { payload } = await jwtVerify(token, keySet, {
      // `issuer` is trimmed of any trailing slash; accept both forms so a token whose
      // `iss` carries the slash the AS publishes still verifies.
      issuer: [issuer, `${issuer}/`],
      audience: [...audience],
      algorithms: auth.algorithms ? [...auth.algorithms] : DEFAULT_JWT_ALGORITHMS,
      requiredClaims: ["sub", "exp"],
      clockTolerance: auth.clockToleranceSeconds ?? DEFAULT_CLOCK_TOLERANCE_SECONDS
    });
    return payload;
  } catch (err) {
    log.debug("oauth.verify.rejected", { ...describeError(err), outcome: "401 invalid_token" });
    throw err;
  }
}
function assertNonEmptySubject(claims) {
  const sub = claims["sub"];
  if (typeof sub !== "string" || sub.trim() === "") {
    log.debug("oauth.verify.bad_subject", { subType: typeof sub });
    throw new OAuthTokenError(401, "invalid_token", "token subject claim must be a non-empty string");
  }
}
function assertOAuthClientClaim(auth, clientId) {
  if (auth.requireOAuthClientClaim !== false && !clientId) {
    log.debug("oauth.verify.missing_client_claim", { outcome: "401 invalid_token" });
    throw new OAuthTokenError(401, "invalid_token", "OAuth client claim is required");
  }
}
function makeBearer(token) {
  return Object.defineProperty({}, "token", { value: token, enumerable: false });
}
function buildMcpAuthContext(args) {
  const { claims } = args;
  return {
    type: "oauth",
    principal: {
      claims,
      issuer: args.issuer,
      resource: args.resource,
      acceptedAudiences: args.acceptedAudiences,
      scopes: splitScopes(claims.scope),
      sub: stringClaim(claims, "sub"),
      email: stringClaim(claims, "email"),
      clientId: stringClaim(claims, "client_id") ?? stringClaim(claims, "azp")
    },
    bearer: makeBearer(args.token)
  };
}
function createOAuthTokenVerifier(auth, discovery) {
  const allowedTyps = auth.accessTokenTyp ?? DEFAULT_ACCESS_TOKEN_TYPS;
  return async (token, request, options) => {
    const resource = resolveProtectedResource(auth, request, options);
    const issuer = await discovery.resolveIssuer();
    const acceptedAudiences = resolveAcceptedAudiences(auth, resource);
    log.debug("oauth.verify.start", { issuer, acceptedAudiences, resource, ...tokenHeaderFields(token) });
    const jwksUri = await discovery.resolveJwksUri();
    log.debug("oauth.jwks.fetch", { jwksUri });
    const keySet = await fetchVerificationKeySet(jwksUri);
    assertAccessTokenTyp(token, allowedTyps);
    const claims = await verifyJwtClaims(token, keySet, issuer, acceptedAudiences, auth);
    assertNonEmptySubject(claims);
    const context = buildMcpAuthContext({ token, claims, issuer, resource, acceptedAudiences });
    assertOAuthClientClaim(auth, context.principal.clientId);
    log.info("oauth.verify.ok", {
      sub: context.principal.sub,
      clientId: context.principal.clientId,
      scopes: context.principal.scopes
    });
    return context;
  };
}
function quoteAuthenticateParam(value) {
  const sanitized = value.replace(/[\u0000-\u001F\u007F]/g, "");
  return `"${sanitized.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
function resolveProtectedResourceMetadataUrl(auth, request, options) {
  if (auth.protectedResourceMetadataUrl !== void 0)
    return auth.protectedResourceMetadataUrl;
  const base = auth.resource ?? request.url;
  return new URL(options.metadataPath ?? OAUTH_PROTECTED_RESOURCE_METADATA_PATH, base).toString();
}
function wwwAuthenticateHeader(auth, request, options, params = {}) {
  const values = [
    `realm=${quoteAuthenticateParam("mcp")}`,
    `resource_metadata=${quoteAuthenticateParam(resolveProtectedResourceMetadataUrl(auth, request, options))}`
  ];
  if (auth.requiredScopes && auth.requiredScopes.length > 0) {
    values.push(`scope=${quoteAuthenticateParam(auth.requiredScopes.join(" "))}`);
  }
  if (params.error)
    values.push(`error=${quoteAuthenticateParam(params.error)}`);
  if (params.errorDescription)
    values.push(`error_description=${quoteAuthenticateParam(params.errorDescription)}`);
  return `Bearer ${values.join(", ")}`;
}
function challengeResponse(auth, request, options, status, oauthError, errorDescription) {
  const headers = new Headers(JSON_HEADERS);
  headers.set(
    "WWW-Authenticate",
    wwwAuthenticateHeader(auth, request, options, { error: oauthError, errorDescription })
  );
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify({ error: status === 403 ? "forbidden" : "unauthorized" }), {
    status,
    headers
  });
}
function oauthConfigurationErrorResponse() {
  return new Response(JSON.stringify({ error: "oauth configuration error" }), {
    status: 500,
    headers: { ...JSON_HEADERS, "Cache-Control": "no-store" }
  });
}
function parseBearerToken(request) {
  const header = request.headers.get("Authorization");
  if (!header)
    return void 0;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  if (!match)
    return void 0;
  const token = match[1].trim();
  if (token === "" || /\s/.test(token))
    return void 0;
  return token;
}
function getOAuthRuntime(mcp, options = {}) {
  if (options.resourcePath !== void 0)
    assertResourcePathShape(options.resourcePath);
  if (options.metadataPath !== void 0)
    assertResourcePathShape(options.metadataPath, "metadataPath");
  const stableOptions = { resourcePath: options.resourcePath, metadataPath: options.metadataPath };
  const auth = mcp.auth?.type === "oauth" ? mcp.auth : void 0;
  if (!auth)
    return { kind: "unconfigured", options: stableOptions };
  if (options.metadataPath !== void 0 && auth.protectedResourceMetadataUrl !== void 0) {
    throw new Error(
      `@lovable.dev/mcp-js: the Vite plugin generates protected-resource metadata (metadataPath set), so auth.protectedResourceMetadataUrl must not also be set. Drop protectedResourceMetadataUrl, or set protectedResourceMetadataRoute: false in mcpPlugin(...) to host the document yourself.`
    );
  }
  const discovery = createOAuthDiscoveryResolver(auth);
  return {
    kind: "configured",
    auth,
    discovery,
    verify: createOAuthTokenVerifier(auth, discovery),
    options: stableOptions
  };
}
function assertRestResourceBinding(mcp, options = {}) {
  const auth = mcp.auth?.type === "oauth" ? mcp.auth : void 0;
  if (auth && auth.resource === void 0 && options.resourcePath === void 0) {
    throw new Error(
      `@lovable.dev/mcp-js: REST companion handlers require auth.resource or a resourcePath so principal.resource binds to the public MCP route, not the internal /.mcp/* request path`
    );
  }
}
function missingRequiredScopes(auth, scopes) {
  const requiredScopes = auth.requiredScopes ?? [];
  if (requiredScopes.length === 0)
    return [];
  const granted = new Set(scopes);
  return requiredScopes.filter((scope) => !granted.has(scope));
}
function assertRequiredScopes(auth, context) {
  if (missingRequiredScopes(auth, context.principal.scopes).length > 0) {
    throw new OAuthTokenError(403, "insufficient_scope", "Additional OAuth scope is required");
  }
}
function createRequestAuthorizer(mcp, options = {}) {
  const runtime = getOAuthRuntime(mcp, options);
  return {
    async authorize(request, recorder) {
      if (runtime.kind === "unconfigured")
        return { ok: true };
      const startedAt = nowMs();
      const token = parseBearerToken(request);
      if (!token) {
        log.info("auth.no_bearer_token", { outcome: "401" });
        return { ok: false, response: challengeResponse(runtime.auth, request, runtime.options, 401) };
      }
      try {
        const auth = await runtime.verify(token, request, runtime.options);
        assertRequiredScopes(runtime.auth, auth);
        return { ok: true, auth };
      } catch (err) {
        if (err instanceof OAuthConfigurationError) {
          log.error("auth.config_error", { ...describeError(err), outcome: "500" });
          await recorder?.emit({
            tool: null,
            method: "authorize",
            outcome: "auth_config_error",
            durationMs: nowMs() - startedAt
          });
          return { ok: false, response: oauthConfigurationErrorResponse() };
        }
        if (err instanceof OAuthTokenError) {
          log.info("auth.token_rejected", { status: err.status, oauthError: err.oauthError });
          return {
            ok: false,
            response: challengeResponse(
              runtime.auth,
              request,
              runtime.options,
              err.status,
              err.oauthError,
              err.message
            )
          };
        }
        log.error("auth.unexpected_error", { ...describeError(err), outcome: "401" });
        return {
          ok: false,
          response: challengeResponse(
            runtime.auth,
            request,
            runtime.options,
            401,
            "invalid_token",
            "Invalid access token"
          )
        };
      }
    }
  };
}
var EXPOSE_HEADERS = "WWW-Authenticate, Mcp-Session-Id, Mcp-Protocol-Version";
var ALLOW_HEADERS = "Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID";
function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Expose-Headers", EXPOSE_HEADERS);
  return response;
}
function corsPreflightResponse(allowMethods) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": allowMethods,
      "Access-Control-Allow-Headers": ALLOW_HEADERS,
      "Access-Control-Max-Age": "86400"
    }
  });
}
function adaptToolToSdkCallback(tool, auth, recorder) {
  return async (first) => {
    const args = tool.inputSchema ? first ?? {} : {};
    const start = nowMs();
    let result;
    try {
      result = await tool.handler(args, new ToolContext(auth));
    } catch {
      await recorder.emit({
        tool: tool.name,
        method: "tools/call",
        outcome: "handler_error",
        durationMs: nowMs() - start
      });
      return { content: [{ type: "text", text: "tool execution failed" }], isError: true };
    }
    if (result == null) {
      await recorder.emit({
        tool: tool.name,
        method: "tools/call",
        outcome: "handler_error",
        durationMs: nowMs() - start
      });
      return { content: [{ type: "text", text: `tool "${tool.name}" returned no result` }], isError: true };
    }
    await recorder.emit({
      tool: tool.name,
      method: "tools/call",
      outcome: result.isError ? "tool_error" : "ok",
      durationMs: nowMs() - start,
      errorText: result.isError ? extractTextContent(result.content) : void 0
    });
    return { content: result.content ?? [], structuredContent: result.structuredContent, isError: result.isError };
  };
}
function createMcpProtocolHandler(mcp, options = {}) {
  const authorizer = createRequestAuthorizer(mcp, options);
  const handle = async (request, recorder) => {
    const authResult = await authorizer.authorize(request, recorder);
    if (!authResult.ok)
      return authResult.response;
    try {
      const server = new McpServer(
        { name: mcp.name, version: mcp.version, title: mcp.title },
        { instructions: mcp.instructions }
      );
      for (const tool of mcp.tools) {
        server.registerTool(
          tool.name,
          {
            title: tool.title,
            description: tool.description,
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema,
            annotations: tool.annotations
          },
          adaptToolToSdkCallback(tool, authResult.auth, recorder)
        );
      }
      const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: void 0
      });
      await server.connect(transport);
      return await transport.handleRequest(request);
    } catch (err) {
      await recorder.emit({ tool: null, method: "transport", outcome: "transport_error", durationMs: 0 });
      log.error("mcp.transport_error", { ...describeError(err), outcome: "500 internal error" });
      return Response.json(
        { jsonrpc: "2.0", id: null, error: { code: -32603, message: "internal error" } },
        { status: 500 }
      );
    }
  };
  return async (request, recorder = createNoopRecorder()) => {
    if (request.method === "OPTIONS")
      return corsPreflightResponse("GET, POST, DELETE, OPTIONS");
    return withCors(await handle(request, recorder));
  };
}
function notFound() {
  return withCors(
    new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      // `no-store` so a 404 (OAuth unconfigured) isn't heuristically cached and
      // then served past a later deploy that enables OAuth and starts returning 200.
      headers: { ...JSON_HEADERS, "Cache-Control": "no-store" }
    })
  );
}
async function buildProtectedResourceMetadata(mcp, auth, request, options, discovery) {
  const issuer = await discovery.resolveIssuer();
  const body = {
    resource: resolveProtectedResource(auth, request, options),
    authorization_servers: [issuer],
    bearer_methods_supported: ["header"],
    resource_name: auth.resourceName ?? mcp.title,
    resource_documentation: auth.resourceDocumentation
  };
  if (auth.requiredScopes && auth.requiredScopes.length > 0)
    body.scopes_supported = auth.requiredScopes;
  return body;
}
function createOAuthProtectedResourceMetadataHandler(mcp, options = {}) {
  const runtime = getOAuthRuntime(mcp, options);
  if (runtime.kind === "configured" && runtime.auth.protectedResourceMetadataUrl === void 0 && runtime.auth.resource === void 0 && runtime.options.resourcePath === void 0) {
    throw new Error(
      `@lovable.dev/mcp-js: auth.resource or a resourcePath is required so the protected-resource metadata doesn't advertise the well-known URL as the resource`
    );
  }
  return async (request) => {
    if (runtime.kind !== "configured" || runtime.auth.protectedResourceMetadataUrl !== void 0)
      return notFound();
    if (request.method === "OPTIONS")
      return corsPreflightResponse("GET, HEAD, OPTIONS");
    if (request.method !== "GET" && request.method !== "HEAD")
      return withCors(methodNotAllowed("GET, HEAD, OPTIONS"));
    const headers = {
      ...JSON_HEADERS,
      "Cache-Control": "public, max-age=300",
      Vary: "Host"
    };
    try {
      const metadata = await buildProtectedResourceMetadata(
        mcp,
        runtime.auth,
        request,
        runtime.options,
        runtime.discovery
      );
      const response = withCors(Response.json(metadata, { headers }));
      return request.method === "HEAD" ? headResponse(response) : response;
    } catch (err) {
      log.error("oauth.metadata.config_error", { ...describeError(err), outcome: "500 oauth configuration error" });
      const response = withCors(oauthConfigurationErrorResponse());
      return request.method === "HEAD" ? headResponse(response) : response;
    }
  };
}
var MAX_REFLECTED_TOOL_NAME = 256;
function safeReflectName(name) {
  const text = String(name);
  return text.length > MAX_REFLECTED_TOOL_NAME ? `${text.slice(0, MAX_REFLECTED_TOOL_NAME)}…` : text;
}
function isEmptyArgs(value) {
  if (value == null)
    return true;
  if (typeof value !== "object" || Array.isArray(value))
    return false;
  return Object.keys(value).length === 0;
}
function createInvokeToolHandler(mcp, options = {}) {
  assertRestResourceBinding(mcp, options);
  const authorizer = createRequestAuthorizer(mcp, options);
  const handle = async (request, toolName, recorder) => {
    const authResult = await authorizer.authorize(request, recorder);
    if (!authResult.ok)
      return authResult.response;
    if (request.method !== "POST")
      return methodNotAllowed("POST, OPTIONS");
    const tool = mcp.tools.find((t) => t.name === toolName);
    if (!tool) {
      return new Response(JSON.stringify({ error: `unknown tool: ${safeReflectName(toolName)}` }), {
        status: 404,
        headers: JSON_HEADERS
      });
    }
    let rawArgs = {};
    const text = await request.text();
    if (text) {
      try {
        rawArgs = JSON.parse(text);
      } catch {
        return new Response(JSON.stringify({ error: "invalid JSON body" }), {
          status: 400,
          headers: JSON_HEADERS
        });
      }
    }
    let args = rawArgs;
    if (tool.inputSchema) {
      try {
        const schema = objectFromShape(tool.inputSchema);
        const parsed = await safeParseAsync(schema, rawArgs);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({
              error: "validation failed",
              details: getParseErrorMessage(parsed.error)
            }),
            { status: 400, headers: JSON_HEADERS }
          );
        }
        args = parsed.data;
      } catch {
        return new Response(JSON.stringify({ error: "schema error", tool: toolName }), {
          status: 500,
          headers: JSON_HEADERS
        });
      }
    } else if (!isEmptyArgs(rawArgs)) {
      return new Response(JSON.stringify({ error: "tool has no inputSchema; expected empty body" }), {
        status: 400,
        headers: JSON_HEADERS
      });
    }
    let result;
    const start = nowMs();
    try {
      result = await tool.handler(args, new ToolContext(authResult.auth));
    } catch {
      await recorder.emit({
        tool: tool.name,
        method: "tools/call",
        outcome: "handler_error",
        durationMs: nowMs() - start
      });
      return new Response(JSON.stringify({ error: "handler threw", tool: toolName }), {
        status: 500,
        headers: JSON_HEADERS
      });
    }
    if (result == null) {
      await recorder.emit({
        tool: tool.name,
        method: "tools/call",
        outcome: "handler_error",
        durationMs: nowMs() - start
      });
      return new Response(JSON.stringify({ error: `tool "${toolName}" returned no result` }), {
        status: 500,
        headers: JSON_HEADERS
      });
    }
    await recorder.emit({
      tool: tool.name,
      method: "tools/call",
      outcome: result.isError ? "tool_error" : "ok",
      durationMs: nowMs() - start,
      errorText: result.isError ? extractTextContent(result.content) : void 0
    });
    return Response.json({
      content: result.content ?? [],
      structuredContent: result.structuredContent,
      isError: result.isError
    });
  };
  return async (request, toolName, recorder = createNoopRecorder()) => {
    if (request.method === "OPTIONS")
      return corsPreflightResponse("POST, OPTIONS");
    return withCors(await handle(request, toolName, recorder));
  };
}
function shapeToJsonSchema(shape) {
  if (!shape)
    return null;
  try {
    return toJsonSchemaCompat(objectFromShape(shape));
  } catch {
    return null;
  }
}
function buildMcpListing(mcp) {
  return {
    server: { name: mcp.name, version: mcp.version, title: mcp.title },
    tools: mcp.tools.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      annotations: tool.annotations,
      inputSchema: shapeToJsonSchema(tool.inputSchema),
      outputSchema: shapeToJsonSchema(tool.outputSchema)
    }))
  };
}
function createListToolsHandler(mcp, options = {}) {
  assertRestResourceBinding(mcp, options);
  const authorizer = createRequestAuthorizer(mcp, options);
  const handle = async (request, recorder) => {
    const authResult = await authorizer.authorize(request, recorder);
    if (!authResult.ok)
      return authResult.response;
    if (request.method !== "GET" && request.method !== "HEAD")
      return methodNotAllowed("GET, HEAD, OPTIONS");
    const response = Response.json(buildMcpListing(mcp));
    return request.method === "HEAD" ? headResponse(response) : response;
  };
  return async (request, recorder = createNoopRecorder()) => {
    if (request.method === "OPTIONS")
      return corsPreflightResponse("GET, HEAD, OPTIONS");
    return withCors(await handle(request, recorder));
  };
}
var STACK = "tanstack";
function forwarded(request, options) {
  return applyForwardedOrigin(request, { trustForwardedHost: options.trustForwardedHost });
}
function createTanStackMcpHandler(mcp, options = {}) {
  const handler = createMcpProtocolHandler(mcp, options);
  return ({ request }) => handler(forwarded(request, options), createRecorderForRuntime(mcp, { stack: STACK }));
}
function createTanStackListToolsHandler(mcp, options = {}) {
  const handler = createListToolsHandler(mcp, options);
  return ({ request }) => handler(forwarded(request, options), createRecorderForRuntime(mcp, { stack: STACK }));
}
function createTanStackInvokeToolHandler(mcp, options = {}) {
  const handler = createInvokeToolHandler(mcp, options);
  return ({ request, params }) => handler(forwarded(request, options), params.tool, createRecorderForRuntime(mcp, { stack: STACK }));
}
function createTanStackOAuthProtectedResourceMetadataHandler(mcp, options = {}) {
  const handler = createOAuthProtectedResourceMetadataHandler(mcp, options);
  return ({ request }) => handler(forwarded(request, options));
}
function assertUniqueNames(mcp) {
  const seen = /* @__PURE__ */ new Set();
  for (const tool of mcp.tools) {
    if (seen.has(tool.name)) {
      throw new Error(`@lovable.dev/mcp-js: duplicate tool name "${tool.name}"`);
    }
    seen.add(tool.name);
  }
}
function assertNonEmptyString(label, value) {
  if (value.trim() === "") {
    throw new Error(`@lovable.dev/mcp-js: ${label} must not be empty`);
  }
  if (value !== value.trim()) {
    throw new Error(`@lovable.dev/mcp-js: ${label} must not have leading or trailing whitespace`);
  }
}
function assertHttpsUrlField(name, value) {
  assertNonEmptyString(`auth.${name}`, value);
  parseSafeUrl(`@lovable.dev/mcp-js: auth.${name}`, value);
}
function assertScope(scope) {
  if (scope.trim() === "" || /\s/.test(scope)) {
    throw new Error(`@lovable.dev/mcp-js: OAuth scopes must be non-empty space-free tokens`);
  }
}
function assertJwtAlgorithm(algorithm) {
  if (algorithm.trim() === "" || /\s/.test(algorithm)) {
    throw new Error(`@lovable.dev/mcp-js: auth.algorithms must contain non-empty space-free tokens`);
  }
  if (/^HS\d+$/i.test(algorithm) || algorithm.toLowerCase() === "none") {
    throw new Error(`@lovable.dev/mcp-js: auth.algorithms cannot include "${algorithm}"; this verifier is JWKS-only`);
  }
}
var MAX_CLOCK_TOLERANCE_SECONDS = 300;
function assertClockToleranceSeconds(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > MAX_CLOCK_TOLERANCE_SECONDS) {
    throw new Error(
      `@lovable.dev/mcp-js: auth.clockToleranceSeconds must be a non-negative number of seconds no greater than ${MAX_CLOCK_TOLERANCE_SECONDS}`
    );
  }
}
function assertOAuthConfig(auth2) {
  if (auth2.type !== "oauth") {
    const authType = String(auth2.type);
    throw new Error(`@lovable.dev/mcp-js: unsupported auth type "${authType}"`);
  }
  if (auth2.issuer === void 0) {
    throw new Error(`@lovable.dev/mcp-js: auth.issuer is required`);
  }
  assertHttpsUrlField("issuer", auth2.issuer);
  if (auth2.jwksUri !== void 0) {
    assertHttpsUrlField("jwksUri", auth2.jwksUri);
  }
  if (auth2.resource !== void 0) {
    assertHttpsUrlField("resource", auth2.resource);
  }
  if (auth2.resourceName !== void 0) {
    assertNonEmptyString("auth.resourceName", auth2.resourceName);
  }
  if (auth2.resourceDocumentation !== void 0) {
    assertHttpsUrlField("resourceDocumentation", auth2.resourceDocumentation);
  }
  if (auth2.protectedResourceMetadataUrl !== void 0) {
    assertHttpsUrlField("protectedResourceMetadataUrl", auth2.protectedResourceMetadataUrl);
  }
  if (auth2.acceptedAudiences !== void 0) {
    if (!Array.isArray(auth2.acceptedAudiences)) {
      throw new Error(`@lovable.dev/mcp-js: auth.acceptedAudiences must be an array`);
    }
    if (auth2.acceptedAudiences.length === 0) {
      throw new Error(`@lovable.dev/mcp-js: auth.acceptedAudiences must not be empty`);
    }
    for (const audience of auth2.acceptedAudiences) {
      if (typeof audience !== "string") {
        throw new Error(`@lovable.dev/mcp-js: auth.acceptedAudiences must contain strings`);
      }
      assertNonEmptyString("auth.acceptedAudiences", audience);
    }
  }
  if (auth2.requiredScopes !== void 0) {
    if (!Array.isArray(auth2.requiredScopes)) {
      throw new Error(`@lovable.dev/mcp-js: auth.requiredScopes must be an array`);
    }
    for (const scope of auth2.requiredScopes)
      assertScope(scope);
  }
  if (auth2.algorithms !== void 0) {
    if (!Array.isArray(auth2.algorithms)) {
      throw new Error(`@lovable.dev/mcp-js: auth.algorithms must be an array`);
    }
    if (auth2.algorithms.length === 0) {
      throw new Error(`@lovable.dev/mcp-js: auth.algorithms must not be empty`);
    }
    for (const algorithm of auth2.algorithms)
      assertJwtAlgorithm(algorithm);
  }
  if (auth2.accessTokenTyp !== void 0) {
    if (!Array.isArray(auth2.accessTokenTyp)) {
      throw new Error(`@lovable.dev/mcp-js: auth.accessTokenTyp must be an array`);
    }
    if (auth2.accessTokenTyp.length === 0) {
      throw new Error(`@lovable.dev/mcp-js: auth.accessTokenTyp must not be empty`);
    }
    for (const typ of auth2.accessTokenTyp) {
      if (typeof typ !== "string") {
        throw new Error(`@lovable.dev/mcp-js: auth.accessTokenTyp must contain strings`);
      }
      assertNonEmptyString("auth.accessTokenTyp", typ);
    }
  }
  if (auth2.clockToleranceSeconds !== void 0)
    assertClockToleranceSeconds(auth2.clockToleranceSeconds);
  if (auth2.resource === void 0 && auth2.acceptedAudiences === void 0) {
    throw new Error(`@lovable.dev/mcp-js: auth.resource or auth.acceptedAudiences is required`);
  }
}
function freezeAuth(auth2) {
  if (!auth2)
    return;
  if (auth2.acceptedAudiences)
    Object.freeze(auth2.acceptedAudiences);
  if (auth2.requiredScopes)
    Object.freeze(auth2.requiredScopes);
  if (auth2.algorithms)
    Object.freeze(auth2.algorithms);
  if (auth2.accessTokenTyp)
    Object.freeze(auth2.accessTokenTyp);
  Object.freeze(auth2);
}
function defineTool(def) {
  return def;
}
function defineMcp(def) {
  assertNonEmptyString("name", def.name);
  assertNonEmptyString("title", def.title);
  assertNonEmptyString("version", def.version);
  assertUniqueNames(def);
  if (def.auth)
    assertOAuthConfig(def.auth);
  resolveMetricsConfig(def.metrics);
  freezeAuth(def.auth);
  Object.freeze(def.tools);
  for (const tool of def.tools)
    Object.freeze(tool);
  return def;
}
export {
  createTanStackOAuthProtectedResourceMetadataHandler as a,
  createTanStackListToolsHandler as b,
  createTanStackInvokeToolHandler as c,
  createTanStackMcpHandler as d,
  defineTool as e,
  defineMcp as f
};
