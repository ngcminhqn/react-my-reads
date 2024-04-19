import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { EMPTY_STRING } from "../constants/common";
import { get } from "../BooksAPI";

export default function DetailScreen() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState({});

  const getBookDetail = useCallback(
    (id) => {
      setIsLoading(true);
      get(id)
        .then((res) => {
          if (res) {
            setBookDetail(res);
          } else {
            navigate("/not-found", { replace: true });
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          navigate("/not-found", { replace: true });
        });
    },
    [navigate]
  );

  useEffect(() => {
    if (bookId) {
      getBookDetail(bookId);
    }
  }, [bookId, getBookDetail]);

  return (
    <div className="app">
      <Loading isLoading={isLoading} />
      <div className="list-books">
        <div className="list-books-title-detail">
          <a className="close-detail" href="/">
            Close
          </a>
          <h1>{bookDetail?.title || EMPTY_STRING}</h1>
        </div>

        <img
          alt="book"
          className="book-cover"
          src={bookDetail?.imageLinks?.thumbnail}
          style={{
            width: 400,
            aspectRatio: "3/4",
            // height: 193,
          }}
        ></img>
        <div className="book-detail-text">
          Subtitle: {bookDetail?.subtitle || EMPTY_STRING}
        </div>
        <div className="book-detail-text">
          Authors: {bookDetail?.authors?.join()}
        </div>
        <div className="book-detail-text">
          Description: {bookDetail?.description || EMPTY_STRING}
        </div>
        <div className="book-detail-text">
          Content version: {bookDetail?.contentVersion || EMPTY_STRING}
        </div>
      </div>
    </div>
  );
}
