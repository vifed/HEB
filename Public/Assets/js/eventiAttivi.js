var resEventi = [];
var resScheduling = [];
var ID;

// $(document).load(fillData());

$(document).ready(function(){
    fillData();

    $("#delbtn").click(function () {
        var title = getName();
        console.log("nome evento", title);
        delete_event(title);
    });

    // $("#modbtn").click(function () {
    //     alert("Modifica cliccato");
    // });
});


function fillData() {
    $.post('/eventiAttivi', (res) => {
        if(res){
            var result ={};
            result = JSON.parse(res);
            // console.log("\n\nResult:", result, "\n\n");
            resEventi = result.Eventi;
            resScheduling = result.Scheduling;
            renderCards(resEventi, resScheduling);
            // console.log("Eventi:", resEventi);
            // console.log("Scheduling:", resScheduling);
        }
    });
}

function renderCards(event, scheduling, ) {
    var x=0;
    var html = '';
    $.each(event, function(key, value) {
        // html += '<div class="col-md-auto mr-6 mb-12 mt-6"><div class="card"><div class="card-content white-text"><div class="card__date"><span class="card_date_Start"> ' + value.Data_Inizio + '</span></div><span id="title'+ x +'" class="card-title grey-text text-darken-4">' + value.Nome + '</span><div class="location"><i class="small material-icons">' + value.Luogo + '</i></div><div class="row"></div><div class="col-md-3"><div class="description"><p class="card-subtitle grey-text text-darken-2">' + value.Descrizione + '</p></div></div><div class="col-md-4"><img src='+ value.Foto +' class="responsive"></div></div></div><!--<div class="card-action"><a id="modbtn" href="#"><i class="material-icons">&nbsp;</i>Modifica</a>--><a id="'+ x +'" href="#" data-toggle="modal" data-target="#deleteModal" onclick="getId(this.id)" ><i class="material-icons">&nbsp;</i>Elimina</a></div></div><div class="dropdown-divider"></div>';
        html += '<div class="col-md-10 box-area-event"><div class="card"><div class="card-content"><div class="card__date"><span class="card_date_Start"> ' + value.Data_Inizio + '</span></div><span id="title'+ x +'" class="card-title grey-text text-darken-4">' + value.Nome + '</span>&nbsp;<div class="location"><i class="small material-icons">' + value.Luogo + '</i></div>&nbsp;<div class="row"><div class="col-md-7"><div class="row"><div class="description"><h6>Descrizione: <br></h6><p class="card-subtitle grey-text text-darken-2">' + value.Descrizione + '</p></div><div class="orari"><h5>Orari Visite: <br></h5><div class="col-md-12 schedulingOrari'+x+'"></div></div></div></div><div class="col-md-5"><img src='+ value.Foto +' class="responsive"></div></div></div><div class="button"><!--<div class="card-action"><a id="modbtn" href="#"><i class="material-icons">&nbsp;</i>Modifica</a>--><a id="'+ x +'" href="#" data-toggle="modal" data-target="#deleteModal" onclick="getId(this.id)" ><i class="btn btn-outline-danger eliminabtn">&nbsp;Elimina</i></a></div></div></div><div class="dropdown-divider"></div>';
        html += '</div>';
        x++;
    });
    $('#card-container').html(html);
    x=0;
    $.each(event, function (key, value) {
        Orari ='<ul>';
        var container = [];
        for( let i of scheduling){
            if(i.ID_Events === value.ID){
                    var time = i.Ora_Inizio;
                    time = time.substr(0, time.length-3);
                    container.push(' <li id="ora'+key+'">'+ time +'</li>');
                    console.log(container);
            }
        }
        container = container.reverse();
        for (let i =0; i<container.length; i++){
            Orari += container[i];
        }
        Orari += '</ul>';
        $(".schedulingOrari"+x).html(Orari);
        x++;
    })
}

function getId(name){
    console.log("ID:", name);
    ID = name;
}
function getName() {
    return JSON.stringify(document.getElementById("title"+ID).innerHTML);
}

