let form = document.querySelector("form");

let studentId = JSON.parse(sessionStorage.getItem("student")).id;

const data = {
  studentId,
};

let isLoading = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isLoading) return;
  isLoading = true;

  data.name = document.getElementById("username").value;
  data.phone = document.getElementById("phone").value;
  data.email = document.getElementById("email").value;
  data.message = document.getElementById("message").value;

  try {
    const response = await fetch(
      "http://localhost:3000/api/contact",
      // "https://graduation-project-production-36b6.up.railway.app/api/contact",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData.error;
    }

    alert("تم الإرسال بنجاح");
  } catch (error) {
    console.error("Error submitting answers:", error);
    alert("حدث خطأ أثناء الإرسال. الرجاء المحاولة مرة أخرى.");
  } finally {
    isLoading = false;
  }
});
