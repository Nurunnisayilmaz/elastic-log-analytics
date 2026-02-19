export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface AppLog {
    id: string;
    '@timestamp': string;
    level: LogLevel;
    service_name: string;
    endpoint: string;
    response_time: number;
    status_code: number;
    user_id: string;
    message: string;
    highlight?: {
        message?: string[];
        'endpoint.text'?: string[];
    };
}