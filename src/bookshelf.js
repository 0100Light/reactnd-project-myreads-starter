import React from "react";
import * as BooksAPI from "./BooksAPI";

class Shelf extends React.Component {
    state = {
        books: [],
        reading: [],
        wantToRead: [],
        read: []
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
            <div className="shelf">
                {this.state.books.map((b) => {
                    return (<p key={b.id}>{b.title} | {b.shelf}</p>)
                })}

            </div>
        )
    }

    groupByShelf = () => {
        let reading = this.state.books.filter((b)=> b.shelf === "currentlyReading")
        let wantTo = this.state.books.filter((b)=> b.shelf === "wantToRead")
        let read = this.state.books.filter((b)=> b.shelf === "read")
        this.setState({reading: reading})
        this.setState({wantToRead: wantTo})
        this.setState({read: read})
    }
}


export default Shelf