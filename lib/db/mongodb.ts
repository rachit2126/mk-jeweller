import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 1,
  minPoolSize: 0,
  maxIdleTimeMS: 5000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 10000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

let activeClient: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export function resetClient() {
  activeClient = null;
  clientPromise = null;
}

/**
 * Sanitizes MongoDB connection error messages to ensure credentials are never exposed in logs.
 */
function sanitizeMongoError(message?: string): string {
  if (!message) return 'Unknown database error';
  return message.replace(/mongodb(\+srv)?:\/\/[^@]+@/gi, 'mongodb$1://[credentials-hidden]@');
}

/**
 * Resolves MongoDB URI across standard Node.js and Cloudflare Worker runtimes.
 */
export function resolveMongoUri(): string {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGODB_ATLAS_URI ||
    (globalThis as any)?.__CLOUDFLARE_ENV__?.MONGODB_URI ||
    (globalThis as any)?.__CLOUDFLARE_ENV__?.MONGODB_ATLAS_URI ||
    (globalThis as any)?.MONGODB_URI ||
    '';
  return (uri || '').trim();
}

/**
 * Validates if MongoDB URI is configured in current environment.
 */
export function isMongoConfigured(): boolean {
  return resolveMongoUri().length > 0;
}

/**
 * Returns an active cached MongoClient instance.
 * Evaluates connection string lazily at runtime — never at module import time.
 * Coalesces concurrent connection attempts so multiple requests never clash.
 * Resets cached client immediately if closed or disconnected.
 * Never falls back to localhost or 127.0.0.1.
 */
async function getClient(): Promise<MongoClient> {
  const uri = resolveMongoUri();

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured in Cloudflare Workers. Please add MONGODB_URI in Cloudflare Settings -> Variables and Secrets.');
  }

  // Reuse development global client if alive
  if (process.env.NODE_ENV === 'development' && global._mongoClientInstance) {
    return global._mongoClientInstance;
  }

  if (activeClient) {
    return activeClient;
  }

  if (clientPromise) {
    return clientPromise;
  }

  clientPromise = (async () => {
    try {
      const client = new MongoClient(uri, options);

      // Listen for socket/topology closure to prevent stale client hangs in serverless isolates
      client.on('close', resetClient);
      client.on('error', resetClient);
      client.on('serverClosed', resetClient);
      client.on('topologyClosed', resetClient);

      await client.connect();
      activeClient = client;

      if (process.env.NODE_ENV === 'development') {
        global._mongoClientInstance = client;
      }
      return client;
    } catch (err: any) {
      resetClient();
      const safeMsg = sanitizeMongoError(err?.message);
      console.error('[MongoDB Connection Error]:', safeMsg);
      throw new Error('Database connection currently unavailable');
    }
  })();

  return clientPromise;
}

/**
 * Centralized MongoDB Connection Utility.
 * Reuses active client pool across requests.
 * Evaluates connection lazily at request runtime.
 * Never exposes credentials to client.
 */
export async function connectDB(dbName?: string): Promise<Db> {
  const targetDb =
    dbName ||
    process.env.MONGODB_DB_NAME ||
    process.env.MONGODB_DB ||
    (globalThis as any)?.__CLOUDFLARE_ENV__?.MONGODB_DB_NAME ||
    (globalThis as any)?.__CLOUDFLARE_ENV__?.MONGODB_DB ||
    'mk_silver_hub';
  const client = await getClient();
  return client.db(targetDb);
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClient();
}

export default getClient;

