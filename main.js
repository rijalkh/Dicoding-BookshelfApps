const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (bookitem of books) {
    if (bookitem.id === bookId) {
      return bookitem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function save() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const titleBook = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookCheck = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();

  const todoObject = generateTodoObject(
    generatedID,
    titleBook,
    bookAuthor,
    bookYear,
    bookCheck
  );
  books.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  save();
}

function makeBookList(BookListObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = BookListObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis : " + BookListObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + BookListObject.year;

  const Container = document.createElement("article");
  Container.classList.add("book_item");
  Container.append(textTitle, textAuthor, textYear);
  Container.setAttribute("id", `todo-${BookListObject.id}`);

  if (BookListObject.isCompleted) {
    const containerButton = document.createElement("div");
    containerButton.classList.add("action");

    const selesaiButton = document.createElement("button");
    selesaiButton.classList.add("green");
    selesaiButton.innerText = "Belum selesai dibaca";
    selesaiButton.addEventListener("click", function () {
      undoBookFromCompleted(BookListObject.id);
    });
    containerButton.append(selesaiButton);

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus buku";
    hapusButton.addEventListener("click", function () {
      alert("Yakin hapus?");
      removeBookFromCompleted(BookListObject.id);
    });
    containerButton.append(hapusButton);
    Container.append(containerButton);
  } else {
    const containerButton = document.createElement("div");
    containerButton.classList.add("action");
    const selesaiButton = document.createElement("button");
    selesaiButton.classList.add("green");
    selesaiButton.innerText = "Selesai dibaca";
    selesaiButton.addEventListener("click", function () {
      addBookToCompleted(BookListObject.id);
    });
    containerButton.append(selesaiButton);

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerText = "Hapus buku";
    hapusButton.addEventListener("click", function () {
      alert("Yakin hapus?");
      removeBookFromCompleted(BookListObject.id);
    });
    containerButton.append(hapusButton);
    Container.append(containerButton);
  }

  return Container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  save();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  save();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  save();
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookshelfList = document.querySelector(
    "#incompleteBookshelfList"
  );
  uncompleteBookshelfList.innerHTML = " ";

  const completeBookshelfList = document.querySelector(
    "#completeBookshelfList"
  );
  completeBookshelfList.innerHTML = " ";

  for (bookItem of books) {
    const bookElement = makeBookList(bookItem);

    if (bookItem.isCompleted == false) {
      uncompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});
