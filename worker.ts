import handler from "vinext/server/fetch-handler";

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: any) {
    try {
      if (env) {
        (globalThis as any).__CLOUDFLARE_ENV__ = env;
        for (const [key, value] of Object.entries(env)) {
          if (typeof value === "string") {
            process.env[key] = value;
            (globalThis as any)[key] = value;
          }
        }
      }
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
