const http = require('http');
const EventEmitter = require("events").EventEmitter;
const express = require('express');
const bodyparser = require("body-parser");
//const url = require('url');
const path = require('path');
//const request = require('request');
const port = 8080;//normalizePort(process.env.PORT || '8080');
const myLog = require("./my_module");
//const httpRequest = require("./http_request");
const logger = new EventEmitter();
const mysql = require('mysql');
var fs = require('fs');
var nodemailer = require('nodemailer');

//upload img
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './Public/Immagini_Eventi/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname+"-"+Date.now()+path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const multer_upload = multer({ storage: storage, fileFilter: fileFilter });//.single("EventImage");
//
const app = express();
const serverWeb = http.createServer(app);
const wsServer = require('socket.io')(serverWeb);

//  Auth token
const jwt = require("jsonwebtoken");
const socketJWT = require("socketio-jwt");

const utenti =[]; //dovrebbe contenere gli utenti loggati ?!

//per le GET e POST request
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '/Public')));

//  Sessione
const expSession = require('express-session');
const mySecret = 'random-word';

// the session function midleware
const sessionMidleware = expSession({
    name: 'HEB_App',
    secret: mySecret,
    // proxy: true,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    // domain:  quale?
    cookie: {
        // secure: true,
        maxAge: 86400000
    }
});

wsServer.use(function(socket, next){
    sessionMidleware(socket.request, socket.request.res, next);
});

app.use(sessionMidleware);


logger.on("info",function(messaggio){
    myLog.info(messaggio);
});

logger.on("error",function(messaggio){
    myLog.error(messaggio);
});


//** Connessione del server al database  **//
const connection = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "HEBDB"
});

connection.connect(function (error) {
    if(error)
        myLog.error(error);
    else
        console.log("Database connected!");

});

app.get('/login', (req, res) => {
    res.redirect('/login.html');        /** res.sendFile(__dirname + '/Public/login.html'); **/
});

app.get('/register', (req, res) => {
    res.redirect('/register.html');     /** res.sendFile(__dirname + '/Public/register.html'); **/
});

app.get('/unsubscribe', (req, res) => {
    res.redirect('/unsubscribe.html');  /** res.sendFile(__dirname +'/Public/unsubscribe.html') **/
});

app.get('/mainPanel.html', (req, res) => {
    if(req.session.user){
        res.sendFile(__dirname + '/Private/mainPanel.html');
    }
    else{
        res.redirect('/login.html');
    }
});

app.get('/addEvento.html', (req, res) => {
    if(req.session.user){
        res.sendFile(__dirname + '/Private/addEvento.html');
    }
    else{
        res.redirect(401, '/login.html');
    }
});

app.get('/admin.html', (req, res) => {
    if(req.session.user){
        res.sendFile(__dirname + '/Private/admin.html');
    }
    else{
        res.redirect(401, '/login.html');
    }
});

app.get('/eventiAttivi.html', function (req, res) {
    if(req.session.user){
        res.sendFile(__dirname + '/Private/eventiAttivi.html');
    }
    else{
        res.redirect(401, '/login.html');
    }
});

app.get('/prenotazioni.html', function (req, res) {
    if(req.session.user){
        res.sendFile(__dirname + '/Private/prenotazioni.html');
    }
    else{
        res.redirect(401, '/login.html');
    }
});


var getSession = function(req,res){
    res.send(req.session.user);
};

app.get("/session", getSession);

/** Ricezione Prenotazioni agli Eventi + invio mail**/
function reverteFormat(str) {
    return str.split("/").reverse().join("-");
}

