const authMiddleware = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.users;
const Bootcamp = db.bootcamps;

// Crear y guardar un nuevo usuario
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Obtener los bootcamp de un usuario
exports.findUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    return res.status(500).json({ error: "Error al buscar el usuario" });
  }
};

// Obtener todos los usuarios incluyendo sus bootcamp
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json(users);
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return res.status(500).json({ error: "Error al buscar usuarios" });
  }
};

// Actualizar usuarios
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  try {
    const [rowsUpdated] = await User.update(
      {
        firstName: firstName,
        lastName: lastName,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (rowsUpdated === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error mientras se actualizaba el usuario:", error);
    return res
      .status(500)
      .json({ error: "Error mientras se actualizaba el usuario" });
  }
};

// Eliminar usuarios
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.destroy({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error mientras se eliminaba el usuario:", error);
    return res
      .status(500)
      .json({ error: "Error mientras se eliminaba el usuario" });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const accessToken = authMiddleware.generateToken(user.id);

    const userLogin = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return res.status(200).json({ user: userLogin, accessToken: accessToken });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
