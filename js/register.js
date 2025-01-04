const form = document.getElementById("form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const codeInput = document.getElementById("code");

if (localStorage.getItem("Authentication")) {
  location.href = "/view/test.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!checkInputValue(usernameInput, "user-validation")) return;

  if (!checkInputValue(passwordInput, "pass-validation")) return;

  if (!checkInputValue(codeInput, "code-validation")) return;

  if (codeInput.value.trim().length != 14) {
    document.getElementById("code-validation").classList.remove("d-none");
    return;
  }

  document.getElementById("code-validation").classList.add("d-none");

  const data = {
    username: usernameInput.value.trim(),
    password: passwordInput.value.trim(),
    code: codeInput.value.trim(),
  };

  // register("http://localhost:3000/api/signup", data);
  register(
    "https://graduation-project-production-36b6.up.railway.app/api/signup",
    data
  );
});

async function register(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData.error;
    }

    sessionStorage.setItem("student", JSON.stringify(responseData));

    location.href = "/view/test.html";
  } catch (error) {
    const apiValidationDiv = document.getElementById("api-validation");
    apiValidationDiv.innerText = error;
  }
}

function checkInputValue(input, validationDiv) {
  if (input.value.trim() === "") {
    document.getElementById(validationDiv).classList.remove("d-none");
    return false;
  } else {
    document.getElementById(validationDiv).classList.add("d-none");
    return true;
  }
}
