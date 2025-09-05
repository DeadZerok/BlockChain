# Aceites Premium: Trazabilidad Blockchain para la Industria de Lubricantes
---
## 💡 Descripción del Proyecto

Este proyecto implementa una **solución blockchain privada** diseñada para combatir la **falsificación y el reenvase fraudulento** en la industria de aceites lubricantes. El sistema registra cada tarro de aceite como un **bloque único** en una cadena, creando un historial **inmutable y transparente** desde su producción hasta su consumo final. Al momento de la venta, el envase se marca como "vendido", lo que previene su reuso o suplantación en el mercado.

El objetivo principal es **garantizar la autenticidad del producto**, **proteger al consumidor** y **eliminar a los intermediarios no autorizados** que trafican con aceites usados o adulterados. La blockchain asegura que la información sea **transparente, verificable y a prueba de manipulaciones**.

---
## 🧠 ¿Cómo Funciona?
El sistema es una plataforma web con backend en Node.js y blockchain personalizada en JavaScript que gestiona el registro, venta y verificación de tarros de aceite.

1.  **Registro del Producto:** Cada tarro es ingresado al sistema como un bloque en la blockchain, con datos únicos y su hash correspondiente.

2.  **Venta del Producto:** Una vez se realiza la venta, el sistema actualiza el estado del tarro como "vendido" y rompe la cadena, marcándolo como consumido.

3.  **Verificación:** Cualquier actor en la cadena de suministro (tienda, distribuidor o cliente final) puede **consultar la blockchain** para verificar la autenticidad del producto. Al escanear un código o ingresar el número de serie, el usuario puede confirmar si el producto es original y si su historial de venta es legítimo.



---
## ⚙️ Tecnologías y Herramientas

* **Node.js:** servidor con http.
* **crypto-js:** hashing SHA-256 para los bloques
* **Blockchain Personalizada:** Una implementación de blockchain desde cero que permite un control total sobre las reglas y el flujo de trazabilidad.


---
## 🚀 Instalación y Uso

  *  **Node.js:** (versión 16 o superior). Descarga en: https://nodejs.org/


1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/DeadZerok/BlockChain.git
    cd BlockChain

    ```
2.  **es la librería usada para generar los hashes SHA-256 en la blockchain**
    ```bash
    npm init -y
    npm install crypto-js
    ```
3.  **Ejecutar la Aplicación:**
    ```bash
    node index.mjs
    ```
4.  **Probar la API con Postman:**
    ```bash
    Servidor escuchando en http://localhost:3000
    ```

---
