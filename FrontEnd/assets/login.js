// *****************************************************************************************************
// LOGIQUE LOGIN
const loginUrl = "http://localhost:5678/api/users/login";
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const submitBtn = document.querySelector("input[type='submit']");
const form = document.getElementById("loginForm");
const loginError = document.querySelector(".loginError");
const passwordError = document.querySelector(".passwordError");

const logUser = {
  email: "",
  password: "",
};

// *****************************************************************************************************
// Fetch la route user

async function loginUser() {
  try {
    await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logUser),
    })
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData;
        console.log(data);
      });
    if (data.message === "user not found") {
      loginError.textContent = "Email pas valide !!";
      console.log(logUser);
    } else if (data.error) {
      passwordError.textContent = "Password pas valide !!";
      loginError.textContent = "";
      console.log(logUser);
    } else {
      passwordError.textContent = "";
      loginError.textContent = "";
      console.log("LogAdmin OK");
      console.log(logUser);
      // stockage du token dans le stockage local
      localStorage.setItem("token", data.token);
      //Redirection index.html
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.log(error);
  }
}

// *****************************************************************************************************
//LOGIQUE contrôle du Log IN

// Evenement au Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  loginUser();
});

// Evenement au MAIL
inputEmail.addEventListener("input", (e) => {
  //inputEmail.setCustomValidity("nooooooo");
  inputEmail.reportValidity();
  logUser.email = e.target.value;
});

// Evenement au Password
inputPassword.addEventListener("input", (e) => {
  //inputEmail.setCustomValidity("nooooooo");
  inputPassword.reportValidity();
  logUser.password = e.target.value;
});

//Evenement au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  logUser.email = inputEmail.value;
  logUser.password = inputPassword.value;
  console.log(logUser);
});
