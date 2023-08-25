const db = require("../models");
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res) => {
  const { title, cue, description } = req.body;
  try {
    const createdBootcamp = await Bootcamp.create({
      title: title,
      cue: cue,
      description: description,
    });

    return res.status(201).json(createdBootcamp);
  } catch (error) {
    console.error("Error al crear el bootcamp:", error);
    return res.status(500).json({ error: "Error al crear el bootcamp" });
  }
};

// Agregar un usuario al bootcamp
exports.addUser = async (req, res) => {
  const { bootcampId, userId } = req.body;

  try {
    const bootcamp = await Bootcamp.findByPk(bootcampId);
    if (!bootcamp) {
      return res.status(404).json({ message: "Bootcamp no encontrado" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await bootcamp.addUser(user);
    return res.json({ message: "Usuario agregado al bootcamp exitosamente" });
  } catch (error) {
    console.error(
      "Error mientras se estaba agregando Usuario al Bootcamp:",
      error
    );
    return res
      .status(500)
      .json({ error: "Error al agregar usuario al bootcamp" });
  }
};

// Obtener los usuarios de un bootcamp
exports.findById = async (req, res) => {
  const { id } = req.params;

  try {
    const bootcamp = await Bootcamp.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!bootcamp) {
      return res.status(404).json({ message: "Bootcamp no encontrado" });
    }

    return res.json(bootcamp);
  } catch (error) {
    console.error("Error mientras se encontraba el bootcamp:", error);
    return res.status(500).json({ error: "Error al encontrar el bootcamp" });
  }
};

// Obtener todos los bootcamps incluyendo sus usuarios
exports.findAll = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json(bootcamps);
  } catch (error) {
    console.log("Error buscando los bootcamps: ", error);
    return res.status(500).json({ error: "Error al buscar los bootcamps" });
  }
};
