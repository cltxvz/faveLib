const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
let library = [];

// Add a new book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const isRead = document.getElementById('isRead').checked;

  const newBook = new Book(title, author, pages, isRead);
  library.push(newBook);
  displayBooks();
  bookForm.reset();
});

// Display all books
function displayBooks() {
  bookList.innerHTML = '';
  library.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.className = 'book';
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.isRead ? 'Read' : 'Unread'}</p>
      <button onclick="toggleRead(${book.id})">Toggle Read</button>
      <button onclick="deleteBook(${book.id})">Delete</button>
    `;
    bookList.appendChild(bookItem);
  });
}

// Toggle read status
function toggleRead(id) {
  const book = library.find((b) => b.id === id);
  if (book) {
    book.toggleReadStatus();
    displayBooks();
  }
}

// Delete a book
function deleteBook(id) {
  library = library.filter((b) => b.id !== id);
  displayBooks();
}
