const crypto = require("crypto");

const claveSecreta = crypto.randomBytes(32).toString("base64");
console.log("Clave secreta generada:", claveSecreta);
