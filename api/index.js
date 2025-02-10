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
      <div style="font-family: 'Josefin Slab', serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #dddddd;">
              <div style="background-image: url('https://your-image-url.com/background.jpg'); background-size: cover; padding: 30px; border-radius: 10px;">
                  <h1 style="color: #ff6f61; font-family: 'Lancelot', cursive; font-size: 2.5em;">Alejandra y Roberto</h1>
                  <p style="color: #555555; font-size: 1.2em;">Hola <strong>${name}</strong>,</p>
                  <p style="color: #555555;">Nos complace invitarte a la boda de <strong>Alejandra y Roberto</strong>.</p>
                  <p style="color: #555555;"><strong>Fecha:</strong> 24 de Mayo de 2025</p>
                  <p style="color: #555555;"><strong>Ceremonia religiosa:</strong> Parroquia del Sagrado Corazón de Jesús, Calle Gil Preciado NO.11, Zona Centro, Tecolotlán Jal.</p>
                  <p style="color: #555555;"><strong>Evento social:</strong> Terraza las Palmas, Calle Roble NO.28, CP.48540 Tecolotlán, Jal.</p>
                  <p style="color: #555555; font-size: 1.1em;">¡Nos gustaria contar con tu valiosa presencia!</p>
              </div>
              <img src="https://your-image-url.com/footer-image.jpg" alt="Decorative Image" style="max-width: 100%; border-radius: 10px;">
          </div>
      </div>
    `;

    // Enviar el correo
    await transporter.sendMail({
      from: '"Boda de Alejandra y Roberto" <tu_correo@gmail.com>',
      to: email, // Se envía a la dirección que ingresó el usuario; puedes cambiarlo a otro destinatario si lo prefieres
      subject: "Confirmación de Asistencia - Boda de Alejandra y Roberto",
      html: htmlContent
    });

    return res.status(200).send(`Formulario enviado correctamente. <a href="${whatsappLink}" target="_blank">Haz clic aquí para enviar un mensaje de WhatsApp.</a>`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo." });
  }
};
