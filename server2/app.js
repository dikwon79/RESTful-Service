const http = require('http');
const url = require('url');
const fs = require('fs');
const endPointRoot = "/COMP4537/labs/4/api/definitions/";

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
                // 파일이 없는 경우 새로운 파일을 생성합니다.
                if (err.code === 'ENOENT') {
                    console.log(`File ${this.filename} not found. Creating a new file...`);
                    this.saveWord(); // 파일 생성
                    return;
                }
                // 다른 오류인 경우 오류 메시지 출력
                console.error('Error reading file:', err);
                return;
            }
            // 파일이 정상적으로 읽혔을 때 처리
            const lines = data.split('\n');
            for (const line of lines) {
                const [word, definition] = line.split(': ');
                this.dictionary[word] = definition;
            }
            console.log('Dictionary loaded:', this.dictionary);
        });
    }
    saveWord(word, definition) {
        const dataToWrite = `${word}: ${definition}\n`;

        fs.appendFile(this.filename, dataToWrite, (err) => {
            if (err) {
                console.error('Impossible to write.', err);
            } else {
                console.log('Success to write.',this.filename);
            }
        });
    }

}

class AppServer {
    constructor() {
        this.requestCount = 0;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.dictionary = new Filesave('data.txt');
    }

    handleRequest(req, res) {
        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = reqUrl.pathname;


        // res.writeHead(200, {
        //     "Access-Control-Allow-Origin" : "*",
        //     "Access-Control-Allow-Methods": "*"
        // });

        
    

        if (req.method === 'POST' && pathname === endPointRoot) {
            this.addWord(req, res);
        } else if (req.method === 'GET' && pathname.startsWith(endPointRoot)) {
            const wordValue = reqUrl.searchParams.get('word');
            console.log(wordValue);
            this.searchWord(req, res, wordValue);
        } else {
            res.end('404 Not Found');
        }

        this.requestCount++;
        console.log(`Request count: ${this.requestCount}`);
    }

    addWord(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            let params = new URLSearchParams(data);
            let word = params.get("word");
            let definition = params.get("definition");
            

            if (!word.trim() || !definition.trim()) {
                res.end('Please save both word and definition.');
                return;
            }


            this.dictionary.saveWord(word, definition);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ [word]: 'Definition added successfully.'}));

        });
    }

    searchWord(req, res, query) {
        if (!query.trim()) {
            res.end('Please save a search word.');
            return;
        }

        if (query in this.dictionary.dictionary) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ [query]: this.dictionary.dictionary[query] }));
       
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ [query]: 'Definition not found'}));
        }
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

// Usage
const appServer = new AppServer();
appServer.listen(8888);