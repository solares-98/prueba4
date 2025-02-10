const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // Solo se permiten solicitudes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Extraer los datos enviados en el formulario
    const { name, phone, email, children } = req.body;
    console.log("Datos recibidos:", req.body);

    // Configurar el transportador de correo usando las variables de entorno
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Debe estar configurado en Vercel
        pass: process.env.EMAIL_PASS  // Contraseña de aplicación generada para Gmail
      }
    });

    // Construir el contenido HTML del correo
    const htmlContent = `
      <h1>Confirmación de Asistencia</h1>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Número de niños:</strong> ${children}</p>
    `;

    // Enviar el correo
    await transporter.sendMail({
      from: '"Boda de Alejandra y Roberto" <tu_correo@gmail.com>',
      to: email, // Se envía a la dirección que ingresó el usuario; puedes cambiarlo a otro destinatario si lo prefieres
      subject: "Confirmación de Asistencia - Boda de Alejandra y Roberto",
      html: htmlContent
    });

    return res.status(200).json({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo." });
  }
};
