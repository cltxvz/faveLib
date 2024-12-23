// Create variables
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
let library = [];
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

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

// Display all books and update save calls
function displayBooks() {
  bookList.innerHTML = '';
  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  library
    .filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm);
      const matchesFilter = filter === 'all' ||
                            (filter === 'read' && book.isRead) ||
                            (filter === 'unread' && !book.isRead);
      return matchesSearch && matchesFilter;
    })
    .forEach((book) => {
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
  // Ensure you're removing from the main library array
  library = library.filter((book) => book.id !== id);
  saveLibrary(); // Save updated library to localStorage
  displayBooks(); // Re-render the library after deletion
}

// Save to localStorage
function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}

// Load from localStorage
function loadLibrary() {
  const savedLibrary = localStorage.getItem('library');
  if (savedLibrary) {
    library = JSON.parse(savedLibrary).map(
      (book) => new Book(book.title, book.author, book.pages, book.isRead)
    );
  }
}

// Add search and filter functionalities
searchInput.addEventListener('input', displayBooks);
filterSelect.addEventListener('change', displayBooks);



// Call loadLibrary on initialization
loadLibrary();
displayBooks();
