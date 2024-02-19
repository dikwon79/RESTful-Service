class Search {
    constructor(wordId, printId) {
        this.wordInput = document.getElementById(wordId);
        this.wordPrint = document.getElementById(printId);

        if (!this.wordInput || !this.wordPrint) {
            this.wordPrint.innerHTML = messages.notfound;
            return;
        }

        this.apiBaseUrl = messages.baseUrl;
        //this.apiBaseUrl = "http://localhost:8080/COMP4537/labs/4";
       
    }

    searchHandle() {
        let searchWord = this.wordInput.value.trim();

        if (!searchWord) {
            this.wordPrint.innerHTML = messages.enterWord;
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.apiBaseUrl}/api/definitions/?word=${encodeURIComponent(searchWord)}`, true);
        xhr.onload = () => {

            console.log( `${this.apiBaseUrl}/api/definitions/?word=${encodeURIComponent(searchWord)}`);
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const word = Object.keys(response)[0]; // Extract the word from the JSON response
                const definition = response[word]; // Get the definition corresponding to the word
                const count = response["totalData"];
                const request = response["requestCount"];

                const info = `${messages.tableInfo}${count}</td><td>${request}</td></tr></table>`;

                

                if (definition !== messages.DefinitionNot) {
                    const table = `${messages.table}${word}</td><td>${definition}</td></tr></table>`;

                    this.wordPrint.innerHTML = info+ table;
                } else {
                    this.wordPrint.innerHTML = messages.wordnotFound;
                }
    } else {
        this.wordPrint.innerHTML = messages.errorFetcing;
    }
        };
        xhr.onerror = () => {
            this.wordPrint.innerHTML = messages.errorFetcing;
        };
        xhr.send();
    }
}


const wordInstance = new Search('wordInput', 'search_panel');
document.getElementById('searchButton').addEventListener('click', () => {
    wordInstance.searchHandle();
});

