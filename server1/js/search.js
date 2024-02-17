

class Search {
    constructor(wordId, printId) {
        this.wordInput = document.getElementById(wordId);
        this.wordPrint = document.getElementById(printId);

        if (!this.wordInput || !this.wordPrint) {
            this.wordPrint.innerHTML = "Input or print panel element not found";
            return;
        }

        this.apiBaseUrl = "https://seashell-app-jjpva.ondigitalocean.app/COMP4537/labs/4";
    }

    searchHandle() {
        let searchWord = this.wordInput.value.trim();

        if (!searchWord) {
            this.wordPrint.innerHTML = "Please enter a word!";
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${this.apiBaseUrl}api/definitions/?word=${encodeURIComponent(searchWord)}`, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
        const word = Object.keys(response)[0]; // Extract the word from the JSON response
        const definition = response[word]; // Get the definition corresponding to the word

        if (definition !== 'Definition not found') {
            this.wordPrint.innerHTML = `Found: ${word} - ${definition}`;
        } else {
            this.wordPrint.innerHTML = 'Word not found!';
        }
    } else {
        this.wordPrint.innerHTML = 'Error fetching definition. Please try again.';
    }
        };
        xhr.onerror = () => {
            this.wordPrint.innerHTML = 'Error fetching definition. Please try again.';
        };
        xhr.send();
    }
}


const wordInstance = new Search('searchWord', 'search_panel');
document.getElementById('searchButton').addEventListener('click', () => {
    wordInstance.searchHandle();
});

