export interface AppLog {
  '@timestamp': string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service_name: string;
  endpoint: string;
  response_time: number;
  status_code: number;
  user_id: string;
  message: string;
}