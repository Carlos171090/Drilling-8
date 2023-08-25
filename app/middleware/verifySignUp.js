const db = require("../models");
const User = db.users;

module.exports.verifySignUp = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    next();
  } catch (error) {
    console.error("Error al verificar registro:", error);
    res.status(500).json({ error: "Error al verificar el registro" });
  }
};
