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
        if (submitBtn) {
            submitBtn.addEventListener('click', (event) => {
                event.preventDefault(); // 폼 제출 기본 동작 방지
                this.addDefinition(); // 추가 정의 메서드 호출
            });
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

        xhr.open("POST", `https://seashell-app-jjpva.ondigitalocean.app/COMP4537/labs/4/api/definitions`, true); // Using host URL dynamically
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        var data = {
            [word]: definition,
           
        };
       
        xhr.send(JSON.stringify(data));
        console.log(JSON.stringify(data));
       
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {

                console.log(xhr.responseTextsponse);
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                       
                        this.responsePrint.innerHTML = "Success"; // 예시
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
        
       
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    new Store('word', 'definition', 'response');
});
