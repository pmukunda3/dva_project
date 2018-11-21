
let STARTDATE = new Date("2017-04-01")
let ENDDATE = new Date("2019-04-01");
$(function () {
    
    $("#date-from").datepicker({
        dateformat: 'yy-mm-dd',
        onSelect: function () {
            STARTDATE = new Date(this.value)
            console.log(STARTDATE);
        }
    }).datepicker("setDate", STARTDATE);
    $("#date-to").datepicker({
        onSelect: function () {
            ENDDATE = new Date(this.value)
            console.log(ENDDATE);
        }
    }).datepicker("setDate", ENDDATE);
  
});
