const http = require('http');
const https = require('https');

/**
 * getJSON:  RESTful GET request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */

function getJSON(options, callback) {
    // console.log('rest::getJSON\n');
    const port = options.port == 443 ? https : http;

    let output = '';

    const req = port.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            let obj = JSON.parse(output);
            callback(obj); // return callback
        }); 
    });

    req.on('error', (err) => {
        res.send('error: ' + err.message);
    });

  req.end();
//   return output;
}







module.exports = {
    getJSON
}



