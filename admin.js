const adminState = {
  authKey: "aih_admin_auth",
  defaultCredentials: {
    email: "admin@alihsanrelief.org",
    password: "Dignity2024"
  }
};

const getList = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setList = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const renderActivities = () => {
  const list = document.querySelector("#activity-list");
  const activities = getList("activities");
  if (!list) return;
  list.innerHTML = activities
    .map(
      (activity) => `
      <div class="card">
        <h4>${activity.title}</h4>
        <p><strong>${activity.category}</strong> • ${activity.date}</p>
        <p>${activity.summary}</p>
      </div>
    `
    )
    .join("");
};

const renderSubmissions = () => {
  const volunteerTable = document.querySelector("#volunteer-table tbody");
  const contactTable = document.querySelector("#contact-table tbody");
  if (volunteerTable) {
    volunteerTable.innerHTML = getList("volunteers")
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.skill}</td>
          <td>${item.location}</td>
          <td>${item.submittedAt?.split("T")[0] || ""}</td>
        </tr>
      `
      )
      .join("");
  }
  if (contactTable) {
    contactTable.innerHTML = getList("contacts")
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.subject}</td>
          <td>${item.submittedAt?.split("T")[0] || ""}</td>
        </tr>
      `
      )
      .join("");
  }
};

const initDashboardTabs = () => {
  const buttons = document.querySelectorAll(".dashboard-nav button");
  const panels = document.querySelectorAll(".dashboard-panel");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.querySelector(`#${button.dataset.panel}`).classList.add("active");
    });
  });
};

const initActivityForm = () => {
  const form = document.querySelector("#activity-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      title: form.title.value.trim(),
      date: form.date.value.trim(),
      category: form.category.value.trim(),
      summary: form.summary.value.trim()
    };
    if (Object.values(data).some((value) => value === "")) {
      alert("Please complete all fields before publishing.");
      return;
    }
    const activities = getList("activities");
    activities.unshift(data);
    setList("activities", activities);
    form.reset();
    renderActivities();
  });
};

const initMediaUpload = () => {
  const form = document.querySelector("#media-form");
  const preview = document.querySelector("#media-preview");
  if (!form || !preview) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const file = form.media.files[0];
    if (!file) {
      alert("Select a file to upload.");
      return;
    }
    const url = URL.createObjectURL(file);
    preview.innerHTML = `
      <p class="badge-pill">Uploaded via Cloudinary (${cloudinaryConfig.cloudName})</p>
      <img src="${url}" alt="Uploaded preview" />
    `;
    form.reset();
  });
};

const initCMSForm = () => {
  const form = document.querySelector("#cms-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      heroTitle: form.heroTitle.value.trim(),
      mission: form.mission.value.trim()
    };
    localStorage.setItem("aih_cms", JSON.stringify(data));
    alert("CMS settings saved. Refresh the public site to view updates.");
  });
};

const initAuth = () => {
  const overlay = document.querySelector(".login-overlay");
  const form = document.querySelector("#login-form");
  const logout = document.querySelector("#logout");
  const isAuthed = localStorage.getItem(adminState.authKey) === "true";
  if (overlay) {
    overlay.style.display = isAuthed ? "none" : "grid";
  }
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    if (
      email === adminState.defaultCredentials.email &&
      password === adminState.defaultCredentials.password
    ) {
      localStorage.setItem(adminState.authKey, "true");
      overlay.style.display = "none";
    } else {
      alert("Credentials not recognized. Use the secure admin credentials listed.");
    }
  });
  logout?.addEventListener("click", () => {
    localStorage.removeItem(adminState.authKey);
    window.location.reload();
  });
};

renderActivities();
renderSubmissions();
initDashboardTabs();
initActivityForm();
initMediaUpload();
initCMSForm();
initAuth();
