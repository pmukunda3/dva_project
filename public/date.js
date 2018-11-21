
let STARTDATE = new Date("2017-04-01")
let ENDDATE = new Date("2019-04-01");
$(function () {
    
    $("#date-from").datepicker({
        onSelect: function () {
            STARTDATE = new Date(this.value)
            updateSliderAxis()
        }
    }).datepicker("setDate", STARTDATE);
    $("#date-to").datepicker({
        onSelect: function () {
            ENDDATE = new Date(this.value)
            console.log(ENDDATE);
            updateSliderAxis()
        }
    }).datepicker("setDate", ENDDATE);
  
});
