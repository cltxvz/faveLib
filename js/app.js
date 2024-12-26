// DOM Elements
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
const bookCountValue = document.getElementById('book-count-value');
const categorySelect = document.getElementById('category');
const customCategoryGroup = document.getElementById('custom-category-group');
const customCategoryInput = document.getElementById('custom-category');


// Library Array
let library = [];

// Generate Unique ID
function generateUniqueId() {
  return `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Load Library from LocalStorage
function loadLibrary() {
  const savedLibrary = localStorage.getItem('library');
  if (savedLibrary) {
    library = JSON.parse(savedLibrary).map(
      (book) =>
        new Book(
          book.title,
          book.author,
          book.category || 'Uncategorized',
          book.isRead || false,
          book.isFavorite || false,
          book.rating || 0,
          book.dateAdded || new Date().toISOString(),
          book.id || generateUniqueId() // Preserve ID if it exists
        )
    );
  }
}


// Save Library to LocalStorage
function saveLibrary() {
  localStorage.setItem('library', JSON.stringify(library));
}

// Show/Hide Custom Category Input
categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'Other') {
    customCategoryGroup.style.display = 'block';
    customCategoryInput.required = true;
  } else {
    customCategoryGroup.style.display = 'none';
    customCategoryInput.required = false;
    customCategoryInput.value = ''; // Clear custom input
  }
});

// Handle Category Selection Change
categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'Other') {
    customCategoryGroup.style.display = 'block';
    customCategoryInput.required = true;
  } else {
    customCategoryGroup.style.display = 'none';
    customCategoryInput.required = false;
    customCategoryInput.value = '';
  }
});

// Display Books
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
      if (sort === 'date-newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (sort === 'date-oldest') return new Date(a.dateAdded) - new Date(b.dateAdded);
      if (sort === 'category') return a.category.localeCompare(b.category);
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
        <p><strong>Category:</strong> ${book.category}</p>
        <div class="book-actions">
          <button onclick="editBook('${book.id}')">Edit</button>
          <button onclick="deleteBook('${book.id}')">Delete</button>
        </div>
      `;
      bookList.appendChild(bookItem);
    });
  updateBookCount();
}

// Update Rating
function updateRating(id, newRating) {
  const book = library.find((b) => b.id === id);
  if (book) {
    book.rating = parseInt(newRating, 10);
    saveLibrary();
    displayBooks();
  }
}

// Edit Book
function editBook(id) {
  const book = library.find((b) => b.id === id);
  if (book) {
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('category').value = book.category || 'Uncategorized';
    document.getElementById('isRead').checked = book.isRead;
    document.getElementById('isFavorite').checked = book.isFavorite;
    document.getElementById('rating').value = book.rating;

    // Check if the category is custom
    if (
      ![...categorySelect.options].map((option) => option.value).includes(book.category)
    ) {
      categorySelect.value = 'Other';
      customCategoryGroup.style.display = 'block';
      customCategoryInput.required = true;
      customCategoryInput.value = book.category;
    } else {
      customCategoryGroup.style.display = 'none';
      customCategoryInput.required = false;
      customCategoryInput.value = '';
    }

    bookForm.dataset.editingId = id;

    document.querySelector('.modal-content h2').innerText = 'Edit a Book';
    document.querySelector('#book-form button').innerText = 'Edit Book';

    modal.style.display = 'block';
  }
}

// Add or Update Book
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const category =
    categorySelect.value === 'Other'
      ? customCategoryInput.value.trim()
      : categorySelect.value;
  const isRead = document.getElementById('isRead').checked;
  const isFavorite = document.getElementById('isFavorite').checked;
  const rating = parseInt(document.getElementById('rating').value, 10);

  if (!title || !author || !category) {
    alert('Please fill in all required fields.');
    return;
  }

  const editingId = bookForm.dataset.editingId;

  if (editingId) {
    const book = library.find((b) => b.id === editingId);
    if (book) {
      book.title = title;
      book.author = author;
      book.category = category;
      book.isRead = isRead;
      book.isFavorite = isFavorite;
      book.rating = rating;
    }
    delete bookForm.dataset.editingId;
  } else {
    const newBook = new Book(title, author, category, isRead, isFavorite, rating);
    library.push(newBook);
  }

  saveLibrary();
  displayBooks();
  bookForm.reset();
  modal.style.display = 'none';
});

// Modal Logic - Add New Book
addBookBtn.addEventListener('click', () => {
  bookForm.reset();
  delete bookForm.dataset.editingId;
  document.querySelector('.modal-content h2').innerText = 'Add a New Book';
  document.querySelector('#book-form button').innerText = 'Add Book';

  // Reset custom category visibility
  customCategoryGroup.style.display = 'none';
  customCategoryInput.required = false;
  customCategoryInput.value = '';

  modal.style.display = 'block';
});


// Modal Logic - Close Modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Clear Entire Library
clearLibraryBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the entire library?')) {
    library = [];
    saveLibrary();
    displayBooks();
  }
});

// Export Library
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'library.json';
  a.click();
});

// Import Library
importBtn.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);

      // Validate the imported data
      if (!Array.isArray(importedData)) {
        throw new Error('Invalid JSON structure: Expected an array');
      }

      library = importedData.map((book) => {
        const importedBook = new Book(
          book.title,
          book.author,
          book.category || 'Uncategorized',
          book.isRead || false,
          book.isFavorite || false,
          book.rating || 0,
          book.dateAdded || new Date().toISOString()
        );

        // Preserve the original ID if it exists
        if (book.id) {
          importedBook.id = book.id;
        }

        return importedBook;
      });

      saveLibrary();
      displayBooks();
      alert('Library imported successfully!');
    } catch (error) {
      console.error('Error importing library:', error);
      alert('Invalid file format. Please upload a valid JSON file.');
    }
  };

  reader.readAsText(file);
});

// Update Book Count
function updateBookCount() {
  bookCountValue.textContent = library.length;
}

// Event Listeners
searchInput.addEventListener('input', displayBooks);
filterSelect.addEventListener('change', displayBooks);
sortSelect.addEventListener('change', displayBooks);

// Initialize App
loadLibrary();
displayBooks();
