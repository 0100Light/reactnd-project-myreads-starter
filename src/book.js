import React from "react";

export class Book extends React.Component {
    render() {
        const books = this.props.books

        return <ol className="books-grid">
            {
                books.map((b) => (
                    <li key={b.id}>
                        <div className="book">
                            <div className="book-top">
                                <div className="book-cover" style={{
                                    width: 128,
                                    height: 193,
                                    backgroundImage: "url(" + b.imageLinks.thumbnail + ")"
                                }}></div>
                                <div className="book-shelf-changer">
                                    <select value={b.shelf} onChange={e => this.handleChangeShelf(b.id, e.target.value)}>
                                        <option value="move" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{b.title}</div>
                            <div className="book-authors">{b.authors ? b.authors.toString() : ""}</div>
                        </div>
                    </li>
                ))
            }
        </ol>
    }

    handleChangeShelf = (bookId, toShelf) => {
        this.props.onChangeShelf({bookId, toShelf})
    }

}