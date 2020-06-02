var http = require('http'),
	fs = require('fs');
var os = require('os');
var PORT = 80;
//get server ip
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
var msg;
//404 Response
function send404Response(response) {
	msg = ">Error 404 ";
	console.log(msg);
	response.writeHeader(404, { "Content-Type": "text/html" });
	fs.createReadStream('./404.html').pipe(response);
}
//handle response
function sendFileResponse(name, type, response) {
	if (type == ".html") {
		msg = ">" + name + " page ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "text/html" });
		fs.createReadStream('./' + name + type).pipe(response);
	} else if (type == ".png") {
		var img = fs.readFileSync('./' + name + type);
		msg = ">" + name + ".png image ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "text/png" });
		response.end(img, 'binary');
	} else if (type == ".jpg") {
		var img = fs.readFileSync('./' + name + type);
		msg = ">" + name + ".jpg image ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "text/jpg" });
		response.end(img, 'binary');
	} else if (type == ".css") {
		msg = ">" + name + " style sheet ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "text/css" });
		fs.createReadStream('./' + name).pipe(response);
	} else if (type == ".js") {
		msg = ">" + name + " script ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "application/javascript" });
		fs.createReadStream('./' + name).pipe(response);
	} else if (type == ".json") {
		msg = ">" + name + " JSON ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "application/json" });
		fs.createReadStream('./' + name + type).pipe(response);
	} else {
		send404Response(response);

	}
}
//handle request
function onRequest(request, response) {
	if (request.method == 'GET' && request.url == '/') {
		msg = ">Home page ";
		console.log(msg);
		response.writeHeader(200, { "Content-Type": "text/html" });
		fs.createReadStream('./index.html').pipe(response);

	} else if (request.url.length > 1) {
		var name = request.url.slice(1);

		if (fs.existsSync("./" + name + ".html")) {
			sendFileResponse(name, ".html", response);

		} else if (fs.existsSync("./" + name + ".png")) {
			sendFileResponse(name, ".png", response);

		} else if (fs.existsSync("./" + name + ".jpg")) {
			sendFileResponse(name, ".jpg", response);

		} else if (fs.existsSync("./" + name + ".json")) {
			sendFileResponse(name, ".json", response);

		} else if (fs.existsSync("./" + request.url)) {
			if (request.url.endsWith(".css")) {
				sendFileResponse(name, ".css", response);
			} else if (request.url.endsWith(".js")) {
				sendFileResponse(name, ".js", response);
			}
		} else {
			send404Response(response);

		}
	} else {
		send404Response(response);

	}
}
//starts the server
http.createServer(onRequest).listen(PORT);
console.log(`>LAN server running on  ${addresses[0]}:${PORT}`);