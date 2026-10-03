import handler from "vinext/server/fetch-handler";

/**
 * Bridges Cloudflare Worker runtime env/secrets to process.env and global context.
 * Concurrency-safe: only sets keys when missing or different.
 * Does not lock out requests or fail on pre-warmed isolates.
 */
function bridgeEnvironment(env: Record<string, unknown>) {
  if (!env || typeof env !== "object") return;
  (globalThis as any).__CLOUDFLARE_ENV__ = env;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string" && process.env[key] !== value) {
      process.env[key] = value;
    }
  }
}

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: any) {
    try {
      bridgeEnvironment(env);
      return await (handler as any).fetch(request, env, ctx);
    } catch (err: any) {
      console.error("[Worker Unhandled Exception]:", err?.message || err);
      return new Response(
        `Application Error: ${err?.message || "Internal Server Error"}`,
        { status: 500, headers: { "Content-Type": "text/plain" } }
      );
    }
  },
};

