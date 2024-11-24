require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const corsOptions = {
  origin: 'https://urldelfronted', //en dedsarrollo 'http://localhost:4200'
  methods: ['GET', 'POST'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
  host: 'smtp.proveedordedominio.com', //el host SMTP de tu proveedor de dominio
  port: 465, //465 si tienes https y 587 si tienes http
  secure: true, //true si port=465 y false si port=587
  auth: {
    user: process.env.NODemailer_USER,
    pass: process.env.NODemailer_PASS
  }
})

app.post('/api/send-email', (req, res, next) => {
  const { name, email, phone, message } = req.body

  const mailOptions = {
    from: 'contacto@dominio.com',
    to: 'contacto@dominio.com', //donde se quieren recibir las respuestas al formulario
    subject: `Nueva consulta de ${name}`,
    text: `
        Nombre: ${name}
        Correo: ${email}
        Teléfono: ${phone}
        Mensaje: ${message}
      `,
    replyTo: email
  }
  //sendMail está en el fronted
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(
        'Error al enviar el correo. Vuelve a intentarlo más tarde.',
        error
      )
      return res.status(500).send(error.toString())
    }
    res
      .status(200)
      .send({ message: 'Tu correo se ha enviado. Gracias por contactar.' })
  })
})

//Escuchar puerto 3000 en desarrollo, en producción eliminar app.listen():
//app.listen(process.env.PORT, () => console.log('Servidor en el puerto', process.env.PORT))

module.exports = app
