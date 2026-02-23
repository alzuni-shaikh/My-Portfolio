// ===============================
// Smooth Scroll for Navbar Links
// ===============================

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: "smooth"
        });
    });
});


// ===============================
// View My Work Button Scroll
// ===============================

const viewBtn = document.querySelector(".btn"); // change class if different

if (viewBtn) {
    viewBtn.addEventListener("click", () => {
        document.querySelector("#projects").scrollIntoView({
            behavior: "smooth"
        });
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


// ===============================
// Contact Form Validation
// ===============================
document.addEventListener("DOMContentLoaded", function() {

    const form = document.querySelector("form");
    const messageBox = document.getElementById("formMessage");
    const button = form.querySelector("button");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = form.querySelector("input[type='text']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const message = form.querySelector("textarea").value.trim();

        if (!name || !email || !message) {
            messageBox.innerText = "Please fill all fields!";
            messageBox.className = "error";
            return;
        }

        button.innerText = "Sending...";
        button.disabled = true;

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
                messageBox.innerText = "Message sent successfully 🚀";
                messageBox.className = "success";
                form.reset();
            } else {
                messageBox.innerText = "Something went wrong!";
                messageBox.className = "error";
            }

        } catch (error) {
            messageBox.innerText = "Server not responding!";
            messageBox.className = "error";
        }

        button.innerText = "Send Message";
        button.disabled = false;

       if (response.ok) {
    messageBox.innerText = "Message sent successfully 🚀";
    messageBox.className = "success";
    form.reset();

    setTimeout(() => {
        messageBox.innerText = "";
        messageBox.className = "";
    }, 3000);
}

    });

});


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

document.addEventListener("DOMContentLoaded", function() {

    const form = document.querySelector("form");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = form.querySelector("input[type='text']").value;
        const email = form.querySelector("input[type='email']").value;
        const message = form.querySelector("textarea").value;

        try {
            const response = await fetch("http://localhost:5000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            alert(data.success);
            form.reset();

        } catch (error) {
            alert("Server not responding!");
        }
    });

});