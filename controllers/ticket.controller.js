const db = require("../models");
const { turnosNormalesCaja,turnosPreferencialesCaja,turnosNormalesServ,turnosPreferencialesServ } = require("../config/global.variables");
const Ticket = db.ticket;

let { atencionNormalCountCaja,atencionPreferencialCajaCount, atencionNormalServCount,atencionPreferencialServCount } = require("../config/global.variables");

//tramite 0 caja tramite 1 servicio
//atencion0 normales atencion 0 preferenciales

exports.create = (req, res) => {
  if (!req.body.identidad) {
    res.status(400).send({ message: "Identidad no puede ser vacia" });
    return;
  }

    var indexAdded;
    var ticketNum;
    if(parseInt(req.body.tramite) === 0)
    {
      indexAdded = parseInt(req.body.atencion) === 0 ? turnosNormalesCaja.push(`CN${atencionNormalCountCaja++}`) : turnosPreferencialesCaja.push(`CP${atencionPreferencialCajaCount++}`)
      ticketNum = parseInt(req.body.atencion) === 0 ? turnosNormalesCaja[indexAdded-1] : turnosPreferencialesCaja[indexAdded-1]
    }
    else
    {
      indexAdded = parseInt(req.body.atencion) === 0 ? turnosNormalesServ.push(`SN${atencionNormalServCount++}`) : turnosPreferencialesServ.push(`SP${atencionPreferencialServCount++}`)
      ticketNum = parseInt(req.body.atencion) === 0 ? turnosNormalesServ[indexAdded-1] : turnosPreferencialesServ[indexAdded-1]
    }
    
  const ticket = new Ticket({
    identidad: req.body.identidad,
    estado: req.body.estado,
    tramite: req.body.tramite,
    atencion: req.body.atencion,
    ticket:  ticketNum
  });

  ticket
    .save(ticket)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error."
      });
    });
};

exports.findAll = (req, res) => {
  const identidad = req.query.identidad;
  var condition = identidad ? { identidad: { $regex: new RegExp(identidad), $options: "i" } } : {};

  Ticket.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ha ocurrido un error."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Ticket.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No se encontro el ticket con ID:  " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error con el ticket id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "No puede estar vacio el body!"
    });
  }

  const id = req.params.id;

  Ticket.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar Ticket id=${id}. `
        });
      } else res.send({ message: "Se actualizo." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error  id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Ticket.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Ticket id=${id} no se puede borrar!`
        });
      } else {
        res.send({
          message: "Ticket eliminado!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se puede borrar id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Ticket.deleteMany({})
    .then(data => {
      atencionNormalCountCaja,atencionPreferencialCajaCount, atencionNormalServCount,atencionPreferencialServCount = 1;
      turnosNormalesCaja.length = 0;
      turnosPreferencialesCaja.length = 0;
      turnosPreferencialesCaja.length = 0;
      turnosPreferencialesServ.length = 0;
     

      res.send({
        message: `${data.deletedCount} Se borraron los tickets!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Se produjo un error eliminando."
      });
    });
};