function delete_event(nome) {
    console.log("Dentro delete");
    $.post('/delEvents', {Nome:nome}, (req, res) => {
        alert("Evento cancellato con successo!");
        $(location).attr("href", "/eventiAttivi.html");
    });

}
/*
var logScheduling =[{
    Descrizione: modified_val.Descrizione,
    Num_part: 35,
    Ora_Inizio: '8:30',
    Ora_Fine: '9:30',
}];

var modified_val =[{
    Nome: 'Evento Modificato',
    Descrizione: 'Questo è un evento modificato!!!',
    Foto: 'Immagini_Eventi/EventImage-123456.png',
    Luogo: 'Agira',
    Data_Inizio: '2018-08-23',
    Data_Fine: '2018-08-30'
}];

function modifyEvent(id, {modified_val}) {
    var nome = modified_val.Nome;
    var descr = modified_val.Descrizione;
    var pic = modified_val.Foto;
    var place = modified_val.Luogo;
    var se = modified_val.Data_Inizio;
    var ee = modified_val.Data_Fine;
    var logSchedul = JSON.stringify(modified_val.logScheduling);

    $.post('/modify', {Nome:nome, Descrizione:descr, Foto:pic, Luogo:place, Data_Inizio:se, Data_Fine:ee, logSchedul } );

*/
//
//
// //FILTER EVENTS:
// $("#country-select").on('change', function() {
//   var value = $(this).val();
//   console.log("Filter COUNTRY: "+value);
//   renderCards(applyFilters());
//   //renderCards(filterByAttr("country-code", value, data));
// });
//
// $(".event-type-filter").change(function() {
//   renderCards(applyFilters());
//   //renderCards(applyEventTypeFilter());
// });
//
// function applyCountryFilter(data){
//   var value = $("#country-select").val();
//   if (value == 'all'){
//     value = '';
//   }
//   return filterByAttr("country-code", value, data);
// }
// function applyEventTypeFilter(data){
//   var result = [];
//       $('input[name="event-type-filter"]:checked').each(function() {
//          console.log(this.value);
//          var filtered = filterByAttr("event_type", this.value, data);
//         result = mergeJSONObjectsRemovingDuplicates(result,filtered);
//       });
//   return result;
// }
//
// function applyFilters(){
//   var eventArray = [];
//
//   console.log("FILTERS:");
//   console.log($('#search').val());
//   console.log($("#country-select").val());
//   console.log($('input[name="event-type-filter"]:checked').serialize());
//
//   eventArray = applyEventTypeFilter(data);
//   eventArray = applyCountryFilter(eventArray);
//   eventArray = applyTitleFilter(eventArray);
//   return eventArray;
// }
//
//
//
//
// //HELPER
// function mergeJSONObjectsRemovingDuplicates(arr1, arr2){
//   $.merge(arr1, arr2);
//
//   var existingIDs = [];
//   arr1 = $.grep(arr1, function(v) {
//       if ($.inArray(v.id, existingIDs) !== -1) {
//           return false;
//       }
//       else {
//           existingIDs.push(v.id);
//           return true;
//       }
//   });
//   return arr1;
// }

// // //Searcher
// // $( "#search" ).keyup(function( event ) {
// //   var value = $(this).val();
// //   if ( event.which == 13 ) {
// //      event.preventDefault();
// //   }
// //   //console.log("Filter..."+value);
// //   //renderCards(filterByAttr("title",value, data));
// //   renderCards(applyFilters());
// // });
// //
// // function applyTitleFilter(data){
// //   var value = $('#search').val();
// //   return filterByAttr("title",value, data);
// // }
// //
// // function filterByAttr(attr, value, data) {
// //   //console.log(data);
// //   var value = value.toLowerCase();
// //   return $.grep(data, function(n, i) {
// //     return n[attr].toLowerCase().indexOf(value) != -1;
// //
// //   });
// // }


