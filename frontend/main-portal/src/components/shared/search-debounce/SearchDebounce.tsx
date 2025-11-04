import { Input } from "antd";
import { useRef, useState, type ChangeEvent, type ComponentProps } from "react";

interface SearchDebounceProps extends Omit<ComponentProps<typeof Input>, 'onChange' | 'onSubmit'> {
  onSubmit?: (values: { search: string }) => void;
  className?: string;
  placeholder?: string;
}

const TIME_OUT_DEBOUNCE = 300; // milliseconds

const SearchDebounce: React.FC<SearchDebounceProps> = ({
  onSubmit,
  placeholder,
  ...props
}) => {
  const [search, setSearch] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (!onSubmit) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onSubmit({ search: value });
    }, TIME_OUT_DEBOUNCE);
  };

  return (
      <Input
        style={{ width: 300}}
        type='text'
        value={search}
        onChange={handleSearchChange}
        placeholder={placeholder}
        {...props}
      />

  );
};

export default SearchDebounce;
