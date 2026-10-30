import { useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import { IconSearch } from "./Icons";

export default function SearchForm({ className, placeholder, withButton = false, onSearch }) {
  const { search, setSearch } = useStore();
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    onSearch?.();
    navigate("/shop");
  };

  return (
    <form className={className} role="search" onSubmit={submit}>
      {!withButton ? null : <IconSearch />}
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={placeholder}
        aria-label="Search stationery"
      />
      {search ? (
        <button type="button" className="clear-btn" onClick={() => setSearch("")} aria-label="Clear search">
          ×
        </button>
      ) : null}
      {withButton ? (
        <button className="btn" type="submit">Search</button>
      ) : (
        <button type="submit" aria-label="Search">
          <IconSearch />
        </button>
      )}
    </form>
  );
}
