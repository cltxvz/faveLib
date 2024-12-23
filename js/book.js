class Book {
    constructor(title, author, pages, isRead) {
      this.id = Date.now(); // Unique ID based on timestamp
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.isRead = isRead;
    }
  
    toggleReadStatus() {
      this.isRead = !this.isRead;
    }
  }
 