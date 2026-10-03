import { MongoClient, Db } from 'mongodb';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 20000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientInstance: MongoClient | undefined;
}

let activeClient: MongoClient | null = null;

/**
 * Sanitizes MongoDB connection error messages to ensure credentials are never exposed in logs.
 */
function sanitizeMongoError(message?: string): string {
  if (!message) return 'Unknown database error';
  return message.replace(/mongodb(\+srv)?:\/\/[^@]+@/gi, 'mongodb$1://[credentials-hidden]@');
}

/**
 * Validates if MongoDB URI is configured in current environment.
 */
export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
  return Boolean(uri && uri.trim().length > 0);
}

/**
 * Returns an active cached MongoClient instance.
 * Evaluates connection string lazily at runtime — never at module import time.
 * Never falls back to localhost or 127.0.0.1.
 */
async function getClient(): Promise<MongoClient> {
  const uri = (process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI || '').trim();

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured. Database access is unavailable.');
  }

  // Reuse development global client if alive
  if (process.env.NODE_ENV === 'development' && global._mongoClientInstance) {
    try {
      await global._mongoClientInstance.db('admin').command({ ping: 1 });
      return global._mongoClientInstance;
    } catch {
      global._mongoClientInstance = undefined;
    }
  }

  // Reuse cached active client in serverless/worker runtime
  if (activeClient) {
    try {
      await activeClient.db('admin').command({ ping: 1 });
      return activeClient;
    } catch {
      activeClient = null;
    }
  }

  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    activeClient = client;
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientInstance = client;
    }
    return client;
  } catch (err: any) {
    const safeMsg = sanitizeMongoError(err?.message);
    console.error('[MongoDB Connection Error]:', safeMsg);
    throw new Error('Database connection currently unavailable');
  }
}

/**
 * Centralized MongoDB Connection Utility.
 * Reuses active client pool across requests.
 * Evaluates connection lazily at request runtime.
 * Never exposes credentials to client.
 */
export async function connectDB(dbName: string = 'mk_silver_hub'): Promise<Db> {
  const client = await getClient();
  return client.db(dbName);
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClient();
}

export default getClient;

