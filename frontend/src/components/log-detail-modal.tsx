import type { AppLog } from '../types/log';

interface Props {
  log: AppLog;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: Props) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div style={headerStyle}>
          <div>
            <div style={titleStyle}>
              <strong>{log.level}</strong>
              {' · '}
              {log.service_name}
              {' · '}
              {log.endpoint}
            </div>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <pre style={preStyle}>
          {JSON.stringify(log, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* ---- styles ---- */

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  width: '80%',
  maxWidth: 900,
  maxHeight: '80vh',
  borderRadius: 8,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
};

const subTitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
};

const preStyle: React.CSSProperties = {
  padding: 16,
  overflow: 'auto',
  fontSize: 13,
  background: '#f6f8fa',
  flex: 1,
};