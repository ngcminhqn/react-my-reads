import React from "react";
import { EMPTY_STRING } from "../constants/common";

export default function Book({
  id,
  title,
  imageLinks,
  authors,
  onClick,
  shelf,
  onSelectShelf,
}) {
  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          onClick={onClick}
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url(${imageLinks?.smallThumbnail})`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select onChange={onSelectShelf} value={shelf || "none"}>
            <option value="none" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            {shelf ? <option value="none">None</option> : null}
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors?.join() ?? EMPTY_STRING}</div>
    </div>
  );
}
