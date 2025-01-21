const express=require('express');
const app=express();
const PORT=3000;
const usersRouter=require('./routes/users.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const { jwtSecret } = require('./crypto/config'); // Asegúrate de importar un secreto seguro


// Middleware
app.use(bodyParser.json());

//- Sesión
app.use(
    session({
      secret:jwtSecret, // Clave secreta para firmar el token (debería ser segura, preferiblemente generada con crypto)
      resave: false, // No guardar cambios en la sesión siempre, solo cuando se realice algún cambio
      saveUninitialized: true, // Se guarda la inicialización de la sesión
      cookie: { secure: false }, // Cambia a 'true' si estás utilizando HTTPS
    })
  );


app.use('/',usersRouter);

 //Servidor escuchando
 app.listen(PORT,()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
    
 })