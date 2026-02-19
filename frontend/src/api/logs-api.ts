import axios from 'axios';
import type { AppLog } from '../types/log';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export interface SearchParams {
  service?: string;
  level?: string;
  message?: string;
  q?: string;
  lastMinutes?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  count: number;
  logs: AppLog[];
}

export async function searchLogs(
  params: SearchParams
): Promise<SearchResponse> {
  const { data } = await api.get('/search/logs', {
    params,
  });
  console.log('Search response:', data);
  return data;
}