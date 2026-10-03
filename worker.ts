import handler from "vinext/server/fetch-handler";

let isEnvInitialized = false;

/**
 * Idempotently bridges Cloudflare Worker runtime env/secrets to process.env and global context
 * once per Worker isolate lifecycle.
 * Concurrency-safe, eliminates redundant per-request object mutations.
 */
function initEnvironmentOnce(env: Record<string, unknown>) {
  if (isEnvInitialized || !env) return;
  (globalThis as any).__CLOUDFLARE_ENV__ = env;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === "string" && (!process.env[key] || process.env[key] !== value)) {
      process.env[key] = value;
    }
  }
  isEnvInitialized = true;
}

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: any) {
    try {
      initEnvironmentOnce(env);
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
