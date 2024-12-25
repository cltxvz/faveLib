class Book {
  constructor(title, author, pages, isRead, isFavorite, rating) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.isFavorite = isFavorite;
    this.rating = rating;
    this.dateAdded = new Date();
  }

  toggleReadStatus() {
    this.isRead = !this.isRead;
  }
}
