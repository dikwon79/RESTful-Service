//chatgpt3.5 I used it to get the solutions
class Store {
    constructor(wordId, definitionId, responseId) {
        this.wordInput = document.getElementById(wordId);
        this.definitionInput = document.getElementById(definitionId);
        this.responsePrint = document.getElementById(responseId);

        if (!this.wordInput || !this.definitionInput || !this.responsePrint) {
            console.error(messages.elementNot);
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault(); // 
                this.addDefinition();
            });
        } else {
            console.error(messages.formNotFound);
        }
    }

    addDefinition() {
      
        const word = this.wordInput.value.trim();
        const definition = this.definitionInput.value.trim();

        if (!word || !definition) {
            this.responsePrint.innerHTML = messages.fillField;
            return;
        }

        const xhr = new XMLHttpRequest();
        //const url = messages.address;
        const url = messages.test;


        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const data = {
            [word]: definition,
        };

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    
                    try {
                        const response = JSON.parse(xhr.responseText);
                        this.responsePrint.innerHTML = xhr.responseText;
                        this.wordInput.value = '';
                        this.definitionInput.value = '';
                        
                    } catch (e) {
                        console.error(messages.parcingError, e);
                        this.responsePrint.innerHTML = messages.parcingResponse;
                    }
                } else {
                    console.error(messages.failToadd, xhr.status);
                    this.responsePrint.innerHTML = messages.failTodefinition;
                }
            }
        };

        xhr.onerror = () => {
            console.error(messages.connectError);
            this.responsePrint.innerHTML = messages.tryagain;
        };

        xhr.send(JSON.stringify(data));

        
        
       
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    new Store('word', 'definition', 'response');
});
