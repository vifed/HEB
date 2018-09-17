
$(document).ready(function(){
    loadEvent();

    $("#register_btn").on('click', function () {
        var bookingVal = {
            Nome: $("#nome").val(),
            Cognome: $("#cognome").val(),
            Email: $("#mail").val(),
            Telefono: $("#telefono").val(),
            NomeAcc: $("#nomeAcc").val(),
            CognomeAcc: $("#cognomeAcc").val(),
            EmailAcc: $("#mailAcc").val(),
            TelefonoAcc: $("#telefonoAcc").val(),
            Evento: $(".NomeSelected").html(),
            Luogo: $(".LuogoSelected").html(),
            Data: $(".DataSelected").html(),
            Ora: $(".OraSelected").html()
        };

        $("#register_form").submit( function (e) {
            const opzioni = {
                type: 'post',
                data: bookingVal,
                clearForm: true
            };
            e.preventDefault();
            $("#register_btn").attr('value', 'Caricamento');
            $(this).ajaxSubmit(opzioni);
            $(location).attr("href", "/done.html");
        })
    });

});

function loadEvent() {
    $("html,body").animate({ scrollTop: 0 }, "slow");
    $.post('/eventiAttivi', (res) => {
        var x = 0;
        result = JSON.parse(res);
        var Eventi = "";
        var resEventi = result.Eventi;
        var resScheduling = result.Scheduling;
        var Orari = "";
        $.each(resEventi, function (key, value) {
            Eventi +='<section id="bodyDetail'+key+'" class="detailsEvent" style="display: block"><div class="col"><p class="head_details">Dettagli Evento</p></div><div class="row"><div class="col col-md-7"><div class="event_title" property="title"><h2 id="nome'+x+'">'+ value.Nome+'</h2></div><div class="content description_event "><h4 id="luogo'+x+'">'+ value.Luogo +'</h4><blockquote><b>Descrizione :</b><p id="descriprionEvent">'+ value.Descrizione +'</p></blockquote></div></div><div class="col col-md-5"><div class="row"><div class="col col-md-4"><span class="row data_Evento" id="data'+x+'">' + value.Data_Inizio +'</span></div></div><div class="content event_poster"><img class="img-thumbnail" src='+"../"+ value.Foto +' property="image"></div>&nbsp;<div class="row"><div class="col"><label class="sched">Seleziona orario visita</label><br><select class="scheduling'+x+' required " id="myOra'+key+'" > <option value="" disabled hidden >Scegli orario</option></select></div></div></div><div class="col registerBtn"><button id="'+x+'" onclick="changeView(this.id)" class="btn btn-success" type="button">Registrati</button></div></div></section>';
            x++;
        });
        $(".detailsEvent").append(Eventi);
        $.each(resEventi, function (key, value) {
            Orari ="";
            var container = [];
            for( let i of resScheduling){
                if(i.ID_Events === value.ID){
                    if(!i.Limite_Users){
                        var time = i.Ora_Inizio;
                        time = time.substr(0, time.length-3);
                        container.push(' <option id="ora'+key+'">'+ time +'</option>');
                    }
                }
            }
            container = container.reverse();
            for(var i=0; i<container.length; i++){
                Orari += container[i];
            }
            if (!Orari.length){
                var full = '<span style="color: red; font-size: 200%;">Posti Esauriti!</span>';
                Orari = '<option id="ora'+key+'">POSTI DISPONIBILI ESAURITI!</option>';
                disableBtn(key);
                $("#bodyDetail"+key).fadeTo(0, 0.7).prepend(full);

            }
            $("#myOra"+key).append(Orari);
        });

    });
}

function disableBtn(id) {
    var btn = document.getElementById(id);
    btn.disabled = true;
}

function newPerson() {
    var newDiv = '<div class="col-md-12 nomeAcc"><h3>Inserisci i dati dell\'accompagnatore:</h3><br></div><div class="row"><div class="nomeUser"><div class="form-group"><label for="nomeAcc">Nome<b style="color: black;">*</b></label><br><input required="required" class="form-control" name="nome" id="nomeAcc" type="text"></div></div>&nbsp;<div class="cognomeUser"><div class="form-group"><label for="cognomeAcc">Cognome<b style="color: black;">*</b></label><br><input required="required" class="form-control" name="cognome" id="cognomeAcc" type="text"></div></div>&nbsp;</div><div class="row"><div class="emaiUser"><div class="form-group"><label for="mailAcc">Email <b style="color: black;">*</b></label><br><input required="required" class="form-control" name="mail" id="mailAcc" type="email"></div></div>&nbsp;<div class="telefonoUser"><div class="form-group"><label for="telefonoAcc">Telefono <b style="color: black;">*</b></label><br><input required="required" class="form-control" name="telefono" id="telefonoAcc" type="number"></div></div>&nbsp;</div>';
    $(".addPerson").html(newDiv);
    if($('#minorenne').prop('checked') === false){
        $(".addPerson").empty();
        $("html,body").animate({ scrollTop: 0 }, "slow");
    }
}

function changeView(id) {

    var nome = document.getElementById("nome"+id).innerHTML;
    var luogo = document.getElementById("luogo"+id).innerHTML;
    var data = document.getElementById("data"+id).innerHTML;
    var ora = $(".scheduling"+id+" option:selected").text();
    $(".detailsEvent").removeClass("d-block").addClass("d-none");
    $(".infoSharper").removeClass("d-block").addClass("d-none");
    $("#register_event").removeClass("d-none").addClass("d-block");
    $("span.NomeSelected").html(nome);
    $("span.LuogoSelected").html(luogo);
    $("span.DataSelected").html(data);
    $(".OraSelected").text(ora);
    $("html,body").animate({ scrollTop: 0 }, "slow");

}

