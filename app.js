// Traversy Media: Booklist App
// https://www.youtube.com/watch?v=JaMCxVWtW58

// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const StoredBooks = Store.getBooks();

        const books = StoredBooks;

        books.forEach((book) => {
            UI.addBookToList(book)
        }); 
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
         `;

        list.appendChild(row);
    }

    static showAlert(head, message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);

        className = (className === 'danger')? 'error' : className;
        console.log(message+'\t'+className);
        swal(head, message, className);

        // Alert to disappear after 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(elem) {
        if(elem.classList.contains('delete')) {
            elem.parentElement.parentElement.remove();
        }
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book,index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}



// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent default submit
    e.preventDefault();
    
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Oops', 'Please fill in all fields', 'danger');
        // swal("Welcome Aboard!", "You have registered successfully!", "success");
    }
    else {
        // Instantiate Book
        const book = new Book(title, author, isbn);
        // console.log(book);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to store database
        Store.addBook(book);
        
        // Clear input fields
        UI.clearFields();

        UI.showAlert('Woohoo', "Book added successfully!", 'success');
    }
});


// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    // Remove book from UI
    UI.deleteBook(e.target);
    
    // Remove book from store database
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Done', "Book removed successfully!", 'warning');


})