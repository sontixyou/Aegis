import { z } from 'zod';
import type { Env } from './types/env';

// 環境変数のスキーマ定義（バリデーション用）
const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, 'DB_FILE_NAME is required'),
  PORT: z.string().optional().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

// 環境変数を検証して返す関数
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

// 検証済み環境変数をエクスポート
export const env = validateEnv();
