var socket;

$(document).ready(function() {

    $("#email").blur( function () {
        if($("#email").val().length === 0) {
            $("#email").removeClass("is-valid").addClass("is-invalid");
            $("#choose-email").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Campo obbligatorio!");
        }
        else{
            $("#choose-email").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
            $("#email").removeClass("is-invalid").addClass("is-valid");

        }
    });

    $("#pass").blur( function () {
        if($("#pass").val().length === 0) {
            $("#pass").removeClass("is-valid").addClass("is-invalid");
            $("#choose-password").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Campo obbligatorio!");
        }
        else{
            $("#pass").removeClass("is-invalid").addClass("is-valid");
            $("#choose-password").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
        }
    });

var HEBApp = {
    socket:null,
    init: function () {
        //Logout
        $("#logout-btn").on("click", function(){
            console.log("logout");
            HEBApp.logout_function();
        });
    },

    getSession: function(callback_function){
        $.get("/session",callback_function);
    },

    //connessione al server
    connection_server: function(token,callback){

        // console.log("Connessione in Corso..." );
        socket = io();  /** da il problema => ReferenceError: io is not defined **/
        socket.on("connect",function(){
            socket
                .emit("authenticate",{token:token})
                .on("authenticated",callback)
                .on("unauthorized",function(msg){
                    console.error(msg);
                })
        });
    },

    getValueFromLogin: function(inemail, inpassword){
        HEBApp.email = inemail;
        HEBApp.pass = inpassword;
        // $("#email").removeClass("is-invalid").addClass("is-invalid");
        // $("#pass").removeClass("is-invalid").addClass("is-invalid");
        // $("#choose-email").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
        // $("#choose-password").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
        $.post('/login', {email:inemail, pass:inpassword}, function(data){
            if(data.result !== false){
                //se il login va a buon fine ed ho il token, lo uso per aprire la connessione
                HEBApp.connection_server(data.token,function(){
                    window.setTimeout(function(){ $(location).attr("href", "/mainPanel.html");}, 1300);
                });
            }
            else{
                $("#login-btn").html('Login').css({ "background-color": "#5a6268", "border": "none", "color": "white", "font-size": "20px"});
                $("#email").removeClass("is-valid").addClass("is-invalid");
                $("#choose-email").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Ricontrolla i campi!");
                $("#pass").removeClass("is-valid").addClass("is-invalid");
                $("#choose-password").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Ricontrolla i campi!");
            }
        });
    },

    // Verificare se la sessione esiste
    checkSessionLogin: function(data){
        if(data.token){
            console.log("/session", data);
            HEBApp.email = data.email;
            HEBApp.connection_server(data.token,function(){
                /// cosa fare qui ?
                window.setTimeout(function(){ $(location).attr("href", "/mainPanel.html");}, 1300);

            });
        }
        else {
            /**cosa fare se il token non è stato creato(sessione non esistente) ??
            /richiamare logging() di nuovo ??? **/
        }
    },

    //Login
    logging: function(){

        $("#login-btn").on("click", function () {
            $("#login-btn").html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Caricamento').css({ "background-color": "#345a5e", "border": "none", "color": "white", "font-size": "20px"});
            var input_email = $("#email").val();
            var input_password = $("#pass").val();
            HEBApp.getValueFromLogin(input_email, input_password);
        });

        HEBApp.getSession(function(data){
            HEBApp.checkSessionLogin(data);
            console.log("HEB: ", HEBApp);
        });

    },

    //logout
    logout_function: function(){
        // socket.emit("logout_event", socket.id);
        $.post("/logout", function(data){
            if(data)
                window.setTimeout(function(){ $(location).attr("href", "/login.html");}, 1300);
        });
    },
};

HEBApp.init();
HEBApp.logging();

});
