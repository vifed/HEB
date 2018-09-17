//var $newDiv1 = document.getElementById( "sched");

var logScheduling = [];

$(document).ready(function(){


    var count=1;
    $("#btnadd").click(function(){
        var html = '';

        // var ins = $("<li></li>").html("<b>Fascia:</b> " + count + " <b>Inizio: </b>" + st + "<b> Fine: </b>" + et + " <b>Partecipanti: </b>" + nump);
        // $(".schedulContainer").append(ins);
        html += '<div class="row" id="sched'+count+'"><div class="col-md-3"><label for="starttime" class="col-form-label">Inizio</label><input data-format="hh:mm:ss" type="time" class="form-control" id="starttime"></div><div class="col-md-3"><label for="endtime" class="col-form-label">Fine</label><input data-format="hh:mm:ss" type="time" class="form-control" id="endtime"></div><div class="col-md-3"><label for="numpart" class="col-form-label">Numero partecipanti:</label><input type="number" class="form-control" id="numpart"></div><div class="col-md-1"><label for="'+count+'" class="col-form-label">Elimina</label><button type="button" id="'+count+'" class="form-control btn btn-sm btn-outline-danger" onclick="delSingle(this.id)">X</button></div>';
        html += '</div>';
        count++;
        $('.schedulContainer').prepend(html);
     });


    $('#btnres').click(function() {
        logScheduling = [];
        console.log("scheduling res ", logScheduling);
      $(".schedulContainer").empty();
    });

    $( "#savebtn" ).click(function() {

        var nome = $("#eventname").val();
        var descr = $("#description").val();
        var place = $("#luogo").val();
        var se = $("#startEvent").val();
        var ee = $("#endEvent").val();

        $('.schedulContainer input').each(function() {
            var schedulInput = $(this).val();
            logScheduling.push(schedulInput);
        });

        var logSchedul = JSON.stringify(logScheduling);
        var inputVal = {eventname:nome, description:descr, luogo:place, startEvent:se, endEvent:ee, logSchedul };
        console.log("sched insert: ", logScheduling);
        $( "#frmUploader" ).submit(function (e) {

            const opzioni = {
                type: 'post',
                data: inputVal,
                clearForm: true,
            };

            e.preventDefault();
            $(this).ajaxSubmit(opzioni);
            $(location).attr("href", "/eventiAttivi.html");
        });
    });
});

function delSingle(id) {
    // logScheduling.pop($("#starttime").val());
    // logScheduling.pop($("#endtime").val());
    // logScheduling.pop($("#numpart").val());
    $("#sched"+id).empty();
}