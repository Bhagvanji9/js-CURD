let body;
let tbody = document.querySelector("tbody");
let addBody = `
    <div class="container">
        <div class="product-form">
        <div class="extraDiv">
        <div class="title">
            <h2>
                <center>Product Form</center>
            </h2>
          
        </div>
            <form class="fill-form" id="fill-form">
                <div class="form-data">
                    <div> <label>Product Name*:</label></div>
                    <input type="text" name="ProductName" id="ProductName" required>
                </div>
                <div class="form-data">
                    <div> <label>Image *</label></div>
                    <input type="file" name="image" id="image">
                </div>
                <div class="form-data">
                    <div> <label>Price *</label></div>
                    <input type="number" name="price" id="price" required>
                    
                </div>
                <div class="form-data">
                    <div> <label>Description</label></div>
                    <textarea name="description" id="description" cols="30" rows="10"></textarea>
                </div>
                <div class="form-data form-submit">
                    <input type="submit" value="Add Product">
                </div>
            </form>
            </div>
            <div class="backDiv1">
            <button id="back1">Back</button>
        </div>
        </div>
        `;

// --------------------------------------Store All LocalStorage data in to Array-------------------------------------------
let allProduct = [];
function addProductInArray() {
  for (key in localStorage) {
    let currentObject = JSON.parse(localStorage.getItem(key));
    if (currentObject != null) {
      allProduct.push(currentObject);
    }
  }
}
addProductInArray();

// --------------------------------------Display All Data-------------------------------------------

function getData() {
  for (key of allProduct) {
    if (String(key) != "null") {
      insetNewRow(key);
    }
    body = document.body.innerHTML;
  }
}

// --------------------------------------Insert New row-------------------------------------------

function insetNewRow(data) {
  let product = tbody.insertRow(-1);
  let productCol1 = product.insertCell(0);
  let productCol2 = product.insertCell(1);
  let productCol3 = product.insertCell(2);
  let productCol4 = product.insertCell(3);
  let productCol5 = product.insertCell(4);
  let productCol6 = product.insertCell(5);
  productCol1.innerHTML = data.ProductId;
  productCol2.innerHTML = data.ProductName;
  productCol3.innerHTML = `<div class="product-Image"><img src="${data.image}" alt=""></div>`;
  productCol4.innerHTML = data.price;
  productCol5.innerHTML = data.description;
  productCol6.innerHTML =
    '<div class="editAndDeletr"><button class="edit">Edit</button> <button class="deleted">Delete</button></div>';
}

// --------------------------------------Add Product-------------------------------------------

let add = document.querySelector(".addProduct button");
function addProduct() {
  add.addEventListener("click", () => {
    document.body.innerHTML = addBody;
    setIntoLocalStorage();
    back("back1");
  });
}

let image, pImage, pId, pName, pPrice, pDetail, reader;
pId = generateId();
function setIntoLocalStorage() {
  let form = document.getElementById("fill-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    pImage = document.getElementById("image").files[0];
    pName = document.getElementById("ProductName").value;
    pPrice = document.getElementById("price").value;
    pDetail = document.getElementById("description").value;
    reader = new FileReader();
    reader.readAsDataURL(pImage);
    reader.addEventListener("load", () => {
      image = reader.result;
      let name = {
        ProductId: pId,
        ProductName: pName,
        image: image,
        price: pPrice,
        description: pDetail,
      };

      localStorage.setItem(pId, JSON.stringify(name));
      insetNewRow(name);
      document.body.innerHTML = body;
      // location.reload();
    });
  });
}
function generateId() {
  let id = `${Date.now()}`;
  return id.substring(0, 10);
}

