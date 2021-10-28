import React from 'react'
import './App.css'
import Shelf from "./bookshelf";

class WebTitle extends React.Component {
    render() {
        return (
            <div className="list-books-title">
                <h1>MyReads</h1>
            </div>
        )
    }
}

class BooksApp extends React.Component {
    state = {
        /**
         * Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        showSearchPage: false,
        bookToAdd: [],
        bookAdded: false,
    }


    render() {
        return (
            <div className="app">
                <WebTitle/>


                <Shelf />
            </div>
        )
    }

    closeSearchPage = () => {
        this.setState({
            showSearchPage: false
        })
    }

    bookAdded = () => {
       this.setState({ bookAdded: true })
    }

/*
    updateBookToAdd = (data) => {
        const {bookId, toShelf} = data
        console.log("updateBookToAdd", data)
    }
*/
}

export default BooksApp
