const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

const cloudinaryConfig = {
  cloudName: "YOUR_CLOUDINARY_CLOUD_NAME",
  uploadPreset: "YOUR_CLOUDINARY_UPLOAD_PRESET"
};

const helpers = {
  getStoredList(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  setStoredList(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  sanitize(value) {
    return value.replace(/[<>]/g, "");
  }
};

const initNavigation = () => {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
};

const initFocusTabs = () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  if (!tabButtons.length) return;
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document
        .querySelector(`.tab-panel[data-tab='${button.dataset.tab}']`)
        .classList.add("active");
    });
  });
};

const initGallery = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  const lightbox = document.querySelector(".lightbox");
  if (!filterButtons.length || !items.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      items.forEach((item) => {
        const matches = filter === "all" || item.dataset.category === filter;
        item.style.display = matches ? "block" : "none";
      });
    });
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox) return;
      const type = item.dataset.type;
      const src = item.dataset.src;
      const content = lightbox.querySelector(".lightbox-body");
      content.innerHTML = "";
      if (type === "video") {
        const iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        content.appendChild(iframe);
      } else {
        const img = document.createElement("img");
        img.src = src;
        img.alt = item.dataset.alt || "Gallery image";
        content.appendChild(img);
      }
      lightbox.classList.add("active");
    });
  });

  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });
};

const initForms = () => {
  const forms = document.querySelectorAll("form[data-store]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const key = form.dataset.store;
      const formMessage = form.querySelector(".form-message");
      const data = {};
      Array.from(form.elements).forEach((element) => {
        if (element.name) {
          data[element.name] = helpers.sanitize(element.value.trim());
        }
      });
      if (Object.values(data).some((value) => value === "")) {
        if (formMessage) {
          formMessage.textContent = "Please complete all required fields.";
          formMessage.classList.add("show");
        }
        return;
      }
      const items = helpers.getStoredList(key);
      items.unshift({ ...data, submittedAt: new Date().toISOString() });
      helpers.setStoredList(key, items);
      if (formMessage) {
        formMessage.textContent = "Submission received. Thank you for your commitment.";
        formMessage.classList.add("show");
      }
      form.reset();
    });
  });

  const donationForm = document.querySelector("#donation-form");
  if (donationForm) {
    donationForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const amount = donationForm.querySelector("input[name='amount']").value;
      const message = donationForm.querySelector(".form-message");
      if (!amount) {
        message.textContent = "Please enter a contribution amount.";
        message.classList.add("show");
        return;
      }
      message.textContent = "Processing securely...";
      message.classList.add("show");
      setTimeout(() => {
        message.textContent = "Payment simulated. A receipt will be issued by our finance desk.";
        const donations = helpers.getStoredList("donations");
        donations.unshift({ amount, submittedAt: new Date().toISOString() });
        helpers.setStoredList("donations", donations);
        donationForm.reset();
      }, 900);
    });
  }
};

const initCMSOverrides = () => {
  const data = JSON.parse(localStorage.getItem("aih_cms") || "null");
  if (!data) return;
  const heroTitle = document.querySelector("[data-cms='heroTitle']");
  const mission = document.querySelector("[data-cms='mission']");
  if (heroTitle && data.heroTitle) heroTitle.textContent = data.heroTitle;
  if (mission && data.mission) mission.textContent = data.mission;
};

const initYear = () => {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
};

initNavigation();
initReveal();
initFocusTabs();
initGallery();
initForms();
initCMSOverrides();
initYear();

window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");
  if (loader) {
    loader.classList.add("hidden");
  }
});
