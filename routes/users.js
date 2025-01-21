//En la entrada de nuestra aplicación aparecerán los inputs de `login` y `pass`. 
// Si nos hemos logado ya y volvemos a esa entrada no deberán salir, y sí saldrá un enlace al `dashboard` y un botón de `logout`
const express=require('express');
const router=express.Router();
const {users}=require('../data/users.js')

//onst jwt = require('jsonwebtoken');
//const { jwtSecret, comparePassword } = require('../crypto/config');
 const { comparePassword } = require('../crypto/config');
const { authenticateToken ,generateToken} = require('../middlewares/authMiddleware.js');
 
//- Middleware para manejar datos de formulario y JSON

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//GET /: Página de inicio con formulario de inicio de sesión y enlace al panel de control.
router.get('/', (req, res) => {
     if (req.session.user) {
        // Si el usuario ya está autenticado, mostrar enlace al dashboard y logout
        res.send(`
          <h1>Bienvenido, ${req.session.user.name}</h1>
          <a href="/dashboard">Ir al Dashboard</a>
          <form action="/logout" method="POST" style="margin-top: 10px;">
            <button type="submit">Cerrar sesión</button>
          </form>
        `);
      } else {
        // Si el usuario no está autenticado, mostrar formulario de login
        res.send(`
          <h1>Inicio de Sesión</h1>
          <form action="/login" method="POST">
            <label for="username">Usuario:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Iniciar sesión</button>
          </form>
        `);
      }
  });



  //4. Ruta de Inicio de Sesión

//- Ruta que maneja la autenticación del usuario, genera un token y lo almacena en la sesión.
//- POST /login: Endpoint para autenticar y generar un token JWT.
  router.post('/login', (req, res) => {
    const { username, password } = req.body;
     const user = users.find((u) => u.username === username);

    
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = generateToken(user);
    req.session.token = token;
  req.session.user = {
        id: user.id,
        name: username,
      };
    res.redirect('/dashboard');
  
  
  });


  

  router.get('/dashboard', authenticateToken, (req, res) => {
     
    const userId = req.user.user;
     const user = users.find((u) => u.id === userId);
    
    if (user) {
      res.send(
        `<div><h1>Panel de Control</h1></div> 
        <h2>Bienvenido, ${user.name}!</h2> <p>ID: ${user.id}</p>
         <p>Usuario: ${user.username}</p> <br> 
         <form action="/logout" method="post">
         <button type="submit">Cerrar sesión</button> </form> <a href="/">home</a> `
      );
    } else {
      res.status(401).json({ message: 'Usuario no encontrado' });
    }
  });


  //- POST /logout: Endpoint para cerrar sesión y destruir la sesión.
  router.post('/logout', (req, res) => {
   req.session.destroy();
    res.redirect('/');
  });
  

  module.exports=router;