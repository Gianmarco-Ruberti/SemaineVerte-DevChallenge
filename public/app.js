async function loadGrades() {
  const res = await fetch("/grades");
  const data = await res.json();

  const table = document.getElementById("table");
  table.innerHTML = "";

  const subjects = [];

  data.forEach((grade) => {
    let found = false;
    let entry;

    subjects.forEach((sub) => {
      if (sub.name === grade.subject) {
        found = true;
        entry = sub;
      }
    });

    if (found) entry.notes.push({ note: grade.score, id: grade.id });
    else
      subjects.push({
        name: grade.subject,
        notes: [{ note: grade.score, id: grade.id }],
      });
  });

  subjects.forEach((sub) => {
    const entries = [];

    let noteTotal = 0;
    let noteAmount = 0;

    sub.notes.forEach((grade) => {
      noteTotal += grade.note;
      noteAmount++;

      entries.push(
        ` <span class="grade"> ${grade.note.toFixed(1)} <button class="deletBtn" onclick="deleteGrade(${grade.id})">X</button></span>`,
      );
    });

    let content = entries.join(", ");

    let average = noteTotal / noteAmount;

    table.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${content}</td>
                <td>${average.toFixed(1)}</td>
            </tr>
        `;
  });
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
  const semester = document.getElementById("semestre").value;

  await fetch("/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id, score, semester }),
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
