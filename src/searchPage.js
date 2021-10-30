import React from "react";
import * as BooksAPI from "./BooksAPI"
import {Link} from "react-router-dom";

class SearchPage extends React.Component {
    state = {
        searchResult: []
    }

    render() {
        let noResults;
        let queryRes = this.state.searchResult;
        if (this.state.searchResult.length === 0){
            noResults = <p>no results.</p>
        } else {
            noResults = null
        }
        if (queryRes.error){
            noResults = <p>Bad query: {queryRes.error}</p>
        }

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className={"close-search"} to={"/"}>Ret</Link>
                    <div className="search-books-input-wrapper">
                        {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                        <input type="text" placeholder="Search by title or author"
                               onInput={(e) => this.handleSearch(e)}/>
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {noResults}
                        {this.state.searchResult.length > 0 && this.state.searchResult.map((b) => {
                            try {
                                let t = b.imageLinks.thumbnail
                            } catch (e){
                                console.log("skip loading due to loss of thumbnail")
                                return
                            }
                            return (
                                <li key={b.id}>
                                    <div className="book">
                                        <div className="book-top">
                                            <div className="book-cover" style={{
                                                width: 128,
                                                height: 193,
                                                backgroundImage: "url(" + b.imageLinks.thumbnail + ")"
                                            }}></div>
                                            <div className="book-shelf-changer">
                                                <select value="none"
                                                        onChange={e => this.handleAddBook(b, e.target.value)}>
                                                    <option value="move" disabled>Move to...</option>
                                                    <option value="currentlyReading">Currently Reading</option>
                                                    <option value="wantToRead">Want to Read</option>
                                                    <option value="read">Read</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="book-title">{b.title}</div>
                                        <div className="book-authors">{b.authors ? b.authors.toString() : ""}</div>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        )
    }

    handleSearch(e) {
        let searchTerm = e.target.value
        if (searchTerm === "") {
            this.setState({searchResult: []})
            return
        }
        console.log("handle search", searchTerm)
        BooksAPI.search(searchTerm).then((res) => {
            this.setState({
                searchResult: res
            })
        })
    }

    handleCloseSearch(e) {
        e.preventDefault()
        console.log("handle close search")
        this.props.onCloseSearch(e)
    }

    handleAddBook(book, toShelf) {
        // console.log("handle add book", book, "to", toShelf)
        // BooksAPI.update(book, toShelf).then(r => {
        //     console.log(r)
        // })
        this.props.onAddBook({book, toShelf})
    }
}

export default SearchPage