// DOM Elements
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const addBookBtn = document.getElementById('add-book-btn');
const exportBtn = document.getElementById('export');
const importBtn = document.getElementById('import');

// Library Array
let library = [];

// Load Library from LocalStorage
function loadLibrary() {
  const savedLibrary = localStorage.getItem('library');
  if (savedLibrary) {
    library = JSON.parse(savedLibrary).map(
      (book) => new Book(book.title, book.author, book.pages, book.isRead)
    );
  }
}

// Save Library to LocalStorage
function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}

// Display Books
function displayBooks() {
  bookList.innerHTML = '';

  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  library
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);
      const matchesFilter =
        filter === 'all' ||
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
        <button onclick="toggleRead('${book.id}')">Toggle Read</button>
        <button onclick="deleteBook('${book.id}')">Delete</button>
      `;
      bookList.appendChild(bookItem);
    });
}

// Add a New Book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const pages = parseInt(document.getElementById('pages').value, 10);
  const isRead = document.getElementById('isRead').checked;

  if (!title || !author || isNaN(pages)) {
    alert('Please fill in all fields correctly.');
    return;
  }

  const newBook = new Book(title, author, pages, isRead);
  library.push(newBook);
  saveLibrary();
  displayBooks();
  bookForm.reset();
  modal.style.display = 'none';
});

// Toggle Read Status
function toggleRead(id) {
  const book = library.find((b) => b.id === id);
  if (book) {
    book.toggleReadStatus();
    saveLibrary();
    displayBooks();
  }
}

// Delete a Book
function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    library = library.filter((b) => b.id !== id);
    saveLibrary();
    displayBooks();
  }
}

// Search and Filter Events
searchInput.addEventListener('input', displayBooks);
filterSelect.addEventListener('change', displayBooks);

// Modal Logic
if (addBookBtn) {
  addBookBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
}

if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Export Library
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    if (library.length === 0) {
      alert('Library is empty. Nothing to export!');
      return;
    }

    const dataStr = JSON.stringify(library, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'library.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// Import Library
if (importBtn) {
  importBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedLibrary = JSON.parse(e.target.result);
        library = importedLibrary.map(
          (book) => new Book(book.title, book.author, book.pages, book.isRead)
        );
        saveLibrary();
        displayBooks();
      } catch (error) {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);
  });
}

// Initialize App
loadLibrary();
displayBooks();
