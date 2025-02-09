const mongoose = require("mongoose");
const Invitado = require("../modeloUser"); // Asegúrate de que el modelo esté bien importado
const nodemailer = require("nodemailer");

mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

export default async function handler(req, res) {
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
        res.status(200).json({ message: "Registro exitoso", invitado: nuevoInvitado });

    } catch (error) {
        console.error("Error en el backend:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}
