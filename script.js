// ===============================
// Smooth Scroll for Navbar Links
// ===============================

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
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
    viewBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const portfolioSection = document.querySelector("#portfolio");
        if (portfolioSection) {
            portfolioSection.scrollIntoView({
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
    let index = 0;

    heroText.innerText = "";

    function typeEffect() {
        if (index < text.length) {
            heroText.innerText += text.charAt(index);
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

    if (!form || !messageBox) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const message = messageInput ? messageInput.value.trim() : "";

        if (!name || !email || !message) {
            messageBox.innerText = "Please fill all fields!";
            messageBox.className = "error";
            return;
        }

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

            const data = await response.json();

            if (response.ok) {
                messageBox.innerText = data.message || "Message sent successfully 🚀";
                messageBox.className = "success";
                form.reset();

                setTimeout(() => {
                    messageBox.innerText = "";
                    messageBox.className = "";
                }, 3000);
            } else {
                messageBox.innerText = data.error || data.message || "Something went wrong!";
                messageBox.className = "error";
            }
        } catch (error) {
            console.error("Contact form error:", error);
            messageBox.innerText = "Server not responding!";
            messageBox.className = "error";
        } finally {
            if (button) {
                button.innerText = "Send Message";
                button.disabled = false;
            }
        }
    });
});