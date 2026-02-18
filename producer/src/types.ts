export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface AppLog {
  '@timestamp': string;
  level: LogLevel;
  service_name: string;
  endpoint: string;
  response_time: number;
  status_code: number;
  user_id: string;
  message: string;
  severity_score?: number; // enrich edilecek
}