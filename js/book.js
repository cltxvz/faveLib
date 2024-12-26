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

  generateId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}
