
// let STARTDATE = new Date("1996-04-01")
// let ENDDATE = new Date("1997-04-01");
let STARTDATE = new Date("2016-04-01")
let ENDDATE = new Date("2017-04-01");
let YEARRANGE = '1916:2018'

$("#date-from").datepicker("setDate", STARTDATE);
$("#date-to").datepicker("setDate", ENDDATE);

$(function () {
    
    $("#date-from").datepicker({
        // minDate: new Date("1996-01-02"),
        // maxDate: new Date("2007-01-01"),
        yearRange: YEARRANGE,
        changeYear: true,
        changeMonth: true,
        dateFormat: 'MM yy',
        onSelect: function () {
            STARTDATE = new Date(this.value)
            console.log("updated",STARTDATE)
            
        }
    }).datepicker("setDate", STARTDATE);
    $("#date-to").datepicker({
        // minDate: new Date("1996-01-02"),
        // maxDate: new Date("2007-01-01"),
        yearRange: YEARRANGE,
        changeYear: true,
        changeMonth: true,
        dateFormat: 'MM yy',
        onSelect: function () {
            ENDDATE = new Date(this.value)
        }
    }).datepicker("setDate", ENDDATE);
    
    $("#update-button").click(function() {
    
        if (new Date(STARTDATE) < new Date(ENDDATE)) {
           $.ajax({
               url: "http://localhost:3000/health"
            }).then(function (data) {
                updateSliderAxis()
                BUBBLE_DATA = data
               update()
            })
        } else {
            alert(' Start date must come before end date!')
        }
    })
});
