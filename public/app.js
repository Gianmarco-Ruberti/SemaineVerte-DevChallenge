async function loadGrades() {
  const res = await fetch("/grades");
  const data = await res.json();

  const table = document.getElementById("table");
  table.innerHTML = "";

  const subjects = [];

  data.forEach((grade) => {
    let found = false;
    let entry = subjects.forEach((sub) => {
      if (sub.name === grade.subject) found = true;
    });

    if (found) console.log("a");
    else
      subjects.push({
        name: grade.subject,
        notes: [{ note: grade.score, id: grade.id }],
      });
  });

  console.log(subjects);

  console.log("a");

  subjects.forEach((sub) => {
    console.log("b");

    const entries = [];

    sub.notes.forEach((grade) => {
      entries.push(
        `${grade.id} <button onclick="deleteGrade(${grade.note})">X</button>`,
      );
    });

    const content = entries.toString();

    table.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${content}</td>
            </tr>
        `;
  });

  console.log("c");
}

async function loadSubjects() {
  const res = await fetch("/subjects");
  const data = await res.json();

  const select = document.getElementById("subjectSelect");
  select.innerHTML = "";

  data.forEach((s) => {
    select.innerHTML += `
            <option value="${s.id}">
                ${s.name}
            </option>
        `;
  });
}

async function addGrade() {
  const subject_id = document.getElementById("subjectSelect").value;
  const score = document.getElementById("score").value;

  await fetch("/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id, score }),
  });

  loadGrades();
}

async function addSubject() {
  const name = document.getElementById("newSubject").value;

  await fetch("/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  loadSubjects();
}

async function deleteGrade(id) {
  await fetch(`/grades/${id}`, { method: "DELETE" });
  loadGrades();
}

loadSubjects();
loadGrades();
