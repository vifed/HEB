$(document).ready(function(){

    adminInfo();

    /** Cambio Password **/
    $("#oldpass").on("focusout", function () {
        checkOldPass();
    });

    $("#newpass").on("focusout", function () {
        checkNewPass();
    });

    $("#repetpass").on("focusout", function () {
        checkRepetePass();
    });
    /** **/

    /** Aggiungi Admin **/
    $("#nome").on("focusout", function () {
        checkVal();
    });

    $("#cogn").on("focusout", function () {
        checkVal();
    });

    $("#mail").on("focusout", function () {
        checkVal();
    });

    $("#pass").on("focusout", function () {
        checkVal();
    });

    $("#confpass").on("focusout", function () {
        checkVal();
    });
    /** **/

    $("#delbtn").click(function () {
        var selected = [];
        $('#adminsAdded input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                selected.push($( this ).val());
            }
        });
        console.log(" scelto : ", selected);
        if(selected.length){
            selected = JSON.stringify(selected);
            $.post('/delAdmin', {Admins:selected}, () => {
                alert("Eliminazione completata con successo!");
                location.reload();
            })
        }
        else
            alert("Seleziona almeno un amministratore!");
    });

    $("#addbtn").on('click', function () {
        checkVal();
        var input_val = {
            Email: $("#mail").val(),
            Password: $("#pass").val(),
            Nome: $("#nome").val(),
            Cognome: $("#cogn").val(),
            Level: 100
        };
        console.log("input: ", input_val);
        if(input_val){
            $.post('/addAdmins', input_val, () => {
                alert("Admin aggiunto con successo!");
                location.reload();
            });
        }
        else{
            checkVal();
        }
    });


    $("#changepass").on('click', function () {
        var a = $("#oldpass").val();
        var pass1 = $("#newpass").val();
        var pass2 = $("#repetpass").val();
        var admin =  $(".e-mail").text();

        console.log("change", a, pass1, pass2);
        console.log("\nuser loggato: ",admin);
        if(a.length && pass1.length && pass2.length){
            $.post('/changePassword', {email:admin, pass:pass1},(res) =>{
                if (res === "200")
                    alert("Password modificata con successo!");
                    location.reload();
            })
        }
    });


});

function checkVal() {
    if($("#nome").val().length === 0){
        $("#nome").removeClass("is-valid").addClass("is-invalid");
        $("#nomeAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
    }
    else{
        $("#nome").removeClass("is-invalid").addClass("is-valid");
        $("#nomeAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
    }
    if($("#cogn").val().length === 0){
        $("#cogn").removeClass("is-valid").addClass("is-invalid");
        $("#cognomeAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
    }
    else{
        $("#cogn").removeClass("is-invalid").addClass("is-valid");
        $("#cognomeAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
    }
    if($("#mail").val().length === 0){
        $("#mail").removeClass("is-valid").addClass("is-invalid");
        $("#emailAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
    }
    else{
        $("#mail").removeClass("is-invalid").addClass("is-valid");
        $("#emailAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
    }
    if($("#pass").val().length < 5){
        if($("#pass").val().length === 0){
            $("#pass").removeClass("is-valid").addClass("is-invalid");
            $("#passAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
        }
        else{
            $("#pass").removeClass("is-valid").addClass("is-invalid");
            $("#passAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("La password deve essere almeno di 5 caratteri!");
        }
    }
    else{
        $("#pass").removeClass("is-invalid").addClass("is-valid");
        $("#passAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
    }
    if($("#confpass").val().length < 5){
        if($("#confpass").val().length === 0){
            $("#confpass").removeClass("is-valid").addClass("is-invalid");
            $("#confPassAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
        }
        else{
            $("#confpass").removeClass("is-valid").addClass("is-invalid");
            $("#confPassAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("La password deve essere almeno di 5 caratteri!");
        }
    }
    else{
        if($("#confpass").val().localeCompare($("#pass").val()) !== 0){
            $("#pass").removeClass("is-valid").addClass("is-invalid");
            $("#passAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Le password non coincidono!");
            $("#confpass").removeClass("is-valid").addClass("is-invalid");
            $("#confPassAd").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Le password non coincidono!");
        }
        else {
            $("#confpass").removeClass("is-invalid").addClass("is-valid");
            $("#confPassAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
            $("#pass").removeClass("is-invalid").addClass("is-valid");
            $("#passAd").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
        }
    }
}

function checkOldPass() {
    var oldPass = document.getElementById("oldpass").value;
    if(oldPass.length){
        $("#oldpass").removeClass("is-invalid").addClass("is-valid");
        $("#notvalpass").text("");
        $.post('/checkOldPass', {password:oldPass}, (res) =>{
            switch (res) {
                case "200":
                    $("#oldpass").removeClass("is-invalid").addClass("is-valid");
                    $("#notvalpass").empty();
                    break;
                case "404":
                    $("#oldpass").removeClass("is-valid").addClass("is-invalid");
                    $("#notvalpass").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("La password non corrisponde!");
                    break;
            }
        })
    }
    else{
        $("#oldpass").removeClass("is-valid").addClass("is-invalid");
        $("#notvalpass").text("Il campo non puà essere vuoto");
    }
}

function checkNewPass() {
    var pass1 = $("#newpass").val();
    if(pass1.length<5){
        if(pass1.length === 0 ){
            $("#newpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalnew").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
        }
        else{
            $("#newpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalnew").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("La password deve essere almeno di 5 caratteri!");
        }
    }
    else{
        $("#newpass").removeClass("is-invalid").addClass("is-valid");
        $("#notvalnew").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
    }
}

function checkRepetePass() {
    var pass2 = $("#repetpass").val();
    if(pass2.length<5){
        if(!pass2.length){
            $("#repetpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalrepet").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Il campo non puà essere vuoto");
        }
        else{
            $("#repetpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalrepet").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("La password deve essere almeno di 5 caratteri!");
        }
    }
    else{
        if(pass2.localeCompare($("#newpass").val()) !== 0){
            $("#repetpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalrepet").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Le password non coincidono!");
            $("#newpass").removeClass("is-valid").addClass("is-invalid");
            $("#notvalnew").removeClass("valid-feedback d-none").addClass("invalid-feedback d-block").text("Le password non coincidono!");
        }
        else{
            $("#repetpass").removeClass("is-invalid").addClass("is-valid");
            $("#notvalrepet").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
            $("#newpass").removeClass("is-invalid").addClass("is-valid");
            $("#notvalnew").removeClass("invalid-feedback d-none").addClass("valid-feedback d-block").text("");
        }
    }
}

function fillAdmin() {
    $.post('/getAdmins', (res) =>{
        var html='<div id="adminsAdded" style="background: #D8D8D8;">';
        $.each(res, function (key, value) {
            html += '<div><input type="checkbox" value="'+value.Email+'" />&nbsp;'+value.Nome.toUpperCase()+'<b>&nbsp; - &nbsp;</b>'+value.Cognome.toUpperCase()+'<b>&nbsp; - &nbsp;</b>'+value.Email.toUpperCase()+ '</div>';
        });
        html += '</div>';
        $("#activeAdmins").html(html);
    });
}

function adminInfo() {
    $.post('/getAdmins', (res) => {
       $.get('/session', (result) => {
           $.each(res, (key, value) => {
               if(value.Email === result.email){
                   $(".name").html('<span><b>'+value.Nome+'</b><span>');
                   $(".surname").html('<span><b>'+value.Cognome+'</b><span>');
                   $(".e-mail").html('<span><b>'+value.Email+'</b><span>');
               }
           });
       });

    });
}