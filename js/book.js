/**
   This class represents a book in the library with properties like title, author, category, etc.
 
   Here are the details for the constructor:

   title (string) - The title of the book.
   author (string) - The author of the book.
   category (string) - The category of the book. This one is initialized as 'Uncategorized'.
   isRead (boolean) - Read status of the book. This one is initialized as false.
   isFavorite (boolean) - Favorite status of the book. This one is initialized as false.
   rating (int) - Rating given to the book (0-5). This one is initialized as 0.
   dateAdded (string) - Date the book was added. This one is initialized with the current date at the moment of creation.
   id (string) - Unique identifier for the book. This one is initialized as null.
*/

class Book {
  constructor(
    title,
    author,
    category = 'Uncategorized',
    isRead = false,
    isFavorite = false,
    rating = 0,
    dateAdded = new Date().toISOString(),
    id = null
  ) {
    this.id = id || this.generateId(); // Use imported ID if it exists, else generate a new one
    this.title = title;
    this.author = author;
    this.category = category || 'Uncategorized';
    this.isRead = isRead;
    this.isFavorite = isFavorite;
    this.rating = rating;
    this.dateAdded = dateAdded;
  }

  // Generates a unique ID by combining timestamp and random digits.
  generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}
