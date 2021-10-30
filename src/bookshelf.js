import React from "react";
import * as BooksAPI from "./BooksAPI";
import SearchPage from "./searchPage";
import {Link, Route} from "react-router-dom";
import {Book} from "./book";

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
                <Route exact path={"/search"} render={()=>{
                    return <div className="search-books bookshelf">
                        <h2 className={"bookshelf-title"} style={{color: "#7e7e7e"}}>Search Result</h2>
                        <SearchPage onCloseSearch={this.closeSearchPage} onAddBook={this.addBookToShelf} myBooks={this.state.books}/>
                    </div>
                }}/>

                <div className="open-search">
                    <Link to={"/search"} onClick={()=> {this.setState({showSearchPage: true})}}>
                        <button>Add a book</button>
                    </Link>
                </div>

                <Route exact path={"/"} render={_=>{
                    return <div className="bookshelf">
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
                }}/>
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
            this.setState({books: updatedbooks})
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

        if (toShelf === "none" || toShelf === "move") {
            return null
        }

        let newBooks = this.state.books
        let bookIndex = newBooks.findIndex(i => i.id === bookId)

        if (this.state.books[bookIndex].shelf === toShelf) {
            return null
        }

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

export default Shelf