let studentId;

if (!sessionStorage.student) {
  location.href = "/view/login.html";
} else {
  studentId = JSON.parse(sessionStorage.getItem("student")).id;
}

let submissions = [];

let submissionsObj = {
  studentId,
  submissions,
};

let hintsObj = {};

let moduleActivity = {};
let activitySection = document.getElementById("show-activity");
let activityList = document.createElement("ul");

const urlParams = new URLSearchParams(location.search);

const moduleId = urlParams.get("module");

getActivities(moduleId);

async function getActivities(moduleId) {
  if (sessionStorage.getItem(`activity-${moduleId}`)) {
    let activities = JSON.parse(sessionStorage.getItem(`activity-${moduleId}`));
    createActivity(activities);
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/activities/filter/moduleId/${moduleId}?student_id=${studentId}`
    );
    // const response = await fetch(
    //   `https://graduation-project-production-36b6.up.railway.app/api/activities/filter/moduleId/${moduleId}?student_id=${studentId}`
    // );

    const responseData = await response.json();

    if (!response.ok) {
      throw responseData.error;
    }

    moduleActivity = responseData;

    sessionStorage.setItem(
      `activity-${moduleActivity.module.id}`,
      JSON.stringify(moduleActivity)
    );
    createActivity(moduleActivity);
  } catch (error) {
    let errorDiv = document.createElement("div");
    errorDiv.classList.add("text-danger", "fw-bold", "fs-3");
    errorDiv.textContent = "هناك مشكله فى تحميل الأنشطه حاول مره اخرى";

    document.querySelector("main").prepend(errorDiv);
    console.log(error);
  }
}

function createActivity(moduleActivity) {
  const activities = moduleActivity.module.activities;

  activitySection.innerHTML = `<h1>الأنشطة</h1>`;

  for (const activity of activities) {
    if (activity.activityType === "true_false") {
      if (activity.submissions.length > 0) continue;
      createTrueFalse(activity);
    } else if (activity.activityType === "sql_input") {
      createSqlInputQuestion(activity);
    }
  }

  let sendBtn = createSendActivityBtn();
  sendBtn.addEventListener("click", (e) => {
    sendTrueFalseActivities();
  });

  activityList.appendChild(sendBtn);
  getSqlSubmitBtns();
}

function createTrueFalse(activity) {
  activityList.innerHTML += `<li>
                              <div
                                class="d-flex gap-2 justify-content-between align-items-center mb-5"
                              >
                                <h3>${activity.description}</h3>
                                <div class="answer d-flex gap-2 align-items-center">
                                  <div>
                                    <input
                                      type="radio"
                                      class="btn-check"
                                      name="q-${activity.id}"
                                      id="right-answer-${activity.id}"
                                      autocomplete="off"
                                    />
                                    <label
                                      class="btn btn-outline-success"
                                      for="right-answer-${activity.id}"
                                      >صح</label
                                    >
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      class="btn-check"
                                      name="q-${activity.id}"
                                      id="wrong-answer-${activity.id}"
                                      autocomplete="off"
                                    />
                                    <label class="btn btn-outline-danger" for="wrong-answer-${activity.id}"
                                      >خطأ</label
                                    >
                                  </div>
                                </div>
                              </div>
                            </li>`;

  document.getElementById("show-activity").appendChild(activityList);
}

function createSqlInputQuestion(activity) {
  let hints = [];
  for (const submission of activity.submissions) {
    if (submission.isCorrect === true) return;
    hints.push(submission.hintLevel);
  }

  let maxHint = Math.max(...hints);

  hintsObj[`${activity.id}`] = maxHint < 0 ? 0 : maxHint == 2 ? 2 : maxHint + 1;

  activitySection.innerHTML += `<div class="my-5 activity">
                                  <h3 class="mb-3">
                                    ${activity.title}
                                  </h3>
                                  <h4>الوصف:</h4>
                                  <p class="fs-5 ms-4">
                                    ${activity.description}
                                  </p>

                                  <div
                                    class="summary-guidance-${activity.id} ${
    maxHint >= 0 ? "d-flex" : "d-none"
  } gap-4 align-items-center flex-wrap"
                                  >
                                    <h4>المستوي الأول من التوجيه:</h4>
                                    <pre class="bg-dark fw-bold fit-content text-info p-3 rounded-3 mb-0">${
                                      activity.summaryGuidance
                                    }</pre>
                                  </div>

                                  <div class="detailed-guidance-${
                                    activity.id
                                  } ${maxHint >= 1 ? "d-block" : "d-none"}">
                                    <h4>المستوي الثاني من التوجيه</h4>
                                    <ul id="ul-activity-${activity.id}">
                                    </ul>
                                  </div>

                                  <div id="sql-container-${
                                    activity.id
                                  }" class="m-4">
                                    <label for="sql-query-input-regex-2" class="fw-bold fs-5 me-3"
                                      >قم بكتابة الاستعلام</label
                                    >
                                    <input
                                      autocomplete="off"
                                      dir="ltr"
                                      id="sql-input-${activity.id}"
                                      type="text"
                                      class="sql-query-input rounded-3 px-1 py-1"
                                    />
                                    <button id="${
                                      activity.id
                                    }" name="submit-sql" type="button" class="btn btn-primary">إرسال</button>
                                  </div>
                                </div>`;

  let detailedList = document.getElementById("ul-activity-" + activity.id);
  for (const { key, value } of activity.detailedGuidance) {
    detailedList.innerHTML += `<li class="d-flex">
                                <span class="sql-query text-center fw-bold">${key} </span>
                                <span>: ${value}</span>
                              </li>`;
  }
}

