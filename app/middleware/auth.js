const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");

const secretKey = authConfig.secretKey;

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ message: "No se proporcionó ningún token." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token inválido." });
    }
    req.id = decoded.id;
    next();
  });
};

module.exports.generateToken = (userId) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, secretKey);

  return token;
};
