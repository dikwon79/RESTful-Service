//chatgpt3.5 I used it to get the solutions

const http = require('http');
const fs = require('fs');
const message = require('./lang/messages/en/user');
const endPointRoot = message.address;

class Filesave {
    constructor(filename) {
        this.filename = filename;
        this.dictionary = {};
        // 파일에서 데이터를 읽어와서 딕셔너리에 저장
        this.loadWord();
    }

    loadWord() {
        fs.readFile(this.filename, 'utf8', (err, data) => {
            if (err) {
              
                if (err.code === 'ENOENT') {
                    console.log(`${this.filename}..${message.notFound}`);
                   
                    return;
                }
               
                console.error(message.reading, err);
                return;
            }
           
            const lines = data.split('\n');
            for (const line of lines) {
                const [word, definition] = line.split(': ');
                if (word !== '' && definition !== undefined) {
                    this.dictionary[word] = definition;
                }
            }
            console.log(message.load, this.dictionary);
            
        });
    }
    saveWord(word, definition) {
        
        if (!word || !definition || !word.trim() || !definition.trim()) {
            console.log(message.save);
            return;
        }


        const dataToWrite = `${word}: ${definition}\n`;

        fs.appendFile(this.filename, dataToWrite, (err) => {
            if (err) {
                console.error(message.writeError, err);
            } else {
                console.log(message.writeSuccess,this.filename);
            }
        });
    }

}

class AppServer {
    constructor() {
        this.requestCount = 0;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.dictionary = new Filesave('./data.txt');
    }

    handleRequest(req, res) {
        const reqUrl = new URL(req.url, `https://${req.headers.host}`);
        const pathname = reqUrl.pathname;
       
        res.writeHead(200, {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods": "*",
        });

        if (req.method === 'POST' && pathname === endPointRoot) {

          
            this.addWord(req, res);
            this.requestCount++;
            console.log(`${message.count} ${this.requestCount}`); 
            console.log(message.total, this.getDictionarySize());
        } else if (req.method === 'GET' && pathname.startsWith(endPointRoot)) {

            this.requestCount++;
            console.log(`${message.count} ${this.requestCount}`);
            console.log(message.total, this.getDictionarySize());

            const wordValue = reqUrl.searchParams.get('word');
            this.searchWord(req, res, wordValue);

        } else {
            res.end(message.not404);
        }
       
        
    }

  

    addWord(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            console.log(data);
            let params = JSON.parse(data);
            let word = Object.keys(params)[0]; 
            let definition = params[word];
            

            if (!word.trim() || !definition.trim()) {
                res.end(message.saveboth);
                return;
            }

            if(word in this.dictionary.dictionary){
                //res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ [word]: message.duplicate}));

            }
            else{

                this.dictionary.saveWord(word, definition);
                //res.writeHead(200, { 'Content-Type': 'application/json' });

                
                this.dictionary.dictionary[word] = definition;
                console.log(message.dicLoad, this.dictionary);

                res.end(JSON.stringify({ [word]: message.successadd}));
                
     
            }
           

        });
    }

    searchWord(req, res, query) {
        if (!query.trim()) {
            res.end(message.save);
            return;
        }

        if (query in this.dictionary.dictionary) {

            res.end(JSON.stringify({ 
                [query]: this.dictionary.dictionary[query], 
                totalData: this.getDictionarySize(),
                requestCount: this.requestCount
            
            }));
       
        } else {
           
            res.end(JSON.stringify({ 
                [query]: message.defnotFound,
                totalData: this.getDictionarySize(),
                requestCount: this.requestCount
    
            }));
        }
    }
    getDictionarySize() {
        const dictionarySize = Object.keys(this.dictionary.dictionary).length;
        return dictionarySize;
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`${message.serverRun} ${port}`);
        });
    }
}

// Usage
const appServer = new AppServer();
appServer.listen(8080);