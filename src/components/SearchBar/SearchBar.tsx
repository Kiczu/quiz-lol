import { TextField } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";

interface IUseDebounce {
  initSearch: string;
  handleSearchChange: (value: string) => void;
  delay: number;
}

const SearchBar = ({ initSearch, handleSearchChange, delay }: IUseDebounce) => {
  const [search, setSearch] = useDebounce({
    initState: initSearch,
    callback: handleSearchChange,
    delay: delay,
  });
  return (
    <>
      <TextField
        sx={{
          width: "100%",
          maxWidth: 200,
          margin: "20px auto",
        }}
        id="standard-search"
        label="Search field"
        type="search"
        variant="standard"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </>
  );
};

export default SearchBar;
