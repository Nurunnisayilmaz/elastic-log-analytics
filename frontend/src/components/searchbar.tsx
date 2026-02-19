import { useState } from 'react';

interface Props {
  onSearch: (params: {
    service?: string;
    level?: string;
    q?: string;
  }) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [service, setService] = useState('');
  const [level, setLevel] = useState('');
  const [q, setQ] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ service, level, q });
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        placeholder="Search text"
        value={q}
        onChange={e => setQ(e.target.value)}
      />

      <input
        placeholder="Service name"
        value={service}
        onChange={e => setService(e.target.value)}
      />

      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option value="">All Levels</option>
        <option value="INFO">INFO</option>
        <option value="WARN">WARN</option>
        <option value="ERROR">ERROR</option>
      </select>

      <button type="submit">Search</button>
    </form>
  );
}