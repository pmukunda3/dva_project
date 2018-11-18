

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
    .attr('transform', 'translate(' + 0 + ',' + MARGIN.top + ')')
    .attr('height', CHART_HEIGHT)
    .attr('width', CHART_WIDTH);

let slider = canvas
    .append('g')
    .attr("class", "slider")
    .attr('transform', 'translate(' + MARGIN.left + ',' + (MARGIN.top + CHART_HEIGHT) + ')')
    .attr('height', SLIDER_HEIGHT)
    .attr('width', SLIDER_WIDTH);

// -------- slider code -------------

let formatDateIntoYear = d3.time.format("%Y");
let formatDate = d3.time.format("%b %Y");
let parseDate = d3.time.format("%m/%d/%y").parse;

let startDate = new Date("2005-11-01")
let endDate = new Date("2017-04-01");


// ############################### SLIDER CODE ################################
let moving = false;
let CURRENT_SLIDER_VALUE = 0
let SLIDER_STEPS = (endDate.getFullYear() - startDate.getFullYear() + 5) * 15


let playButton = d3.select("#play-button");

// TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---


let slider_scale = d3.time.scale()
    .domain([startDate, endDate])
    .range([0, SLIDER_WIDTH])
    .clamp(true);

let slider_axis = d3.svg.axis()
    .scale(slider_scale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(formatDate)

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

    );

slider.append("g")
    .attr("class", "slider-axis")
    .attr("transform", "translate(0," + 12 + ")")
    .call(slider_axis)
    .selectAll("text")

let handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

let slider_label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (55) + ")")


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


// ###################### CIRCLES #######################
let circles = chart.selectAll("circle")
            .data(circleCenterList())
            .enter()
            .append("circle");

circles
    .attr("cx", function (d) { return d.cx; })
    .attr("cy", function (d) { return d.cy; })
    .attr("r", 60)
    .style("fill", 'blue');

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
    CURRENT_SLIDER_VALUE = CURRENT_SLIDER_VALUE + (SLIDER_WIDTH / 300);
    if (CURRENT_SLIDER_VALUE > SLIDER_WIDTH) {
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
    CURRENT_SLIDER_VALUE = d3.event.x
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

function circleCenterList() {
    let list = []
    for (let x_axis = 150; x_axis <= CHART_WIDTH; x_axis = x_axis + 150) {
        console.log(x_axis)
        for (let y_axis = 100; y_axis <= CHART_HEIGHT; y_axis = y_axis + 150) {
            list.push({ "cx": x_axis, "cy": y_axis})
        }
    }
    return list
}
