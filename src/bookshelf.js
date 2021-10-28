import React from "react";
import * as BooksAPI from "./BooksAPI";
import SearchPage from "./searchPage";

class Shelf extends React.Component {
    state = {
        books: [],
        reading: [],
        wantToRead: [],
        read: [],
        showSearchPage: false
    }

    componentDidMount() {
        BooksAPI.getAll().then((data) => {
            this.setState({
                books: data
            })

            this.groupByShelf()
        })

    }


    render() {
        return (
            <div>
                {this.state.showSearchPage ? (
                    <div className="search-books">
                        {/*<button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>*/}
                        <SearchPage onCloseSearch={this.closeSearchPage} onAddBook={ this.addBookToShelf }/>
                    </div>
                ) : (
                    <div className="open-search">
                        <button onClick={() => this.setState({showSearchPage: true})}>Add a book</button>
                    </div>
                )}
                <div className="bookshelf">
                    <h2 className="bookshelf-title">Reading</h2>
                    <div className="bookshelf-books">
                        <Book books={this.state.reading} onChangeShelf={this.handleChangeCategory}/>
                    </div>

                    <h2 className="bookshelf-title">Want To Read</h2>
                    <div className="bookshelf-books">
                        <Book books={this.state.wantToRead} onChangeShelf={this.handleChangeCategory}/>
                    </div>

                    <h2 className="bookshelf-title">Already Read</h2>
                    <div className="bookshelf-books">
                        <Book books={this.state.read} onChangeShelf={this.handleChangeCategory}/>
                    </div>
                </div>
            </div>
        )
    }

    addBookToShelf = (data) => {
        const {book, toShelf} = data
        console.log("book", book)
        let updatedbooks = this.state.books
        updatedbooks = updatedbooks.filter(b => b.id !== book.id)
        book.shelf = toShelf
        updatedbooks.push(book)

        BooksAPI.update(book, toShelf).then((res) => {
            console.log("updateResult", res)
            this.setState({ books: updatedbooks })
            this.groupByShelf()
        })
    }

    closeSearchPage = () => {
        this.setState({
            showSearchPage: false
        })
    }

    groupByShelf = () => {
        let reading = this.state.books.filter((b) => b.shelf === "currentlyReading")
        let wantTo = this.state.books.filter((b) => b.shelf === "wantToRead")
        let read = this.state.books.filter((b) => b.shelf === "read")
        this.setState({reading: reading})
        this.setState({wantToRead: wantTo})
        this.setState({read: read})
    }


    handleChangeCategory = (data) => {
        const {bookId, toShelf} = data
        console.log(bookId, "to", toShelf)

        // TODO: move to "none" group will delete the book?
        if (toShelf === "none" || toShelf === "move"){ return null }

        let newBooks = this.state.books
        let bookIndex = newBooks.findIndex(i => i.id === bookId)

        if (this.state.books[bookIndex].shelf === toShelf) { return null }

        newBooks[bookIndex].shelf = toShelf
        console.log(newBooks)

        // update db
        BooksAPI.update(this.state.books[bookIndex], toShelf).then((res) => {
            console.log("updateResult", res)
            this.setState({
                books: newBooks
            })
            this.groupByShelf()
        })
    }

}

class Book extends React.Component {
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
                                    <select value="none" onChange={ e => this.handleChangeShelf(b.id, e.target.value) }>
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
       this.props.onChangeShelf({ bookId, toShelf })
    }

}

export default Shelf