function createSendActivityBtn() {
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "إرسال";

  return btn;
}

let loadingSendTrueFalse = false;
async function sendTrueFalseActivities() {
  if (loadingSendTrueFalse) return;
  if (!validateTrueFalseAnswers()) return;
  loadingSendTrueFalse = true;

  try {
    const response = await fetch(
      `http://localhost:3000/api/activities/moduleId/${moduleId}/true_false`,
      // `https://graduation-project-production-36b6.up.railway.app/api/activities/moduleId/${moduleId}/true_false`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(submissionsObj),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw responseData;
    }

    sessionStorage.removeItem(`activity-${moduleId}`);
    activityList.remove();
    getActivities(moduleId);
  } catch (error) {
    alert("حدث خطأ أثناء الإرسال حاول فى وقت لاحق");
    console.log(error.error);
  } finally {
    loadingSendTrueFalse = false;
  }
}

function validateTrueFalseAnswers() {
  const questions = document.querySelectorAll('[name^="q-"]');

  const questionIds = new Set();
  questions.forEach((input) => {
    const questionId = input.name;
    questionIds.add(questionId);
  });

  for (const questionId of questionIds) {
    const options = document.querySelectorAll(`[name="${questionId}"]`);
    const isAnswered = Array.from(options).some((option) => {
      if (option.checked) {
        submissions.push({
          activityId: questionId.replace("q-", ""),
          studentAnswer: option.id.includes("right-answer") ? "true" : "false",
        });
      }

      return option.checked;
    });

    if (!isAnswered) {
      alert(`برجاء الإجابه على كل أسئلة الصح والخطأ مره واحده`);
      return false;
    }
  }

  return true;
}

function getSqlSubmitBtns() {
  let btns = document.querySelectorAll("[name='submit-sql']");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateSqlActivity(btn.id)) alert("قم بحل النشاط اولا");
      else {
        let sqlData = {
          studentId,
          activityId: parseInt(btn.id),
          studentAnswer: validateSqlActivity(btn.id),
          hintLevel: hintsObj[btn.id],
        };

        sendSqlActivity(sqlData);
      }
    });
  });
}

function validateSqlActivity(id) {
  let input = document.getElementById(`sql-input-${id}`);

  if (input.value.trim() === "") return false;

  return input.value.trim();
}

let loadingSendSqlActivity = false;

async function sendSqlActivity(data) {
  if (loadingSendSqlActivity) return;
  loadingSendSqlActivity = true;

  try {
    let response = await fetch(
      `http://localhost:3000/api/activities/moduleId/${moduleId}/sql_input`,
      // `https://graduation-project-production-36b6.up.railway.app/api/activities/moduleId/${moduleId}/sql_input`,
      {
        headers: {
          "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    let responseData = await response.json();

    if (!response.ok) {
      throw responseData;
    }

    editSessionActivity(responseData);
  } catch (error) {
    console.log(error);
    alert("حدثت مشكله أثناء الإرسال حاول مره أخري");
  } finally {
    loadingSendSqlActivity = false;
  }
}

function editSessionActivity(data) {
  let sessionActivity = JSON.parse(
    sessionStorage.getItem(`activity-${moduleId}`)
  );

  sessionActivity.module.activities.forEach((activity) => {
    if (activity.id == data.activityId) activity.submissions.push(data);
  });

  sessionStorage.setItem(
    `activity-${moduleId}`,
    JSON.stringify(sessionActivity)
  );
  createActivity(sessionActivity);
}
