
// let STARTDATE = new Date("1996-04-01")
// let ENDDATE = new Date("1997-04-01");
let STARTDATE = new Date("2015-01-01")
let ENDDATE = new Date("2017-01-02");
$(function () {
    
    $("#date-from").datepicker({
        // minDate: new Date("1996-01-02"),
        // maxDate: new Date("2007-01-01"),
        minDate: new Date("2015-01-02"),
        maxDate: new Date("2017-01-01"),
        onSelect: function () {
            STARTDATE = new Date(this.value)
            
        }
    }).datepicker("setDate", STARTDATE);
    $("#date-to").datepicker({
        // minDate: new Date("1996-01-02"),
        // maxDate: new Date("2007-01-01"),
        minDate: new Date("2015-01-02"),
        maxDate: new Date("2017-01-01"),
        onSelect: function () {
            ENDDATE = new Date(this.value)
            console.log(ENDDATE);
        }
    }).datepicker("setDate", ENDDATE);
    
    $("#update-button").click(function() {
    
        if (new Date(STARTDATE) < new Date(ENDDATE)) {
           $.ajax({
               url: "http://localhost:3000/health"
            }).then(function (data) {
                updateSliderAxis()
                BUBBLE_DATA = data
            })
        } else {
            alert(' Start date must come before end date!')
        }
    })
});
