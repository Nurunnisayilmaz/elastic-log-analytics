import { useEffect, useState } from 'react';
import type { AppLog } from '../types/log';
import { searchLogs } from '../api/logs-api';
import { SearchBar } from '../components/searchbar';
import { LogTable } from '../components/log-table';
import { LogDetailModal } from '../components/log-detail-modal';

export function Dashboard() {
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AppLog | null>(null);

  async function fetchLogs(params = searchParams, pageNum = page) {
    setLoading(true);
    try {
      const result = await searchLogs({
        ...params,
        page: pageNum,
        pageSize,
      });

      setLogs(result.logs);
      setTotalPages(result.totalPages);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(params: any) {
    setSearchParams(params);
    setPage(1);
    fetchLogs(params, 1);
  }

  useEffect(() => {
    fetchLogs(searchParams, page);
  }, [page]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      <LogTable
        logs={logs}
        loading={loading}
        onSelectLog={setSelectedLog}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>

      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}