const form = document.getElementById("form");
const passwordInput = document.getElementById("password");
const codeInput = document.getElementById("code");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!checkInputValue(codeInput, "code-validation")) return;

  if (!checkInputValue(passwordInput, "pass-validation")) return;

  if (codeInput.value.trim().length != 14) {
    document.getElementById("code-validation").classList.remove("d-none");
    return;
  }

  document.getElementById("code-validation").classList.add("d-none");

  const data = {
    code: codeInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  login("http://localhost:3000/api/login", data);
  // login(
  //   "https://graduation-project-production-36b6.up.railway.app/api/login",
  //   data
  // );
});

let isLoading = false;

async function login(url, data) {
  if (isLoading) return;
  isLoading = true;
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
      console.log(responseData);
      throw responseData.error;
    }

    sessionStorage.setItem("student", JSON.stringify(responseData));

    if (responseData.pretestTotalResult == null) {
      location.href = "/view/test.html";
    } else {
      location.href = "/";
    }

    // catch error
  } catch (error) {
    const apiValidationDiv = document.getElementById("api-validation");
    apiValidationDiv.innerText = error;
  } finally {
    isLoading = false;
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
