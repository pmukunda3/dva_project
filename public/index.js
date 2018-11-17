


// let CANVAS_WIDTH = 1000
// let CANVAS_HEIGHT = 600
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
// let parseDate = d3.timeParse("%m/%d/%y");

let startDate = new Date("2005-11-01")      
let endDate = new Date("2017-04-01");

let moving = false;
let currentValue = 0;
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
        //     currentValue = d3.event.x;
        //     update(x.invert(currentValue));
        // })
    );



// slider
//     .append('g', ".track-overlay")
//     .attr("class", "ticks")
//     .call(slider_axis)
//     .selectAll('text')
//       .attr("x", slider_scale)
//     .attr("y", 10)
//     .attr('dy', '.35em')
//     .style('text-anchor', 'end')
//     .attr('fill', 'royalblue');

let xAxis = d3.svg.axis()
    .scale(slider_scale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(formatDate)
    

slider.append("g")
    .attr("class", "slider-axis")   // give it a class so it can be used to select only xaxis labels  below
    .attr("transform", "translate(0," + 12 + ")")
    .call(xAxis)
    .selectAll("text")

// console.log(slider_scale.ticks())
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

// function dragmove(d) {
//     d3.select(this)
//         .attr("cx", d.x = d3.event.x))
// }




function dragging() {
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
    let date_value = slider_scale.invert(d3.event.x)
    let numeric_value = slider_scale(date_value)
    handle.attr("cx", numeric_value);

    slider_label
        .attr("x", numeric_value)
        .text(formatDate(date_value));
}