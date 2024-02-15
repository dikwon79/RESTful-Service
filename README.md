# RESTful-Service
Minimal Dictionary RESTful Service, hosted at two origins



Service root endpoint: .../api/definitions/* 

.../api/definitions/?word=book  (GET request to get the definition of a word)
.../api/definitions (POST to create a new entry e.g. you put the query string in the body of your request 
( in the body not in the url, unlike GET) written or printed work consisting of pages glued or sewn together

## Server 1 
The client side files (HTML or the js which initiate the AJAX calls) are being hosted at server1 (e.g.  https://yourDomainName1.xyz* ). 
It shall send AJAX API calls to the API service which is hosted at another server, server 2. 


## Server 2
The server2 ( https://yourDomainName2.wyz*) that hosts the node js app that receives the API request from server1.
If it is a POST request, it adds a new record ( word: definition ) to our array of objects** ( array of word:definition). If the word already exists, it returns a message. ( e.g. 'Warning! blah blah ' already exists. Otherwise it adds the word and its definition to your dictionary and returns another appropriate message such as: 

Request # 102 (the total number of requests the server served so far) (updated on Feb14: its also nice to return the updated total number of entries exist. This means the total number of words that exist after this recent update. )  

New entry recorded:

"Book : A written or printed work consisting of pages glued or sewn together"

*: http or https ( but if you are sharing the https, make sure ssl is already installed and your web pages do not issues any security risk warning )

**: please pick dictionary as the identifier of the variable that holds the array of entries ( pick 'dictionary' as variable name for array of word:definition so that the marker can easily understand your code)


###collaborate with Jack
