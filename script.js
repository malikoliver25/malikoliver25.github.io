// Global Modal Controls
window.openModal = function() {
    document.getElementById('contact-modal').style.display = 'block';
};

window.closeModal = function() {
    document.getElementById('contact-modal').style.display = 'none';
};

window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) window.closeModal();
};

document.addEventListener('DOMContentLoaded', () => {
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init("P06fbxIVF2z45Tu41");
    }

    // Terminal Logic
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');

    async function sendTerminalMessage(userMessage) {
        try {
            const response = await fetch("https://portfolio-assistant-api-3rav.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await response.json();
            return data.response;
        } catch (err) { 
            return "ERROR: Connection to API failed."; 
        }
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const query = terminalInput.value.trim();
                if (!query) return;

                // User Input (Styled gray)
                const userDiv = document.createElement('div');
                userDiv.style.color = "var(--text-muted)";
                userDiv.style.marginBottom = "5px";
                userDiv.innerText = `> ${query}`;
                terminalHistory.appendChild(userDiv);
                terminalInput.value = '';

                // Thinking state
                const agentDiv = document.createElement('div');
                agentDiv.style.color = "var(--accent)";
                agentDiv.style.marginBottom = "15px";
                agentDiv.innerText = `AI_AGENT: Processing...`;
                terminalHistory.appendChild(agentDiv);
                terminalHistory.scrollTop = terminalHistory.scrollHeight;

                // Real API Response
                const response = await sendTerminalMessage(query);
                agentDiv.innerText = response;
                
                terminalHistory.scrollTop = terminalHistory.scrollHeight;
            }
        });
    }

    // Email Modal Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            emailjs.sendForm('service_nyafoug', 'template_3iz29fm', this)
                .then(() => { 
                    alert('TRANSMISSION_SUCCESS'); 
                    window.closeModal(); 
                    this.reset();
                }, (err) => { 
                    alert('TRANSMISSION_FAILED: ' + JSON.stringify(err)); 
                });
        });
    }
});