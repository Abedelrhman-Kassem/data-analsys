if (!sessionStorage.student) {
  location.href = "/view/login.html";
}

const header = `
<nav class="navbar navbar-expand-md py-0 bg-main-color">
    <div class="container-fluid container-xl px-md-0">
        <a class="navbar-brand text-white fs-5 fw-bold" href="/"
            ><img
            src="/assets/images/sql-logo.png"
            alt="sql-logo"
            class="sql-logo d-block d-md-none d-xl-block"
        /></a>
        <button
            class="navbar-toggler my-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <div class="hamburger-icon">
            <div class="hamburger-line bg-white"></div>
            <div class="hamburger-line bg-white"></div>
            <div class="hamburger-line bg-white"></div>
            </div>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav w-100">
                <li class="nav-item">
                    <a
                    class="nav-link active text-white fs-5 fw-bold"
                    aria-current="page"
                    href="/"
                    >الصفحه الرئيسيه</a
                    >
                </li>
                <li class="nav-item dropdown">
                    <a
                    class="nav-link dropdown-toggle text-white fs-5 fw-bold"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    >
                    الوحدات
                    </a>
                    <ul id="dropdown-menu" class="dropdown-menu">
                        
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white fs-5 fw-bold" href="/view/chatbot.html"
                    >شات بوت</a
                    >
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white fs-5 fw-bold" href="/view/activity_instructions.html"
                    >تعليمات الأنشطه</a
                    >
                </li>
                <li class="nav-item">
                    <a class="nav-link text-white fs-5 fw-bold" href="/view/contact.html"
                    >اتصل بنا</a
                    >
                </li>
                <li class="nav-item ms-md-auto me-md-4">
                    <button id="logout-btn" class="nav-link fs-5 fw-bold text-white border-0 rounded-3 bg-main-color px-2"
                    >تسجيل خروج</button
                    >
                </li>
            </ul>
        </div>
    </div>
</nav>
`;

const headerDiv = document.querySelector("header");

headerDiv.innerHTML = header;

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.clear();
  location.href = "/view/login.html";
});

getModules();

async function getModules() {
  if (sessionStorage.getItem("modules")) {
    const modules = JSON.parse(sessionStorage.modules);

    createDropDown(modules);
    return;
  }
  try {
    // const response = await fetch("http://localhost:3000/api/modules");
    const response = await fetch(
      "https://graduation-project-production-36b6.up.railway.app/api/modules"
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw response.error;
    }

    sessionStorage.setItem("modules", JSON.stringify(responseData));

    createDropDown(responseData);
  } catch (error) {
    console.log(error);
  }
}

function createDropDown(dropDounList) {
  const ul = document.getElementById("dropdown-menu");
  ul.innerHTML = "";

  dropDounList.forEach((li) => {
    const item = document.createElement("li");
    const a = document.createElement("a");

    a.className = "dropdown-item text-dark fs-5 fw-bold";
    a.href = `/view/modules/module-${li.order}.html?module=${li.id}`;
    a.textContent = li.name;

    item.appendChild(a);
    ul.appendChild(item);
  });
}
