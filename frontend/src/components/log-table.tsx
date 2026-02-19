import type { AppLog } from "../types/log";

interface Props {
  logs: AppLog[];
  loading: boolean;
  onSelectLog?: (log: AppLog) => void;
}

export function LogTable({ logs, loading, onSelectLog }: Props) {
  if (loading) return <div>Loading...</div>;
  if (!logs.length) return <div>No logs found</div>;

  return (
    <table width="100%" border={1} cellPadding={8}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Level</th>
          <th>Service</th>
          <th>Endpoint</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => {
          const highlightedMessage = log.highlight?.message?.[0] ?? log.message;

          const highlightedEndpoint =
            log.highlight?.["endpoint.text"]?.[0] ?? log.endpoint;

          return (
            <tr
              key={log.id}
              style={{ cursor: "pointer" }}
              onClick={() => onSelectLog?.(log)}
            >
              <td>{new Date(log["@timestamp"]).toLocaleTimeString()}</td>
              <td>{log.level}</td>
              <td>{log.service_name}</td>

              <td dangerouslySetInnerHTML={{ __html: highlightedEndpoint }} />

              <td dangerouslySetInnerHTML={{ __html: highlightedMessage }} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
