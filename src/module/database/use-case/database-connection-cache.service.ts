import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';

interface CachedConnection {
  conn: Connection;
  lastUsed: number;
}

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class DatabaseConnectionCache implements OnModuleDestroy {
  private readonly cache = new Map<string, CachedConnection>();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupTimer = setInterval(() => this.evictIdle(), 60_000);
  }

  async getConnection(uri: string): Promise<Connection> {
    const cached = this.cache.get(uri);
    if (cached && cached.conn.readyState === 1) {
      cached.lastUsed = Date.now();
      return cached.conn;
    }

    // Clean up stale entry if exists
    if (cached) {
      await cached.conn.close().catch(() => null);
      this.cache.delete(uri);
    }

    const conn = await createConnection(uri).asPromise();
    this.cache.set(uri, { conn, lastUsed: Date.now() });
    return conn;
  }

  private async evictIdle() {
    const now = Date.now();
    for (const [uri, cached] of this.cache) {
      if (now - cached.lastUsed > IDLE_TIMEOUT_MS) {
        await cached.conn.close().catch(() => null);
        this.cache.delete(uri);
      }
    }
  }

  async onModuleDestroy() {
    clearInterval(this.cleanupTimer);
    for (const [, cached] of this.cache) {
      await cached.conn.close().catch(() => null);
    }
    this.cache.clear();
  }
}
