class Store {
    constructor(wordId, definitionId, responseId) {
        this.wordInput = document.getElementById(wordId);
        this.definitionInput = document.getElementById(definitionId);
        this.responsePrint = document.getElementById(responseId);

        if (!this.wordInput || !this.definitionInput || !this.responsePrint) {
            console.error("One or more elements not found");
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        const submitBtn = document.getElementById('submitDefinition');
        if(submitBtn) {
            submitBtn.addEventListener('click', () => this.addDefinition());
        } else {
            console.error("Submit button not found");
        }
    }

    addDefinition() {
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();

        if (!word || !definition) {
            this.responsePrint.innerHTML = "Please fill in both the word and definition fields.";
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://seashell-app-jjpva.ondigitalocean.app/COMP4537/labs/4/api/definitions`, true); // Using host URL dynamically
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            console.log(xhr.responseText);
            try {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    this.responsePrint.innerHTML = response.message;
                    this.wordInput.value = '';
                    this.definitionInput.value = '';
                } else {
                    this.responsePrint.innerHTML = "Failed to add the definition.";
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                this.responsePrint.innerHTML = "Error fetching definition. Please try again.";
            }
        };
        
        xhr.onerror = () => {
            this.responsePrint.innerHTML = "Error connecting to the server. Please try again.";
        };
        xhr.send(JSON.stringify({ word, definition }));
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    new Store('word', 'definition', 'response');
});
