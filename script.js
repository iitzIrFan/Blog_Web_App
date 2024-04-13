const blogContainer = document.querySelector('.blog__container');
const blogModal = document.querySelector(".blog__modal__body");
let globalStore = [];

const newCard = ({ id, imageUrl, blogTitle, blogType, blogDescription }) => {
  return `<div class="col-lg-4 col-md-6" id=${id}>
    <div class="card m-2">
      <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success" id="${id}" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id="${id}" onclick="editCard.apply(this, arguments)"></i></button>
        <button type="button" class="btn btn-outline-danger" id="${id}" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id="${id}" onclick="deleteCard.apply(this, arguments)"></i></button>
      </div>
      <img src=${imageUrl} class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${blogTitle}</h5>
        <p class="card-text">${blogDescription}</p>
        <span class="badge bg-primary">${blogType}</span>
      </div>
      <div class="card-footer text-muted">
        <button type="button" id="${id}" class="btn btn-outline-primary float-end" data-bs-toggle="modal" data-bs-target="#showblog" onclick="openBlog.apply(this, arguments)">Open Blog</button>
      </div>
    </div>
  </div>`;
};

const loadData = () => {
  const getInitialData = localStorage.blog;
  if (!getInitialData) return;

  const { cards } = JSON.parse(getInitialData);
  cards.forEach(blogObject => {
    const createNewBlog = newCard(blogObject);
    blogContainer.insertAdjacentHTML("beforeend", createNewBlog);
    globalStore.push(blogObject);
  });
};

const updateLocalStorage = () => {
  localStorage.setItem("blog", JSON.stringify({ cards: globalStore }));
};

const saveChanges = () => {
  // Get values from input fields
  const imageUrl = document.getElementById('imageurl').value;
  const blogTitle = document.getElementById('title').value;
  const blogType = document.getElementById('type').value;
  const blogDescription = document.getElementById('description').value;

  // Check if any of the fields are empty
  if (!imageUrl || !blogTitle || !blogType || !blogDescription) {
    alert('Please fill in all fields');
    return;
  }

  const blogData = {
    id: `${Date.now()}`,
    imageUrl,
    blogTitle,
    blogType,
    blogDescription
  };

  const createNewBlog = newCard(blogData);
  blogContainer.insertAdjacentHTML("beforeend", createNewBlog);

  globalStore.push(blogData);
  updateLocalStorage();

  // Reset input fields
  document.getElementById('imageurl').value = '';
  document.getElementById('title').value = '';
  document.getElementById('type').value = '';
  document.getElementById('description').value = '';
};

const deleteCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  globalStore = globalStore.filter((blogObject) => blogObject.id !== targetID);
  updateLocalStorage();

  const parentElement = tagname === "BUTTON" ? event.target.parentNode.parentNode.parentNode : event.target.parentNode.parentNode.parentNode.parentNode;
  blogContainer.removeChild(parentElement);
};

const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  const parentElement = tagname === "BUTTON" ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode;

  const blogTitle = parentElement.querySelector('.card-title');
  const blogDescription = parentElement.querySelector('.card-text');
  const blogType = parentElement.querySelector('.badge');
  const submitBtn = parentElement.querySelector('.btn-outline-primary');

  blogTitle.contentEditable = true;
  blogDescription.contentEditable = true;
  blogType.contentEditable = true;
  submitBtn.setAttribute("onclick", "saveEditChanges.apply(this, arguments)");
  submitBtn.innerHTML = "Save Changes";
  submitBtn.removeAttribute("data-bs-toggle");
  submitBtn.removeAttribute("data-bs-target");
};

const saveEditChanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;
  const parentElement = tagname === "BUTTON" ? event.target.parentNode.parentNode : event.target.parentNode.parentNode.parentNode;

  const blogTitle = parentElement.querySelector('.card-title');
  const blogDescription = parentElement.querySelector('.card-text');
  const blogType = parentElement.querySelector('.badge');
  const submitBtn = parentElement.querySelector('.btn-outline-primary');

  const updatedData = {
    blogTitle: blogTitle.innerHTML,
    blogDescription: blogDescription.innerHTML,
    blogType: blogType.innerHTML,
  };

  globalStore = globalStore.map((blog) => {
    if (blog.id === targetID) {
      return { id: blog.id, imageUrl: blog.imageUrl, ...updatedData };
    }
    return blog;
  });

  updateLocalStorage();

  blogTitle.contentEditable = false;
  blogDescription.contentEditable = false;
  blogType.contentEditable = false;
  submitBtn.setAttribute("onclick", "openBlog.apply(this, arguments)");
  submitBtn.setAttribute("data-bs-toggle", "modal");
  submitBtn.setAttribute("data-bs-target", "#showblog");
  submitBtn.innerHTML = "Open Blog";
};

const htmlModalContent = ({ id, blogTitle, blogDescription, imageUrl, blogType }) => {
  const date = new Date(parseInt(id));
  return `<div id=${id}>
    <img src=${imageUrl} alt="bg image" class="img-fluid place__holder__image mb-3 p-4" />
    <div class="text-sm text-muted ">Created on ${date.toDateString()}</div>
    <h2 class="my-5 mt-5" style="display:inline;">${blogTitle}</h2>
    <span class="badge bg-primary">${blogType}</span>
    <p class="lead mt-2">${blogDescription}</p>
  </div>`;
};

const openBlog = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const getBlog = globalStore.find(blog => blog.id === targetID);
  blogModal.innerHTML = htmlModalContent(getBlog);
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
