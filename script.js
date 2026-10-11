// ===============================
// Smooth Scroll for Navbar Links
// ===============================

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");
        if (!targetId || !targetId.startsWith("#") || targetId === "#") {
            return;
        }

        const targetSection = document.getElementById(targetId.slice(1));
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ===============================
// View My Work Button Scroll
// ===============================

const viewBtn = document.querySelector(".btn");

if (viewBtn) {
    viewBtn.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href") || "#portfolio";
        if (!targetId.startsWith("#") || targetId === "#") {
            return;
        }

        const targetSection = document.getElementById(targetId.slice(1));
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}


// ===============================
// Scroll Reveal Animation
// ===============================

const sections = document.querySelectorAll("section");

const revealSection = () => {
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }
    });
};

window.addEventListener("scroll", revealSection);
window.addEventListener("DOMContentLoaded", revealSection);


// ===============================
// Typing Animation for Hero Text
// ===============================

const heroText = document.querySelector("h1");

if (heroText) {
    const text = "Hi, I'm Alzuni 👋";
    const chars = Array.from(text);
    let index = 0;

    heroText.innerText = "";

    function typeEffect() {
        if (index < chars.length) {
            heroText.innerText += chars[index];
            index++;
            setTimeout(typeEffect, 70);
        }
    }

    typeEffect();
}


// ===============================
// Contact Form Submission
// ===============================

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const messageBox = document.getElementById("formMessage");
    const button = form ? form.querySelector("button") : null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isSubmitting = false;
    let messageTimer = null;

    if (!form || !messageBox) return;

    if (!messageBox.getAttribute("aria-live")) {
        messageBox.setAttribute("aria-live", "polite");
    }

    const showMessage = (text, type, autoClear = false) => {
        if (messageTimer) {
            clearTimeout(messageTimer);
            messageTimer = null;
        }
        messageBox.innerText = text;
        messageBox.className = type;

        if (autoClear) {
            messageTimer = setTimeout(() => {
                messageBox.innerText = "";
                messageBox.className = "";
                messageTimer = null;
            }, 4000);
        }
    };

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        if (isSubmitting) return;

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!name || !email || !message) {
            showMessage("Please fill all fields!", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address!", "error");
            return;
        }

        isSubmitting = true;
        const originalButtonText = button ? button.innerText : "Send Message";

        if (button) {
            button.innerText = "Sending...";
            button.disabled = true;
        }

        try {
            const response = await fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok && data && data.success === true) {
                showMessage(data.message || "Message sent successfully 🚀", "success", true);
                form.reset();
            } else {
                let errorMessage = "Something went wrong! Please try again.";
                if (data && typeof data.error === "string" && !data.error.includes("\n") && !data.error.includes("at ")) {
                    errorMessage = data.error;
                } else if (data && typeof data.message === "string") {
                    errorMessage = data.message;
                }
                showMessage(errorMessage, "error");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            showMessage("Server not responding! Please try again later.", "error");
        } finally {
            isSubmitting = false;
            if (button) {
                button.innerText = originalButtonText;
                button.disabled = false;
            }
        }
    });
});