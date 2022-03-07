let form = document.querySelector(".form-user");
let list = document.querySelector(".list-users");
let preloader = document.getElementById("preloader");
let usersSaved;

async function getUsers() {
  onload = preloader.style.display = "block";
  let response = await fetch("http://localhost:4000/users");
  if (response.ok) {
    onload = preloader.style.display = "none";
    await response.json().then((users) => {
      usersSaved = users;
      let strMarkup = "";
      users.forEach((user) => {
        strMarkup += `<div class='user-container'>
                    <p class='users-info'>Name: ${user.name}
                        <i class='material-icons'>account_box</i>
                    </p>
                    <p class='users-info'>Age: ${user.age}</p>
                    <p class='users-info'>Position: ${user.position}</p>
                    <button data-id='${user.id}' class='button-del btn'>Delete</button>
                    <button data-id='${user.id}' class='button-edit btn-margin btn'>Edit</button>
                </div>`;
      });
      list.innerHTML = strMarkup;
      list.addEventListener("click", handleButton);
    });
  }
}
getUsers();

function handleButton(e) {
  console.dir(e.target);
  if (e.target.classList.contains("button-del")) {
    const id = e.target.getAttribute("data-id");
    const status = confirm("Delete user?");
    if (status) {
      fetch(`http://localhost:4000/users/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          getUsers();
        });
    }
  }
  if (e.target.classList.contains("button-edit")) {
    const id = +e.target.getAttribute("data-id");
    let itemUser = usersSaved.find((user) => user.id === id);
    form.elements["id"].value = id;
    form.elements["name"].value = itemUser.name;
    form.elements["age"].value = itemUser.age;
    form.elements["position"].value = itemUser.position;
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const elements = this.elements;
  const id = elements["id"].value;
  if (id !== "0") {
    requestUser("put", elements, id);
  } else {
    requestUser("post", elements);
  }
});

function requestUser(method, elements, id = "") {
  fetch(`http://localhost:4000/users/${id}`, {
    method,
    body: JSON.stringify({
      name: elements["name"].value,
      age: elements["age"].value,
      position: elements["position"].value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((user) => {
      console.log(user);
      form.reset();
      form.elements["id"].value = "0";
      getUsers();
    });
}