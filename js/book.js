class Book {
  constructor(title, author, pages, isRead) {
    this.id = crypto.randomUUID(); // Generates a unique ID
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }

  toggleReadStatus() {
    this.isRead = !this.isRead;
  }
}
