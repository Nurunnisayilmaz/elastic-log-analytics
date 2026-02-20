import { useState } from "react";

interface Props {
  onSearch: (params: { service?: string; level?: string; q?: string }) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [service, setService] = useState("");
  const [level, setLevel] = useState("");
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ service, level, q });
  }

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <input
        style={inputStyle}
        placeholder="Search text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Service name"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />

      <select
        style={selectStyle}
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="">All Levels</option>
        <option value="INFO">INFO</option>
        <option value="WARN">WARN</option>
        <option value="ERROR">ERROR</option>
      </select>

      <button
        type="submit"
        style={searchButtonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#3a3a3a")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#2f2f2f")
        }
      >
        Search
      </button>
    </form>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  marginBottom: 16,
  background: "#1f1f1f",
  border: "1px solid #333",
  borderRadius: 8,
};

const inputStyle: React.CSSProperties = {
  height: 36,
  padding: "0 10px",
  borderRadius: 6,
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "#eaeaea",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  height: 36,
  padding: "0 8px",
  borderRadius: 6,
  border: "1px solid #444",
  background: "#2a2a2a",
  color: "#eaeaea",
};

const searchButtonStyle: React.CSSProperties = {
  height: 36,
  padding: "0 16px",
  backgroundColor: "#2f2f2f",
  color: "#eaeaea",
  border: "1px solid #444",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease",
};