app.post('/sendBooking', (req, risposta) => {
    if(req.body){
    const emailbody = "Grazie per esserti prenotato per l'evento " + req.body.Evento + " !\n\n" +
        "Ti aspettiamo giorno " + req.body.Data + " alle ore " +
        " presso " + req.body.Luogo + ".\n\n" +
        "\nSe ti fossi prenotato per sbaglio o volessi disdire la tua prenotazione clicca sul link: ";
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'HEBServiceMail',
            pass: 'HEBServiceMail2018'
        }
    });
    var mailingList =[];
    mailingList.push(req.body.Email.toLowerCase());
    var mailOptions = {
        from: 'Sharper Catania <sharpereventi@norepy.com>',
        to: mailingList,
        subject: 'Registrazione per ' + req.body.Evento,
        text: emailbody,
        html: 'Grazie per esserti prenotato per l\'evento <b>'.concat(req.body.Evento).concat('</b>.<br>Ti aspettiamo giorno <b>').concat(req.body.Data)
            .concat('</b> alle ore <b>').concat(req.body.Ora).concat('</b><br> presso <b>').concat(req.body.Luogo).concat('</b>.<br><br>').concat('Se ti fossi prenotato per sbaglio o volessi cancellare la tua prenotazione clicca sul link: ')
            .concat('<a href="http://localhost:8080/unsubscribe">Cancella prenotazione!</a>').concat('<br><br><br>Non rispondere a questa email. <br>Generata automaticamente.')
    };
    var idQuery = mysql.format("SELECT ID FROM Events WHERE Nome = ?", [req.body.Evento]);
    connection.query(idQuery, (err, result) => {
        if (err)
            myLog.error(err);
        else {
            connection.query("SELECT ID, Num_part FROM Scheduling WHERE ID_Events = '" + result[0].ID + "' AND Ora_Inizio = '" + req.body.Ora + "'", function (err, rows) {
                if(err)
                    myLog.error(err);
                else{
                    var data = new Date(reverteFormat(req.body.Data));
                    var bookingVal = {
                        ID_Events: result[0].ID,
                        ID_Scheduling: rows[0].ID,
                        Data: data,
                        Nome: req.body.Nome,
                        Cognome: req.body.Cognome,
                        Email: req.body.Email.toLowerCase(),
                        Telefono: req.body.Telefono,
                        NomeAcc: "",
                        CognomeAcc: "",
                        TelefonoAcc: "",
                        EmailAcc: "",
                        Num_Partecipanti: 0
                    };
                    if(req.body.minorenne === 'minorenne'){
                        bookingVal.NomeAcc= req.body.NomeAcc;
                        bookingVal.CognomeAcc= req.body.CognomeAcc;
                        bookingVal.TelefonoAcc= req.body.TelefonoAcc;
                        bookingVal.EmailAcc= req.body.EmailAcc.toLowerCase();
                        mailingList.push(req.body.EmailAcc.toLowerCase());
                    }
                    connection.query("SELECT Num_Partecipanti FROM Booking WHERE ID_Scheduling = " + rows[0].ID + " AND ID_Events = " + result[0].ID, (err, counter) => {
                        if(err)
                            myLog.error(err);
                        else{
                            if(counter.length === 0)
                                bookingVal.Num_Partecipanti += 1;
                            else{
                                bookingVal.Num_Partecipanti = counter[0].Num_Partecipanti + 1;
                                const updateCount = mysql.format("UPDATE Booking SET Num_Partecipanti = "+bookingVal.Num_Partecipanti+" WHERE Num_Partecipanti = "+counter[0].Num_Partecipanti+" AND ID_Scheduling = "+rows[0].ID+" AND ID_Events = "+result[0].ID );
                                connection.query(updateCount, (err) =>{
                                    if (err)
                                        myLog.error(err);
                                });
                            }
                            if (bookingVal.Num_Partecipanti === rows[0].Num_part) {
                                connection.query("UPDATE Scheduling SET Limite_Users = '" + 1 + "' WHERE ID = '" + rows[0].ID + "'", (err, re) => {
                                    if (err)
                                        myLog.error(err);
                                })
                            }
                            connection.query('INSERT INTO Booking SET ?', bookingVal, function (err, res) {
                                if (err)
                                    myLog.error(err);
                                else {
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            myLog.error(error);
                                        }
                                    });
                                    risposta.end();
                                }
                            });
                        }
                    });

                }
            });
        }
    });
    }
});
/** **/

