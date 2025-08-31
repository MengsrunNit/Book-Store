const fs = require('fs');

function requestHandler(req, res) {

    const url = req.url; 
    const method = req.method; 
     if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write(
            '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>'
        );
        res.write('</html>');
        return res.end(); // Ensure response ends here
    }
    
    // Handle the /message POST request
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(`Received chunk: ${chunk}`);
            body.push(chunk); // Collect incoming data chunks
        });
    
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();
            console.log(`Parsed body: ${parseBody}`);
            const message = parseBody.split('=')[1]; // Extract message from form data
    
            fs.writeFile('message.txt', message, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.statusCode = 500; // Internal server error
                    res.setHeader('Content-Type', 'text/html');
                    res.write('<html><body><h1>Server Error</h1></body></html>');
                    return res.end();
                }
                res.statusCode = 302; // Redirect to root
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    
        return; // Prevent further execution
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body><h1>Welcome to the Node.js Server</h1></body></html>');
    res.end();
};

exports.handler = requestHandler;
exports.someText = 'some hard coded goes here';
module.exports = {
    handler : requestHandler ,
    someText : 'some hard coded goes here',
}
