class Search{
    constructor(wordId, printId){
        this.wordInput = document.getElementById(wordId);
        this.wordPrint = document.getElementById(printId);

        if(!this.wordInput || !this.wordPrint){
            this.wordPrint.innerHTML = "input or print panel element not found";
            return;
        }
    }

    searchHandle(){
        let search = this.wordInput.value;

        if(!search){
            this.wordPrint.innerHTML = "enter word!"
            return;
        }
    }
    

}

const wordInstance = new Search('wordInput', 'search_panel');
document.getElementById('searchButton').addEventListener('click', () => {
    wordInstance.searchHandle();
});