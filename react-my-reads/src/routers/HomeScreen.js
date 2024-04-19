import { useCallback, useEffect, useState } from "react";
import { getAll, update } from "../BooksAPI";
import Loading from "../components/Loading";
import Book from "../components/Book";
import { GROUP_NAME_BY_SHELF } from "../constants/common";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [listBooksByShelf, setListBooksByShelf] = useState({});

  useEffect(() => {
    setIsLoading(true);
    getAll().then((res) => {
      if (res) {
        const newValue = {
          read: [],
          wantToRead: [],
          currentlyReading: [],
        };
        res?.map((item) => {
          return newValue[item.shelf].push(item);
        });
        setIsLoading(false);
        setListBooksByShelf(newValue);
      }
    });
  }, []);

  const onUpdateBookShelf = useCallback(
    async (book, shelf, start, end) => {
      try {
        setIsLoading(true);
        const res = await update(book, shelf);

        if (res && Object.values(res).length) {
          setIsLoading(false);

          const newValue = { ...listBooksByShelf };
          const startPosition = newValue[start.key];

          if (shelf !== "none") {
            const finishPostion = newValue[end || shelf];

            finishPostion.push({
              ...newValue[start.key][start.index],
              shelf: shelf,
            });
          }

          startPosition.splice(start.index, 1);
          setListBooksByShelf(newValue);
        } else {
          throw Error();
        }
      } catch (error) {
        setIsLoading(false);
        return;
      }
    },
    [listBooksByShelf]
  );

  const onDragEnd = useCallback(
    async ({ destination, source }) => {
      if (!destination) {
        return;
      }

      if (destination?.droppableId === source?.droppableId) {
        return;
      }

      const start = listBooksByShelf[source?.droppableId];

      await onUpdateBookShelf(
        start[source?.index],
        destination?.droppableId,
        { index: source?.index, key: source?.droppableId },
        destination?.droppableId
      );
    },
    [listBooksByShelf, onUpdateBookShelf]
  );

  return (
    <div className="app">
      <Loading isLoading={isLoading} />
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.keys(GROUP_NAME_BY_SHELF).map((group) => {
              return (
                <div className="bookshelf" key={group}>
                  <h2 className="bookshelf-title">
                    {GROUP_NAME_BY_SHELF[group]}
                  </h2>
                  <div className="bookshelf-books">
                    <Droppable
                      droppableId={group}
                      key={group}
                      direction="horizontal"
                    >
                      {(dropProvider) => (
                        <div
                          ref={dropProvider.innerRef}
                          className="bookshelf-books"
                          key={group}
                          {...dropProvider.droppableProps}
                        >
                          <ol className="books-grid" key={group}>
                            {(listBooksByShelf[group] || []).map(
                              (book, index) => (
                                <Draggable
                                  key={book.id}
                                  draggableId={book.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <li
                                      ref={(ref) => provided.innerRef(ref)}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      key={book.id}
                                    >
                                      <Book
                                        {...book}
                                        onClick={() => {
                                          navigate("/books/" + book.id);
                                        }}
                                        onSelectShelf={async (event) => {
                                          const shelf =
                                            event.currentTarget.value;
                                          await onUpdateBookShelf(book, shelf, {
                                            key: group,
                                            index,
                                          });
                                        }}
                                      />
                                    </li>
                                  )}
                                </Draggable>
                              )
                            )}
                          </ol>
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </DragDropContext>
        </div>
        <div className="open-search">
          <a href="/search">Add a book</a>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
