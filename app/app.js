const KEY = "students";

function readStudents() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Bad JSON in localStorage:", e);
    return [];
  }
}
function writeStudents(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
function csvToArray(s) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const form = document.getElementById("studentForm");
const app = document.getElementById("app");
const showBtn = document.getElementById("showBtn");
const clearBtn = document.getElementById("clearBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const student = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    age: Number(form.age.value),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    classes: csvToArray(form.classes.value),
  };
  const list = readStudents();
  list.push(student);
  writeStudents(list);
  form.reset();
  form.firstName.focus();
  render(list);
});

showBtn.addEventListener("click", () => render(readStudents()));

clearBtn.addEventListener("click", () => {
  if (confirm("Clear ALL students from localStorage?")) {
    localStorage.removeItem(KEY);
    render([]);
  }
});

function render(list) {
  if (!list.length) {
    app.innerHTML = '<p style="padding:0.75rem">No students stored yet.</p>';
    return;
  }
  const rows = list
    .map(
      (s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.firstName)} ${escapeHtml(s.lastName)}</td>
      <td>${s.age}</td>
      <td>${escapeHtml(s.phone)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${s.classes
        .map((c) => `<span class="badge">${escapeHtml(c)}</span>`)
        .join(" ")}</td>
    </tr>
  `
    )
    .join("");
  app.innerHTML = `
    <table aria-label="students">
      <thead>
        <tr>
          <th>#</th><th>Name</th><th>Age</th><th>Phone</th><th>Email</th><th>Classes</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

render(readStudents());