function editData(currentObject) {
  document.getElementById("ProductName").value = currentObject.ProductName;
  document
    .querySelector(".product-Image1 img")
    .setAttribute("src", currentObject.image);

  document.getElementById("price").value = currentObject.price;

  document.getElementById("description").value = currentObject.description;

  pId = currentObject.ProductId;
  let form = document.getElementById("fill-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    pImage = document.getElementById("image").files[0];
    pName = document.getElementById("ProductName").value;
    pPrice = document.getElementById("price").value;
    pDetail = document.getElementById("description").value;

    if (document.getElementById("image").files.length == 0) {
      image = currentObject.image;
      let name = {
        ProductId: pId,
        ProductName: pName,
        image: image,
        price: pPrice,
        description: pDetail,
      };
      localStorage.setItem(pId, JSON.stringify(name));
      window.location = "/";
      insetNewRow(name);
      document.body.innerHTML = body;
      location.reload();
    } else {
      reader = new FileReader();
      reader.readAsDataURL(pImage);
      reader.addEventListener("load", () => {
        image = reader.result;
        let name = {
          ProductId: pId,
          ProductName: pName,
          image: image,
          price: pPrice,
          description: pDetail,
        };
        localStorage.setItem(pId, JSON.stringify(name));
        window.location = "/";
        insetNewRow(name);
        document.body.innerHTML = body;
        location.reload();
      });
    }
  });
}
// --------------------------------------Delete or Edit Product-------------------------------------------
function EditOrDelete() {
  let deleteFilteredRow = document.querySelectorAll(".editAndDeletr");
  deleteFilteredRow.forEach((button) => {
    let getId =
      button.lastChild.parentNode.parentNode.parentNode.cells[0].innerHTML;
    button.onclick = (e) => {
      e.preventDefault();
      if (e.target == button.lastChild) {
        console.log("object");
        e.preventDefault();
        if (confirm("Are you Sure to delete this procudt?")) {
          localStorage.removeItem(getId);
          location.reload();
        }
      } else if (e.target == button.firstChild) {
        window.location = "./edit.html?" + getId;
      }
    };
  });
}
EditOrDelete();
// --------------------------------------Filter Product-------------------------------------------

let searchBtn = document.getElementById("searchBtn");
function searchId() {
  searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    search(event);
  });

  function search(event) {
    Sort.setAttribute("disabled", true);
    let data = document.getElementById("searchInput").value;
    let currentObject = JSON.parse(localStorage.getItem(data));
    if (data in localStorage) {
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      insetNewRow(currentObject);
    } else {
      add.parentNode.style.display = "none";
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      document.body.innerHTML += `<div class="incorrect">PRODUCT  NOT  FOUND!!! <br>PLEASE ENTER CURRECT ID...</div> `;
    }
    EditOrDelete();
    goBack();
  }
}

// --------------------------------------Sort Product-------------------------------------------

let Sort = document.querySelector(".sort select");
let index;
function sortProduct() {
  Sort.addEventListener("click", (e) => {
    document.getElementById("search").style.display = "none";
    let sortBy = e.target.value;
    switch (sortBy) {
      case "id":
        SortTableData("ProductId");
        goBack();
        Sort.setAttribute("disabled", true);
        break;
      case "price":
        SortTableData("price");
        goBack();
        Sort.setAttribute("disabled", true);
        break;
      case "name":
        SortTableData("ProductName");
        goBack();
        Sort.setAttribute("disabled", true);
        break;
      default:
        break;
    }
    getData();
    EditOrDelete();
  });
}

function SortTableData(para) {
  if (para == "ProductName") {
    allProduct.sort((a, b) => (a[para] > b[para] ? 1 : -1));
  } else {
    allProduct.sort((a, b) => a[para] - b[para]);
  }
  tbody.innerHTML = "";
}

// --------------------------------------Go back-------------------------------------------

function goBack() {
  add.parentNode.style.display = "none";
  document.getElementById("clear").innerHTML += `<div class="backDiv">
  <button id="back">clear</button>
  </div>`;
  back("back");
}

function back(data) {
  document.getElementById(`${data}`).addEventListener("click", () => {
    window.location = "/";
  });
}

if (location.pathname == "/") {
  getData();
  addProduct();
  sortProduct();
  searchId();
  EditOrDelete();
} else if (location.pathname == "/edit.html") {
  getId = location.search.substring(1, location.search.length);
  let currentObject = JSON.parse(localStorage.getItem(getId));
  editData(currentObject);
  back("back1");
}
