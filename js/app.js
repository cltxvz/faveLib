// 📌 DOM Elements
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const addBookBtn = document.getElementById('add-book-btn');
const exportBtn = document.getElementById('export');
const importBtn = document.getElementById('import');
const clearLibraryBtn = document.getElementById('clear-library-btn');

// 📚 Library Array
let library = [];

// 📦 Load Library from LocalStorage
function loadLibrary() {
  const savedLibrary = localStorage.getItem('library');
  if (savedLibrary) {
    library = JSON.parse(savedLibrary).map(
      (book) =>
        new Book(
          book.title,
          book.author,
          book.pages,
          book.isRead,
          book.isFavorite,
          book.rating,
          book.dateAdded || new Date().toISOString()
        )
    );
  }
}

// 💾 Save Library to LocalStorage
function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}

// 📊 Display Books
function displayBooks() {
  bookList.innerHTML = '';

  const searchTerm = searchInput.value.toLowerCase();
  const filter = filterSelect.value;
  const sort = sortSelect.value;

  library
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'read' && book.isRead) ||
        (filter === 'unread' && !book.isRead) ||
        (filter === 'favorites' && book.isFavorite);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.title.localeCompare(b.title);
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'date') return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    })
    .forEach((book) => {
      const bookItem = document.createElement('div');
      bookItem.className = 'book';
      if (book.isFavorite) bookItem.classList.add('favorite');
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p class="author"><strong>Author:</strong> ${book.author}</p>
        <p><strong>Status:</strong> ${book.isRead ? 'Read' : 'Unread'}</p>
        <p><strong>Rating:</strong> ${book.rating}/5 stars</p>
        <div class="book-actions">
          <button onclick="editBook('${book.id}')">Edit</button>
          <button onclick="deleteBook('${book.id}')">Delete</button>
        </div>
      `;
      bookList.appendChild(bookItem);
    });
}

// ⭐ Update Rating
function updateRating(id, newRating) {
  const book = library.find((b) => b.id === id);
  if (book) {
    book.rating = parseInt(newRating, 10);
    saveLibrary();
    displayBooks();
  }
}

// 🛠️ Edit Book
function editBook(id) {
  const book = library.find((b) => b.id === id);
  if (book) {
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('pages').value = book.pages;
    document.getElementById('isRead').checked = book.isRead;
    document.getElementById('isFavorite').checked = book.isFavorite;
    document.getElementById('rating').value = book.rating;

    bookForm.dataset.editingId = id;

    document.querySelector('.modal-content h2').innerText = 'Edit a Book';
    document.querySelector('#book-form button').innerText = 'Edit Book';

    modal.style.display = 'block';
  }
}

// 📖 Add or Update Book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const pages = parseInt(document.getElementById('pages').value, 10);
  const isRead = document.getElementById('isRead').checked;
  const isFavorite = document.getElementById('isFavorite').checked;
  const rating = parseInt(document.getElementById('rating').value, 10);

  if (!title || !author || isNaN(pages) || pages < 1) {
    alert('Please fill in all fields correctly. Pages must be a positive number.');
    return;
  }

  const editingId = bookForm.dataset.editingId;

  if (editingId) {
    const book = library.find((b) => b.id === editingId);
    if (book) {
      book.title = title;
      book.author = author;
      book.pages = pages;
      book.isRead = isRead;
      book.isFavorite = isFavorite;
      book.rating = rating;
    }
    delete bookForm.dataset.editingId;
  } else {
    const newBook = new Book(title, author, pages, isRead, isFavorite, rating, new Date().toISOString());
    library.push(newBook);
  }

  saveLibrary();
  displayBooks();
  bookForm.reset();
  modal.style.display = 'none';
});

// 📥 Event Listeners
searchInput.addEventListener('input', displayBooks);
filterSelect.addEventListener('change', displayBooks);
sortSelect.addEventListener('change', displayBooks);

// ⚠️ Clear Entire Library
clearLibraryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the entire library?')) {
    library = [];
    saveLibrary();
    displayBooks();
  }
});

// 📤 Export Library
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'library.json';
  a.click();
});

// 📥 Import Library
importBtn.addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    library = JSON.parse(e.target.result).map(
      (book) => new Book(book.title, book.author, book.pages, book.isRead, book.isFavorite, book.rating, book.dateAdded)
    );
    saveLibrary();
    displayBooks();
  };
  reader.readAsText(e.target.files[0]);
});

// 🚀 Initialize App
loadLibrary();
displayBooks();