/** Elimina prenotazione da Email **/
app.post('/deleteBooking', function (req,risposta) {
    connection.query("SELECT ID FROM Events WHERE Nome = '"+req.body.event+"'", (err, event) =>{
        if(err)
            myLog.error(err);
        else{
            connection.query("SELECT ID, Limite_Users FROM Scheduling WHERE ID_Events = '" + event[0].ID + "' AND Ora_Inizio = '" + req.body.ora + "'", function (err, sched) {
                if (err)
                    myLog.error(err);
                else{
                    if(sched[0].Limite_Users === 1){
                        connection.query("UPDATE Scheduling SET Limite_Users = "+0+" WHERE ID = "+ sched[0].ID, (err) => {
                            if(err)
                                myLog.error(err);
                        })
                    }
                    connection.query("SELECT Num_Partecipanti FROM Booking WHERE ID_Scheduling = " + sched[0].ID + " AND ID_Events = " + event[0].ID, (err, counter) => {
                         if (err)
                             myLog.error(err);
                         else{
                             var newCounter = counter[0].Num_Partecipanti-1;
                             const updateCount = mysql.format("UPDATE Booking SET Num_Partecipanti = "+newCounter+" WHERE Num_Partecipanti = "+counter[0].Num_Partecipanti+" AND ID_Scheduling = "+sched[0].ID+" AND ID_Events = "+event[0].ID );
                             connection.query(updateCount, (err, newCount) => {
                                 if(err)
                                     myLog.error(err);
                             });
                             const deleteUser = mysql.format("DELETE FROM Booking WHERE Email = '"+req.body.email.toLowerCase()+"' AND ID_Events = "+event[0].ID+" AND ID_Scheduling = "+sched[0].ID);
                             connection.query(deleteUser, (err, book) => {
                                 if (err)
                                     myLog.error(err);

                                 risposta.end();
                             });
                         }
                    });

                }
            });
        }
    });
});
/** **/

/** Controllo live Email per evento da cancellare **/
app.post('/checkEmailLive', function (req, res) {
    var mailinput = JSON.stringify(req.body.mail).toLowerCase().replace(/"/g, ''); //replace toglie tutti i doppi apici
    connection.query("SELECT * FROM Booking WHERE Email = '"+ mailinput+"'", (err, rows) =>{
        if (err)
            myLog.error(err);
        else{
            if(!rows.length){
                res.send("404");
            }
            else{
                res.send("200");
            }
        }
    });
});
/** **/


/** Login **/
var checkLoginInput = function(req, res, next){
    if(req.body.email && req.body.pass){
        next();
    }
    else{
        res.send({result: false, msg: "Dati mancanti!"});
    }
};

var checkLogininDB = function (req, res, next) {
    connection.query("SELECT Email, Password FROM Admins WHERE Email='"+ req.body.email + "' AND Password='" + req.body.pass +"'", function (error, result) {
        if (error) {
            myLog.error(error);
        }
        else{
            if(result.length){
                console.log("res", result);
                next();
            }
            else{
                console.log("else res", result);
                res.send({result: false, msg: "Login errato!"});
            }
        }
    });
};

var checkLoginRes = function(req, res){
    req.session.user  = {
        email: req.body.email,
        token: jwt.sign({email: req.body.email, ts:Date.now()}, mySecret)
    };

    req.session.save(function (err) {
        if(err)
            myLog.error(err);
        else{
           var data = {result: true, token: req.session.user.token};
            res.send(data);
        }
    });
};

app.post('/login', checkLoginInput, checkLogininDB, checkLoginRes);
/** **/


/** Logout **/
var destroySession = function(req,res){
    req.session.destroy(function(err) {
        if(err){
            myLog.error(err);
        }
        req.session = null;
        res.send(true);
    });
};

app.post("/logout", destroySession);
/** **/

/** Cambio password da portale**/
var changeUSerPass = (req, res) => {
    if(req.body){
        let upPass = mysql.format("UPDATE Admins SET Password = '"+ req.body.pass + "' WHERE Email = '"+ req.body.email+"'");
        connection.query(upPass, (err) =>{
            if (err)
                myLog.error(err);
            else{
                res.send("200");
            }
        });
    }
};

app.post("/changePassword", changeUSerPass);
/** **/

/** Reset Password by Email**/
var sendMailReset = function(req, res){
    let passw = Math.random().toString(36).substring(3);
    let upPass = mysql.format("UPDATE Admins SET Password = '"+ passw + "' WHERE Email = '"+ req.body.Email+"'");
    let emailbody = "Di seguito trovi la nuova password per accedere al portale HEB!\n\n\nLa nuova password è :\t"+ passw + "\n\n\n\nHEB 2018";
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'HEBServiceMail',
            pass: 'HEBServiceMail2018'
        }
    });
    var mailOptions = {
        from: 'Portale HEB <HEBServiceMail@gmail.com>',
        to: req.body.Email,
        subject: 'Reset Password HEB',
        text: emailbody,
        html: 'Di seguito trovi la nuova password per accedere al portale HEB!<br><br>'.concat('La nuova password è :  <b>').concat(passw)
            .concat('</b><br><br> Non rispondere a questa mail. <br>Email generata automaticamente. <br><br>').concat('<b>HEB 2018</b>')
    };
    connection.query(upPass, (err, rows) =>{
        if (err)
            myLog.error(err);
        else{
            if(rows.affectedRows === 0){
                res.send("404");
            }
            else{
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        myLog.error(error);
                    } else {
                        res.send("200");
                    }
                });
            }
        }
    });
};

