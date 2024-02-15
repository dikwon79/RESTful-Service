const http = require('http');
const url = require('url');
const endPointRoot = "/COMP4537/labs/4/api/definitions/";


class AppServer {
    constructor() {
        this.requestCount = 0;
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    handleRequest(req, res) {

        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const query = parsing.parse(reqUrl.search.slice(1));

        res.writeHead(200, {
            "Content-Type" : "text/html",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods": "*"
        });

        if (req.method === 'POST' && req.url === endPointRoot) {
            this.addWord(req, res);
        } else if (req.method === 'GET') {
            this.searchWord(req, res, query);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
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
            const { word, definition } = JSON.parse(data);

            if (!word.trim() || !definition.trim()) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Please save both word and definition.');
                return;
            }

            // Save the word and definition to your database or storage

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Definition added successfully.');
        });
    }

    searchWord(req, res, query) {
        const searchwors = query;

        if (!searchwors.trim()) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Please seve a search word.');
            return;
        }

        // Search for the term in your dictionary
        // Return the definition if found, otherwise return not found message
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
