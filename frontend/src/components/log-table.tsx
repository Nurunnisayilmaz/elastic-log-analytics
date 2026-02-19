import type { AppLog } from '../types/log';

interface Props {
  logs: AppLog[];
  loading: boolean;
}

export function LogTable({ logs, loading }: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (logs.length === 0) {
    return <div>No logs found</div>;
  }

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
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log['@timestamp']}</td>
            <td>{log.level}</td>
            <td>{log.service_name}</td>
            <td>{log.endpoint}</td>
            <td>{log.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}