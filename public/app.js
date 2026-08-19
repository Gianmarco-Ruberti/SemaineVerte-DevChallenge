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

    if (found)
      entry.notes.push({
        note: grade.score,
        id: grade.id,
        semester: grade.semester,
      });
    else
      subjects.push({
        name: grade.subject,
        notes: [{ note: grade.score, id: grade.id, semester: grade.semester }],
      });
  });

  subjects.forEach((sub) => {
    const firstSemesterEntries = [];
    let firstSemesterNoteTotal = 0;
    let firstSemesterNoteAmount = 0;

    const secondSemesterEntries = [];
    let secondSemesterNoteTotal = 0;
    let secondSemesterNoteAmount = 0;

    sub.notes.forEach((grade) => {
      if (grade.semester === 1) {
        firstSemesterNoteTotal += grade.note;

        firstSemesterEntries.push(
          ` <span class="grade"> ${grade.note.toFixed(1)} <button class="deletBtn" onclick="deleteGrade(${grade.id})">X</button></span>`,
        );

        firstSemesterNoteAmount++;
      } else if (grade.semester === 2) {
        secondSemesterNoteTotal += grade.note;

        secondSemesterEntries.push(
          ` <span class="grade"> ${grade.note.toFixed(1)} <button class="deletBtn" onclick="deleteGrade(${grade.id})">X</button></span>`,
        );

        secondSemesterNoteAmount++;
      } else {
        console.log("Ceci n'est pas normal");
      }
    });

    const firstSemester = firstSemesterEntries.join(", ");
    const secondSemester = secondSemesterEntries.join(", ");

    let firstSemesterAverage = (
      firstSemesterNoteTotal / firstSemesterNoteAmount
    ).toFixed(1);

    let secondSemesterAverage = (
      secondSemesterNoteTotal / secondSemesterNoteAmount
    ).toFixed(1);

    const yearAverage =
      (firstSemesterNoteTotal + secondSemesterNoteTotal) /
      (firstSemesterNoteAmount + secondSemesterNoteAmount);

    firstSemesterAverage = +firstSemesterAverage || 0;
    secondSemesterAverage = +secondSemesterAverage || 0;

    table.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${firstSemester}</td>
                <td>${secondSemester}</td>
                <td>${firstSemesterAverage}</td>
                <td>${secondSemesterAverage}</td>
                <td>${yearAverage == yearAverage ? yearAverage : 0}</td>
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
