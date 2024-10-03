// Importa la librería crypto-js para utilizar la función de hash SHA-256
const SHA256 = require('crypto-js/sha256');

// Definición de la clase Block que representa un bloque en la cadena
class Block {
    // El constructor inicializa un bloque con su índice, los datos que almacena y la referencia al hash anterior
    constructor(index, data, previousHash = '') {
        this.index = index;
        this.date = new Date();  // Fecha de creación del bloque
        this.data = data;  // Datos que almacena el bloque (ahora será un objeto con varios campos)
        this.previousHash = previousHash;  // Hash del bloque anterior
        this.hash = this.createHash();  // Hash calculado del bloque actual
        this.nonce = 0;  // Valor usado para resolver la prueba de trabajo (minado)
        this.sold = false;  // Propiedad que indica si el tarro está vendido o no
    }


    // Función para crear el hash del bloque combinando su contenido
    createHash() {
        // Genera el hash a partir de los atributos del bloque, incluyendo el nonce para el minado
        return SHA256(this.index + this.date + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }

    // Función que realiza la minería (prueba de trabajo) del bloque
    mine(difficulty) {
        // Se sigue incrementando el nonce hasta que el hash generado empiece con el número de ceros especificado en difficulty
        while (!this.hash.startsWith(difficulty)) {
            this.nonce++;  // Incrementa el nonce para recalcular el hash
            this.hash = this.createHash();  // Vuelve a generar el hash hasta cumplir con la condición
        }
    }
}

// Definición de la clase BlockChain que representa la cadena de bloques
class BlockChain {
    // El constructor inicializa la cadena con el bloque génesis y establece la dificultad para minar los bloques
    constructor(genesis, difficulty = '00') {
        this.chain = [this.createFirstBlock(genesis)];  // La cadena comienza con un bloque génesis
        this.difficulty = difficulty;  // Define la dificultad del minado (número de ceros que debe tener el hash)
    }

    // Crea el bloque génesis, el primer bloque de la cadena
    createFirstBlock(genesis) {
        return new Block(0, { productNombre: genesis }, '');  // El bloque génesis tiene índice 0 y ningún bloque anterior
    }

    // Función que devuelve el último bloque de la cadena
    getLastBlock() {
        return this.chain[this.chain.length - 1];  // Devuelve el último bloque (el más reciente) en la cadena
    }

    // Función que añade un nuevo bloque con los datos proporcionados
    addBlock(productId, productNombre, productFecha, productDistribuidor) {
        let prevBlock = this.getLastBlock();  // Obtiene el último bloque actual de la cadena
        
        // Crear un objeto con toda la información del tarro
        const data = {
            productId,
            productNombre,
            productFecha,
            productDistribuidor
        };

        // Crea un nuevo bloque con el índice siguiente al último bloque, y su hash anterior
        let block = new Block(prevBlock.index + 1, data, prevBlock.hash);
        // Realiza el minado del nuevo bloque para que cumpla con la dificultad establecida
        block.mine(this.difficulty);
        // Añade el nuevo bloque a la cadena
        this.chain.push(block);
    }
}

// Exporta la clase BlockChain para poder ser utilizada en otros archivos del proyecto
module.exports = { BlockChain };
