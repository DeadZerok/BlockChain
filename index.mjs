import { createServer } from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BlockChain } from './blockchain.js'; // Importación del módulo blockchain.js

// Obtener la ruta del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de la cadena de bloques para tarros de aceite
let aceiteChain = new BlockChain('Tarros de Aceite', '0000');

// Función para manejar peticiones POST (añadir y vender tarros)
function handlePostRequest(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        const { url } = req;
        const data = JSON.parse(body);

        //datos del tarro
        if (url === '/addTarro') {
            const { productId, productNombre, productFecha, productDistribuidor } = data;

            // Validar que todos los datos estén presentes en la solicitud
            if (!productId || !productNombre || !productFecha || !productDistribuidor) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Todos los campos (ID, nombre, fecha y distribuidor) son requeridos.');
                return;
            }

            // Verificar si el ID ya existe en la cadena de bloques
            const exists = aceiteChain.chain.some(block => block.data.productId === productId);
            if (exists) {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end('Este ID ya fue registrado.');
                return;
            }

            // Añadir un nuevo bloque con el producto ID a la cadena de bloques
            aceiteChain.addBlock(productId, productNombre, productFecha, productDistribuidor);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Tarro añadido con éxito.');
        } else if (url === '/sellTarro') {
            const { productId } = data;

            // Buscar el bloque correspondiente al producto por su ID
            const block = aceiteChain.chain.find(b => b.data.productId === productId);
            if (!block) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Tarro no encontrado.');
                return;
            }

            // Verifica si el tarro ya ha sido vendido
            if (block.sold) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Este tarro ya fue vendido.');
                return;
            }

            // Marcar el tarro como vendido y modificar el hash
            block.sold = true;
            block.hash = 'VENDIDO_' + block.hash;

            // Responder con la cadena de bloques actualizada
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Tarro marcado como vendido.', chain: aceiteChain.chain }));
        }
    });
}

// Función para manejar peticiones GET (obtener la cadena de bloques y verificar tarros por ID)
function handleGetRequest(req, res) {
    const { method, url } = req;

    if (method === 'GET' && url === '/') {
        // Servir el archivo index.html al acceder al servidor
        const filepath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    } else if (method === 'GET' && url === '/chain') {
        // Devolver la cadena de bloques en formato JSON
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(aceiteChain.chain));
    } else if (method === 'GET' && url.startsWith('/verifyTarro')) {
        // Verificar estado de un tarro por su ID
        const productId = new URL(`http://localhost${url}`).searchParams.get('productId');

        // Buscar el bloque correspondiente al producto por su ID
        const block = aceiteChain.chain.find(b => b.data === productId);
        if (!block) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Tarro no encontrado.' }));
            return;
        }

        // Devolver el estado del tarro (vendido o disponible)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ productId: block.data, sold: block.sold }));
    } else if (method === 'GET' && url === '/ventaAceite.html') {
        // Servir el archivo ventaAceite.html
        const filepath = path.join(__dirname, 'public', 'ventaAceite.html');
        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    } else if (method === 'GET' && url === '/registro.html') {
        // Servir el archivo registro.html
        const filepath = path.join(__dirname, 'public', 'registro.html');
        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    } else if (method === 'GET' && url === '/busquedaClient.html') {
        // Servir el archivo registro.html
        const filepath = path.join(__dirname, 'public', 'busquedaClient.html');
        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write('404 Not Found');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    }// 1) CSS
    else if (url.startsWith('/css/')) {
        serveStaticFile(res, url, 'text/css');
    }
    // 2) Imágenes
    else if (url.startsWith('/img/')) {
        const ext = path.extname(url).toLowerCase();
        const contentType =
            ext === '.png' ? 'image/png' :
                ext === '.jpg' ? 'image/jpeg' :
                    ext === '.jpeg' ? 'image/jpeg' :
                        ext === '.gif' ? 'image/gif' :
                            ext === '.svg' ? 'image/svg+xml' :
                                'application/octet-stream';
        serveStaticFile(res, url, contentType);
    }
    // 3) Resto → 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

// Función para servir archivos estáticos
function serveStaticFile(res, filePath, contentType) {
    // 1. Eliminamos todas las barras iniciales: "/css/registro.css" → "css/registro.css"
    const cleanPath = filePath.replace(/^\/+/, '');

    // 2. Construimos la ruta real dentro de public/
    const fullPath = path.join(__dirname, 'public', cleanPath);
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Crear el servidor HTTP
const server = createServer((req, res) => {
    // Manejar tanto peticiones GET como POST
    if (req.method === 'GET' || req.method === 'POST') {
        if (req.method === 'GET') {
            handleGetRequest(req, res); // Llamar función para manejar peticiones GET
        } else if (req.method === 'POST') {
            handlePostRequest(req, res); // Llamar función para manejar peticiones POST
        }
    } else {
        // Devolver error 405 para métodos no permitidos
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
    }
});

// Escuchar en el puerto 3000 y la dirección local 127.0.0.1
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
