const http = require('http');
const fs = require('fs');
const { stringify } = require('querystring');

const PORT = 3000;
const FILE_PATH = 'data.json';

const server = http.createServer((req, res) => {
    const { method, url, headers } = req;
    let body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        if(method === 'GET' && url === '/items'){
            fs.readFile(FILE_PATH, 'utf8', (err, data) => {
                if(err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end('Erro ao ler dados');
                    return;
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data);
            });
            return
        } else if (method === 'POST' && url === '/items') {
            fs.readFile(FILE_PATH, 'utf8', (err, data) =>{
                if (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end('Erro ao ler dados');
                    return;
                }
                const items = JSON.parse(data);
                const newItem = JSON.parse(body);
                items.push(newItem);
                fs.writeFile(FILE_PATH, JSON.stringify(items), (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500);
                        res.end('Error ao escrever dados');
                        return;
                    }
                    res.write(201);
                    res.end('Item adicionado com sucesso');
                });
            });
        } else if (method === 'PUT' && url === '/items') {
            const itemId = url.split('/')[2];
            fs.readFile(FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end('Error ao ler dados');
                    return;
                }
                let items = JSON.parse(data);
                const updateItem = JSON.parse(body);
                items = items.map(item => {
                    if (item.id === itemId) {
                        return updateItem;
                    }
                    return item;
                });
                fs.writeFile(FILE_PATH, JSON.stringify(items), (err) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500);
                        res.end('Erro ao escrever dados');
                        return;
                    }
                    res.writeHead(200);
                    res.end('Item atualizado com sucesso');
                });
            });
        } else if(method === 'DELETE' && url === '/items') {
            const server = http.createServer((req,res) => {
            }).on ('end', () => {
                const itemId = url.split('/')[2];
                fs.readFile(FILE_PATH, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        res.writeHead(500);
                        res.end('Erro ao ler dados');
                        return;
                    }
                    let items = JSON.parse(data);
                    items = items.filter(item => item.id !== Number(itemId));
                    fs.writeFile(FILE_PATH, JSON.stringify(items), (err) => {
                        if(err) {
                            console.error(err);
                            res.writeHead(500);
                            res.end('Erro ao escrever dados');
                            return;
                        }
                        res.writeHead(200)
                        res.end('Item incluido com sucesso');
                    });
                });
            });
        };

     });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});