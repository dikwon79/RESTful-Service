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
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault(); 
                this.addDefinition();
            
            });
        } else {
            console.error("Form not found");
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
        const url = "https://seashell-app-jjpva.ondigitalocean.app/COMP4537/labs/4/api/definitions";
        //const url = "http://localhost:8080/COMP4537/labs/4/api/definitions";

        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const data = {
            [word]: definition,
        };

        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                     
                    console.log(xhr.responseText)
                    try {
                        const response = JSON.parse(xhr.responseText);
                        this.responsePrint.innerHTML = xhr.responseText;
                        this.wordInput.value = '';
                        this.definitionInput.value = '';
                        
                        
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        this.responsePrint.innerHTML = "Error parsing JSON response.";
                    }
                } else {
                    console.error("Failed to add the definition. Status code:", xhr.status);
                    this.responsePrint.innerHTML = "Failed to add the definition.";
                }
            }
        };

        xhr.onerror = () => {
            console.error("Error connecting to the server.");
            this.responsePrint.innerHTML = "Error connecting to the server. Please try again.";
        };

        xhr.send(JSON.stringify(data));

        
        
       
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    new Store('word', 'definition', 'response');
});
