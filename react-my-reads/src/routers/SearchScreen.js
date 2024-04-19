import React, { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getAll, search, update } from "../BooksAPI";
import Book from "../components/Book";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

export default function SearchScreen() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [listAllBooks, setListAllBooks] = useState([]);
  const [listSearchBooks, setListSearchBooks] = useState([]);

  const debouncedInputValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    getAll().then((books) => setListAllBooks(books));
  }, []);

  const onChange = useCallback((event) => {
    setSearchValue(event.target.value);
  }, []);

  const onSearch = useCallback(async (value) => {
    try {
      setIsLoading(true);

      if (value) {
        if (value.length > 0) {
          const res = await search(value, 50);
          if (res && res?.length) {
            setListSearchBooks(res);
          } else {
            setListSearchBooks([]);
            throw Error();
          }
        } else {
          setListSearchBooks([]);
        }
      } else {
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (debouncedInputValue && debouncedInputValue.length > 0) {
      onSearch(debouncedInputValue);
    } else {
      setListSearchBooks([]);
    }
  }, [debouncedInputValue, onSearch]);

  const onUpdateBookShelf = useCallback(async (book, shelf) => {
    try {
      setIsLoading(true);
      const res = await update(book, shelf);

      if (res && Object.values(res).length) {
        getAll().then((books) => setListAllBooks(books));
        setIsLoading(false);
      } else {
        throw Error();
      }
    } catch (error) {
      setIsLoading(false);
      return;
    }
  }, []);

  return (
    <div className="search-container">
      <Loading isLoading={isLoading} />
      <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" href="/">
            Close
          </a>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN"
              autoFocus
              value={searchValue}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid-search">
            {listSearchBooks.map((book) => {
              return (
                <li key={book?.id}>
                  <Book
                    {...book}
                    shelf={
                      listAllBooks?.find((item) => item?.id === book?.id)?.shelf
                    }
                    onSelectShelf={async (event) => {
                      const shelf = event.currentTarget.value;
                      await onUpdateBookShelf(book, shelf);
                    }}
                    onClick={() => {
                      navigate("/books/" + book.id);
                    }}
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