app.post('/sendMail', sendMailReset);
/** **/

/** INSERIMENTO Evento + Scheduling + upload Immagine **/
app.post('/upImg', multer_upload.single('EventImage'), function (req, res) {
    var event = {
        Nome: req.body.eventname,
        Descrizione: req.body.description,
        Foto: req.file.path,
        Luogo: req.body.luogo,
        Data_Inizio: req.body.startEvent,
        Data_Fine: req.body.endEvent,
    };

    var scheduling = JSON.parse(req.body.logSchedul);

    connection.query('INSERT INTO Events SET ?', event, function(err, result){
        if (err)
            myLog.error(err);
        else {
            var eventName = event.Nome;
            var idQuery = mysql.format("SELECT ID FROM Events WHERE Nome = ?", [eventName]);

            connection.query( idQuery, function (error, rows){
                if (error) {
                    myLog.error(error);
                }
                else {
                    for(var i=0; i<scheduling.length;){

                        var inputVal = {
                            ID_Events: rows[0].ID,
                            Descrizione: event.Descrizione,
                            Num_part: scheduling[i+2],
                            Ora_Inizio: scheduling[i],
                            Ora_Fine: scheduling[i+1],
                        };

                        connection.query('INSERT INTO Scheduling SET ?', inputVal, function (err, res) {
                            if (err)
                                myLog.error(err);
                        });
                        i=i+3;
                    }
                }
            });
        }
    });
    res.end();
});
/** **/

/**Eventi e Scheduling Attivi dal DB **/
function reverseString(str) {
     return str.split("-").reverse().join("/");
}

