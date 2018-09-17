
$(document).ready(function () {

    $("#resbtn").on("click", function (e) {
        e.preventDefault();
        var mail = $("#inputEmail").val();
        if(!mail.length){
            $("#inputEmail").removeClass("is-valid").addClass("is-invalid");
            $("#notEmail").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Campo obbligatorio!");
        }
        else{
            $("#resbtn").html('<i class="fa fa-spinner fa-spin"></i>&nbsp;Caricamento').css({ "background-color": "#3455db", "border": "none", "color": "white", "font-size": "20px"});
            sendMail(mail);
        }
    })
});

function sendMail(mail) {
    $.post('/sendMail', {Email:mail}, function(res) {
        switch (res) {
            case "200":
                $("#resbtn").html('Finito!').css({ "background-color": "#008000", "border": "none", "color": "white", "font-size": "20px"});
                $("#inputEmail").removeClass("is-invalid").addClass("is-valid");
                $("#notEmail").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
                alert("Abbiamo inviato una mail all'indirizzo specificato.\n" +
                    "Controlla la tua casella di posta!" +
                    "\nSarai ora reindirizzato alla pagina di Login");
                window.setTimeout(inviata, 1300);
                break;
            case "404":
                $("#inputEmail").removeClass("is-valid").addClass("is-invalid");
                $("#notEmail").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Indirizzo email non corretto o non corrispondente ad alcun amministratore." +
                    "\nControllare e riprovare!");
                $("#resbtn").html('Reimposta Password').css({ "background-color": "#6c757d", "border": "none", "color": "white", "font-size": "20px"});
                break;
        }

    });
}

function inviata() {
    $(location).attr("href", "/login.html");
}