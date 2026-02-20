import { useEffect, useState } from "react";
import type { AppLog } from "../types/log";
import { searchLogs } from "../api/logs-api";
import { SearchBar } from "../components/searchbar";
import { LogTable } from "../components/log-table";
import { LogDetailModal } from "../components/log-detail-modal";

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
    <div style={pageStyle}>
      <div style={containerStyle}>
        <SearchBar onSearch={handleSearch} />

        <div style={tableWrapperStyle}>
          <LogTable
            logs={logs}
            loading={loading}
            onSelectLog={setSelectedLog}
          />
        </div>

        <div style={paginationStyle}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
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

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: 40,
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1200,
  background: '#1e1e1e',
  padding: 16,
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const tableWrapperStyle: React.CSSProperties = {
  flex: 1,
  maxHeight: '60vh',
  overflow: 'auto',
  border: '1px solid #333',
  borderRadius: 8,
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 12,
  alignItems: 'center',
};