var getEventScheduling = function(req, response){
    var eventfromDB = [];
    var schedulfromDB = [];
    connection.query("SELECT * FROM Events", (err, res) =>{
        if(err)
            myLog.error(err);
        else {
            for(var i=0; i<res.length; i++){
                var inizio = reverseString(new Date(res[i].Data_Inizio).toLocaleDateString());
                var fine = reverseString(new Date(res[i].Data_Fine).toLocaleDateString());
                eventfromDB.push({
                    "ID" : res[i].ID,
                    "Nome": res[i].Nome,
                    "Descrizione": res[i].Descrizione,
                    "Foto": res[i].Foto.substr(6),
                    "Luogo": res[i].Luogo,
                    "Data_Inizio": inizio,
                    "Data_Fine": fine
                })
            }
            connection.query("SELECT * FROM Scheduling", (err, res) =>{
                if(err)
                    myLog.error(err);
                else {
                    for(var i=0; i<res.length; i++){
                        schedulfromDB.push({
                            "ID" : res[i].ID,
                            "ID_Events": res[i].ID_Events,
                            "Descrizione": res[i].Descrizione,
                            "Limite_Users": res[i].Limite_Users,
                            "Num_part": res[i].Num_part,
                            "Ora_Inizio": res[i].Ora_Inizio,
                            "Ora_Fine": res[i].Ora_Fine
                        })
                    }
                    var results = {
                        Eventi: eventfromDB,
                        Scheduling: schedulfromDB
                    };
                    results = JSON.stringify(results);
                    response.send(results);
                }
            });
        }
    });
};

app.post('/eventiAttivi', getEventScheduling);
/** **/

/** Eliminazione di un Evento **/
var deleteEvent = function(req, res){
    const idEvento = mysql.format("SELECT ID, Foto FROM Events WHERE Nome = " + req.body.Nome );
    connection.query(idEvento, (err, rows) => {
        if(err){
            myLog.error(err);
        }
        else{
            var img = rows[0].Foto;
            fs.unlink(img, (err) => {
                if(err)
                    myLog.error(err);
            });
            const schedulTODel = mysql.format("DELETE FROM Scheduling WHERE ID_Events = "+ rows[0].ID);
            connection.query(schedulTODel, (err) => {
                if(err){
                    myLog.error(err);
                }
                else{
                    const eventsToDel = mysql.format("DELETE FROM Events WHERE ID = " + rows[0].ID);
                    connection.query(eventsToDel, (err) => {
                        if(err){
                            myLog.error(err);
                        }
                    })
                }
            });
        }
    });
    res.end();
};

app.post('/delEvents', deleteEvent);
/** **/

// var modifyEvent = function(req, res){
//
// };
//
// app.post('/modify', modifyEvent);

/** GET Admins **/
var getAdmin = (req, response) => {
    connection.query("SELECT * FROM Admins", (err, result) =>{
       if(result.length){
           response.send(result);
       }
    });
};

app.post('/getAdmins', getAdmin);
/** **/

/** Eliminazione Admin **/
var delete_admin = function(req, res){
    if(req.body){
        var toDelete = JSON.parse(req.body.Admins);
        toDelete.forEach(function (value) {
            const idAdmin = mysql.format("DELETE FROM Admins WHERE Email = ?", [value]);
            connection.query(idAdmin, (err) => {
                if(err)
                    myLog.error(err);
            });
        });
        res.end();
    }
};

app.post('/delAdmin', delete_admin);
/** **/

/** Aggiunta Admin **/
var add_admin = function(req, res){
    if(req.body){
        var inputs = req.body;
        connection.query('INSERT INTO Admins SET ?', inputs, (err) =>{
            if(err)
                myLog.error(err);
            else
                res.end();
        });
    }
};

app.post('/addAdmins', add_admin);
/** **/

/** Controllo vecchia password**/
var checkPassInDB = function(req, res){
    if (req.body.password){
        let checkOld = mysql.format("SELECT ID FROM Admins WHERE Password = '"+ req.body.password + "' AND Email = '"+ req.session.user.email+"'");
        connection.query(checkOld, (err, rows) => {
            if (err)
                myLog.error(err);
            else {
                if(!rows.length){
                    res.send("404");
                }
                else{
                    res.send("200");
                }
            }
        });

    }
};

app.post('/checkOldPass', checkPassInDB);
/** **/

