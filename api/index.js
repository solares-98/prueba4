// api/index.js
const mongoose = require("mongoose");
const Invitado = require("../modeloUser"); // Asegúrate de que el path es correcto
const nodemailer = require("nodemailer");

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Conexión exitosa a la base de datos"))
.catch((error) => console.error("Error al conectar a la base de datos:", error));

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  
  try {
    const nuevoInvitado = new Invitado({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      children: req.body.children
    });
    
    await nuevoInvitado.save();
    
    // Configurar y enviar correo (opcional)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    await transporter.sendMail({
      from: '"Boda de Alejandra y Roberto" <tu_correo@gmail.com>',
      to: nuevoInvitado.email,
      subject: "Invitación a la Boda",
      html: `<p>Hola ${nuevoInvitado.name}, te invitamos a nuestra boda.</p>`
    });
    
    return res.status(200).json({ message: "Registro exitoso", invitado: nuevoInvitado });
    
  } catch (error) {
    console.error("Error en el backend:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
