const app = require('express')();
const express = require("express");
const cors = require("cors");
const { turnosNormalesCaja, turnosPreferencialesCaja, turnosNormalesServ, turnosPreferencialesServ } = require("./config/global.variables");
var corsOptions = {
  origin: "http://localhost:4200"
};
const db = require("./models");
var userCount = 0;
var userTurnoActualInt = 10;

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conexion a BD con exito!");
  })
  .catch(err => {
    console.log("No se conecta a la bd!", err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.send('<h1>Turnos</h1>');
});

require("./routes/ticket.routes")(app);

io.on('connection', (socket) => {
  userCount++;

  console.log(userCount.toString() + ' usuario conectado');
  socket.on('disconnect', () => {
    console.log('usuario desconectado');
  });

  socket.on('turnoActual', () => {
    socket.emit('turnoActual', `${userTurnoActualInt}`);
  });

  socket.on('siguienteTurnoCaja', () => {
    var siguienteTurno = "";
    if (!turnosNormalesCaja.length && !turnosPreferencialesCaja.length) {
      io.emit('turnoActual', `0`);
      return;
    }
    if (turnosPreferencialesCaja.length) {
      siguienteTurno = `${turnosPreferencialesCaja[0]}`;
      var i = turnosPreferencialesCaja.shift();
      io.emit('turnoActual', `${siguienteTurno}`);
      return
    }
    siguienteTurno = `${turnosNormalesCaja[0]}`;
    var i = turnosNormalesCaja.shift();
    io.emit('turnoActual', `${siguienteTurno}`);
  });

  socket.on('siguienteTurnoServ', () => {
    var siguienteTurno = "";
    if (!turnosNormalesServ.length && !turnosPreferencialesServ.length) {
      io.emit('turnoActual', `0`);
      return;
    }
    if (turnosPreferencialesServ.length) {
      siguienteTurno = `${turnosPreferencialesServ[0]}`;
      var i = turnosPreferencialesServ.shift();
      io.emit('turnoActual', `${siguienteTurno}`);
      return
    }
    siguienteTurno = `${turnosNormalesServ[0]}`;
    var i = turnosNormalesServ.shift();
    io.emit('turnoActual', `${siguienteTurno}`);
  });
});

http.listen(3000, () => {
  console.log('Escuchando puerto *:3000');
});