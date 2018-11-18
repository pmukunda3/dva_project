


// let CANVAS_WIDTH = 1000
// let CANVAS_HEIGHT = 600

let CURRENT_VALUE = 0
let CHART_WIDTH = 800
let CHART_HEIGHT = 500
let SLIDER_WIDTH = CHART_WIDTH
let SLIDER_HEIGHT = 80
let MARGIN = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 10
}


let canvas = d3
.select('#canvas')
.append('svg')
.attr('height', CHART_HEIGHT + SLIDER_HEIGHT + MARGIN.top + MARGIN.bottom)
.attr('width', CHART_WIDTH + MARGIN.left + MARGIN.right)
.attr('transform', 'translate(' + 0 + ',' + 0 + ')');


let chart = canvas
.append('g')
.attr('class', 'chart')
    .attr('transform', 'translate(' + 0 + ',' + MARGIN.top  + ')')
.attr('height', CHART_HEIGHT)
.attr('width', CHART_WIDTH);

let slider = canvas
    .append('g')
    .attr("class", "slider")
    .attr('transform', 'translate(' + MARGIN.left + ',' +(MARGIN.top  + CHART_HEIGHT)  + ')')
    .attr('height', SLIDER_HEIGHT)
    .attr('width', SLIDER_WIDTH);

// -------- slider code -------------

let formatDateIntoYear = d3.time.format("%Y");
let formatDate = d3.time.format("%b %Y");
let parseDate = d3.time.format("%m/%d/%y").parse;

let startDate = new Date("2005-11-01")      
let endDate = new Date("2017-04-01");

let moving = false;
let CURRENT_SLIDER_VALUE = 0
let SLIDER_STEPS = (endDate.getFullYear() - startDate.getFullYear() + 5) * 15
console.log(SLIDER_STEPS)

let targetValue = SLIDER_WIDTH;

let playButton = d3.select("#play-button");

// TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---
// SCALES
// -- SLIDER SCALE
let slider_scale = d3.time.scale()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);



slider.append("line")
    .attr("class", "track")
    .attr("x1", slider_scale.range()[0])
    .attr("x2", slider_scale.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragging)
        .on("dragend", dragended)

        // .on("start.interrupt", function () { slider.interrupt(); })
        // .on("start drag", function () {
        //     CURRENT_SLIDER_VALUE = d3.event.x;
        //     update(x.invert(CURRENT_SLIDER_VALUE));
        // })
    );



let slider_axis = d3.svg.axis()
    .scale(slider_scale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(formatDate)
    

slider.append("g")
    .attr("class", "slider-axis")   
    .attr("transform", "translate(0," + 12 + ")")
    .call(slider_axis)
    .selectAll("text")


// slider.insert("g", ".track-overlay")
//     .attr("class", "ticks")
//     .attr("transform", "translate(0," + 18 + ")")
//     .selectAll("text")
//     .data(slider_scale.ticks(10))
//     .enter()
//     .append("text")
//     .attr("x", slider_scale)
//     .attr("y", 10)
//     .attr("text-anchor", "middle")
//     .text(function (d) { console.log(d)
//         return formatDate(d); });

let handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

let slider_label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (55) + ")")



d3.csv("./circles.csv", prepare, function (data) {
    dataset = data;
    // drawPlot(dataset);

    playButton
        .on("click", function () {
            let button = d3.select(this);
            if (button.text() == "Pause") {
                moving = false;
                clearInterval(timer);
                // timer = 0;
                button.text("Play");
            } else {
                moving = true;
                timer = setInterval(step, 150);
                button.text("Pause");
            }
            console.log("Slider moving: " + moving);
        })
})

function step() {
    update();
    CURRENT_SLIDER_VALUE = CURRENT_SLIDER_VALUE + (targetValue / 300);
    if (CURRENT_SLIDER_VALUE > targetValue) {
        moving = false;
        CURRENT_SLIDER_VALUE = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
        console.log("Slider moving: " + moving);
    }
}


function prepare(d) {
    d.id = d.id;
    d.date = parseDate(d.date);
    return d;
}



function dragging() {
    CURRENT_SLIDER_VALUE =  d3.event.x
    update()
    console.log('dragging')
}


function dragstarted() {

    console.log('dragstarted')
}

function dragended() {
    console.log("drag ended")
}

function update() {
    let date_value = slider_scale.invert(CURRENT_SLIDER_VALUE)
    let numeric_value = slider_scale(date_value)
    handle.attr("cx", numeric_value);

    slider_label
        .attr("x", numeric_value)
        .text(formatDate(date_value));
}