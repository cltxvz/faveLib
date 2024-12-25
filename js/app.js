// Create variables
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
let library = [];
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

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

// Add modal logic
document.getElementById('add-book-btn').addEventListener('click', () => {
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Confirm delete
function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    library = library.filter((b) => b.id !== id);
    displayBooks();
  }
}

// Export Library Function
document.getElementById('export').addEventListener('click', () => {
  if (library.length === 0) {
    alert('Library is empty. Nothing to export!');
    return;
  }
  
  const dataStr = JSON.stringify(library, null, 2); // Beautify JSON output
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'library.json';
  document.body.appendChild(a); // Required for Firefox
  a.click();
  document.body.removeChild(a); // Cleanup
  URL.revokeObjectURL(url); // Free up resources
});

// Import Library Function
document.getElementById('import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    library = JSON.parse(e.target.result);
    displayBooks();
  };
  reader.readAsText(file);
});


// Call loadLibrary on initialization
loadLibrary();
displayBooks();
