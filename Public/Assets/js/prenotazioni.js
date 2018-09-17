$(document).ready( function () {
    getDati();
});

function getDati() {
    $.post('/getBooking', (res) =>{
        renderBooking(res);
    })
}

function renderBooking(data) {
    data.forEach(function (value, index) {
        var tabElem = '<tr>' +
            '<td id="evento'+index+'">'+ value.Evento+'</td>' +
            '<td id="dataEv'+index+'">'+ value.Data+'</td>' +
            '<td id="sched'+index+'">'+ value.Ora+'</td>' +
            '<td>'+ value.Nome +'</td>' +
            '<td>'+ value.Cognome +'</td>' +
            '<td id="mail'+index+'">'+ value.Email +'</td>' +
            '<td>'+ value.Telefono +'</td>' +
            '<td>'+ value.NomeAcc +'</td>' +
            '<td>'+ value.CognomeAcc +'</td>' +
            '<td>'+ value.EmailAcc +'</td>' +
            '<td>'+ value.TelefonoAcc +'</td>' +
            '<td><button id='+index+' class="btn fas fa-times-circle" onclick="delBook(this.id)"></button></td>' +
            '</tr>';
        $('.datiPrenotazioni').append(tabElem);

});
/** **/
}


function delBook(id) {
    $("#modaldel").trigger('click');
    $("#safedel-btn").on('click', function () {
        var email = document.getElementById("mail"+id).innerHTML;
        var evento = document.getElementById("evento"+id).innerHTML;
//     // var data = document.getElementById("dataEv"+id).innerHTML;  Data:data,
        var ora = document.getElementById("sched"+id).innerHTML;
        $.post('/cancPren', {Email:email, Evento:evento, Ora:ora}, () =>{
            window.location.reload();
        });
    });

}

function savePDF() {
    var toPrint = document.getElementById('dataTable');
    var wme = window.open("", "", "width=900", "height=750");
    wme.document.write(toPrint.outerHTML);
    wme.document.close();
    wme.focus();
    wme.print();
    wme.close();
}

/** Nel caso non funzioni il delete-modal **/
// function delBook(id){
    // var email = document.getElementById("mail"+id).innerHTML;
    // var evento = document.getElementById("evento"+id).innerHTML;
    // // var data = document.getElementById("dataEv"+id).innerHTML;  Data:data,
    // var ora = document.getElementById("sched"+id).innerHTML;
    // $.post('/cancPren', {Email:email, Evento:evento, Ora:ora}, () =>{
    //     window.location.reload();
    // });
// }
