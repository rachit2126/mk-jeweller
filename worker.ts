import handler from "vinext/server/fetch-handler";

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: any) {
    if (env) {
      (globalThis as any).__CLOUDFLARE_ENV__ = env;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
          (globalThis as any)[key] = value;
        }
      }
    }
    return (handler as any).fetch(request, env, ctx);
  },
};
