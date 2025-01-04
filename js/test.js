let questions = [];
let studentId = "";
let questionNum = 0;

if (!sessionStorage.student) {
  location.href = "/view/login.html";
} else {
  studentId = JSON.parse(sessionStorage.getItem("student")).id;
}

const answerData = {
  studentId,
  answers: [],
};

function pushQuestion(questionId, answerId) {
  answerData.answers.push({ questionId, answerId });

  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = true));

  const nextBtn = document.getElementById("next");
  nextBtn.disabled = false;
}

getPreTest();

async function getPreTest() {
  try {
    // const response = await fetch(`http://localhost:3000/api/pretest`);
    const response = await fetch(
      `https://graduation-project-production-36b6.up.railway.app/api/pretest`
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw responseData.error;
    }

    questions = responseData;
    document.getElementById("questions-count").innerText = questions.length;
  } catch (error) {
    console.log(error);
    document.getElementById("error-message").innerText =
      "حدث خطأ أثناء تحميل الأسئلة. الرجاء المحاولة مرة أخرى.";
  }
}

const startQuizBtn = document.getElementById("start-quiz");
const nextBtn = document.getElementById("next");
const submitBtn = document.getElementById("submit");

startQuizBtn.addEventListener("click", () => {
  document.querySelector(".introduction").classList.add("d-none");
  document.querySelector(".app").classList.remove("d-none");

  putDataOnScreen(questions);
});

nextBtn.addEventListener("click", () => {
  questionNum++;
  if (questionNum < questions.length) {
    putDataOnScreen(questions);
  } else {
    nextBtn.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    submitBtn.disabled = false;
  }
});

function putDataOnScreen(data) {
  nextBtn.disabled = true;

  const questionDiv = document.getElementById("question");
  const answersDiv = document.getElementById("answers");
  questionDiv.innerText = questions[questionNum].question;
  answersDiv.innerHTML = "";

  const answers = questions[questionNum].answers;
  const questionId = questions[questionNum].id;

  answers.forEach((option) => {
    const answerId = option.id;
    const optionDiv = document.createElement("button");
    optionDiv.className =
      "option bg-white py-2 px-3 w-100 text-start my-2 border-white shadow-lg rounded-4";
    optionDiv.innerText = option.answerText;
    optionDiv.onclick = () => pushQuestion(questionId, answerId);

    answersDiv.appendChild(optionDiv);
  });
}

submitBtn.addEventListener("click", async () => {
  try {
    // const response = await fetch("http://localhost:3000/api/pretest", {
    const response = await fetch(
      "https://graduation-project-production-36b6.up.railway.app/api/pretest",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData.error;
    }

    location.href = "/";
  } catch (error) {
    console.error("Error submitting answers:", error);
    alert("حدث خطأ أثناء إرسال الإجابات. الرجاء المحاولة مرة أخرى.");
  }
});