/** Prenotazioni **/
var getBookingData = function(req, res){
    connection.query("SELECT * FROM Booking", function (err, result) {
        if (err)
            myLog.error(err);
        else{
            if(result.length){
                var bookedVal= [];
                for (let i=0; i<result.length; i++){
                    connection.query("SELECT Nome FROM Events WHERE ID = "+result[i].ID_Events, (err, rows) => {
                        if (err)
                            myLog.error(err);
                        else{
                            var data = reverseString(new Date(result[i].Data).toLocaleDateString());
                            var sample ={
                                Nome: result[i].Nome,
                                Cognome: result[i].Cognome,
                                Email: result[i].Email,
                                Telefono: result[i].Telefono,
                                NomeAcc: result[i].NomeAcc,
                                CognomeAcc: result[i].CognomeAcc,
                                EmailAcc: result[i].EmailAcc,
                                TelefonoAcc: result[i].TelefonoAcc,
                                Evento: rows[0].Nome,
                                Ora:"x",
                                Data: data
                            };
                            connection.query("SELECT Ora_Inizio FROM Scheduling WHERE ID_Events = "+result[i].ID_Events, (err, rows) => {
                                if(err)
                                    myLog.error(err);
                                else{
                                    sample.Ora = rows[0].Ora_Inizio.substr(0,5);
                                    bookedVal.push(sample);
                                    if(i === result.length-1)
                                        res.send(bookedVal);
                                }
                            });
                        }
                    });
                }
            }
        }
    })
};

app.post('/getBooking', getBookingData);
/** **/

/** Eliminazione prenotazione da HEB **/
var delPrenotazione = function (req, risposta){

 connection.query("SELECT ID FROM Events WHERE Nome = '"+req.body.Evento+"'", (err, event) =>{
    if(err)
        myLog.error(err);
    else{
        connection.query("SELECT ID, Limite_Users FROM Scheduling WHERE ID_Events = '" + event[0].ID + "' AND Ora_Inizio = '" + req.body.Ora + "'", function (err, sched) {
            if (err)
                myLog.error(err);
            else{
                if(sched[0].Limite_Users === 1){
                    connection.query("UPDATE Scheduling SET Limite_Users = "+0+" WHERE ID = "+ sched[0].ID, (err) => {
                        if(err)
                            myLog.error(err);
                    })
                }
                connection.query("SELECT DISTINCT Num_Partecipanti FROM Booking WHERE ID_Scheduling = " + sched[0].ID + " AND ID_Events = " + event[0].ID, (err, counter) => {
                    if (err)
                        myLog.error(err);
                    else{
                        var newCounter = counter[0].Num_Partecipanti-1;
                        const updateCount = mysql.format("UPDATE Booking SET Num_Partecipanti = "+newCounter+" WHERE Num_Partecipanti = "+counter[0].Num_Partecipanti+" AND ID_Scheduling = "+sched[0].ID+" AND ID_Events = "+event[0].ID );
                        connection.query(updateCount, (err) => {
                            if(err)
                                myLog.error(err);
                        });
                        const deleteUser = mysql.format("DELETE FROM Booking WHERE Email = '"+req.body.Email.toLowerCase()+"' AND ID_Events = "+event[0].ID+" AND ID_Scheduling = "+sched[0].ID);
                        connection.query(deleteUser, (err) => {
                            if (err)
                                myLog.error(err);

                            risposta.end();
                        });
                    }
                });

            }
        });
    }
});
};

app.post('/cancPren', delPrenotazione);
/** **/

wsServer.on("connection",socketJWT.authorize({
    secret : mySecret,
    timeout: 7200000
}));

wsServer.on("authenticated", function(socketC){

    if(socketC.request.session.user)
        utenti[socketC.request.session.user.email] = socketC;
    socketC.on("logout_event", function(data){
        var email = socketC.request.session.user.email;
        if(email)
        {
            delete utenti[email];
        }
    });
});


serverWeb.listen(port, function () {
    logger.emit("info", "Server avviato sulla porta " + port);
});
