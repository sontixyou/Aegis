// 環境変数の型定義
export interface Env {
  DB_FILE_NAME: string;
  PORT: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// Node.jsの環境変数型定義を拡張
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_FILE_NAME: string;
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}
