

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


let CANVAS = d3
    .select('#canvas')
    .append('svg')
    .attr('height', CHART_HEIGHT + SLIDER_HEIGHT + MARGIN.top + MARGIN.bottom)
    .attr('width', CHART_WIDTH + MARGIN.left + MARGIN.right)
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');


setshadow()

let CHART = CANVAS
    .append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')')
    .attr('height', CHART_HEIGHT)
    .attr('width', CHART_WIDTH)
    
let SLIDER = CANVAS
    .append('g')
    .attr("class", "slider")
    .attr('transform', 'translate(' + MARGIN.left + ',' + (MARGIN.top + CHART_HEIGHT) + ')')
    .attr('height', SLIDER_HEIGHT)
    .attr('width', SLIDER_WIDTH);

let BORDER = CANVAS
    .append("rect")
    .attr('transform', 'translate(' + MARGIN.left + ',' + (MARGIN.top ) + ')')
    .attr("height", (CHART_HEIGHT - 15))
    .attr("width", CHART_WIDTH)
    .style("stroke", 'grey')
    .style("fill", "none")
    .attr("rx", 4)
    .attr("ry", 4)
    .style("stroke-width", '2')
    .style("filter", "url(#drop-shadow)")
   



// -------- SLIDER code -------------

// let FORMATDATEIntoYear = d3.time.format("%Y");
let FORMATDATE = d3.time.format("%b %Y");
let PARSEDATE = d3.time.format("%m/%d/%y").parse;

let STARTDATE = new Date("2015-11-01")
let ENDDATE = new Date("2017-04-01");


// ############################### SLIDER CODE ################################
let MOVING = false;
let CURRENT_SLIDER_VALUE = 0
let SLIDER_STEPS = (ENDDATE.getFullYear() - STARTDATE.getFullYear() + 5) * 15


let playButton = d3.select("#play-button");

// TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---


let SLIDER_SCALE = d3.time.scale()
    .domain([STARTDATE, ENDDATE])
    .range([0, SLIDER_WIDTH])
    .clamp(true);

let SLIDER_AXIS = d3.svg.axis()
    .scale(SLIDER_SCALE)
    .orient("bottom")
    .ticks(5)
    .tickFormat(FORMATDATE)

SLIDER.append("line")
    .attr("class", "track")
    .attr("x1", SLIDER_SCALE.range()[0])
    .attr("x2", SLIDER_SCALE.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragging)
        .on("dragend", dragended)

    );

SLIDER.append("g")
    .attr("class", "slider-axis")
    .attr("transform", "translate(0," + 12 + ")")
    .call(SLIDER_AXIS)
    .selectAll("text")

let HANDLE = SLIDER.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);

let SLIDER_LABEL = SLIDER.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(FORMATDATE(STARTDATE))
    .attr("transform", "translate(0," + (55) + ")")


// SLIDER.insert("g", ".track-overlay")
//     .attr("class", "ticks")
//     .attr("transform", "translate(0," + 18 + ")")
//     .selectAll("text")
//     .data(SLIDER_SCALE.ticks(10))
//     .enter()
//     .append("text")
//     .attr("x", SLIDER_SCALE)
//     .attr("y", 10)
//     .attr("text-anchor", "middle")
//     .text(function (d) { console.log(d)
//         return FORMATDATE(d); });


// ###################### CIRCLES #######################
let BUBBLE_DATA = circleCenterList()


d3.csv("./circles.csv", prepare, function (data) {
    dataset = data;
    // drawPlot(dataset);

    playButton
        .on("click", function () {
            let button = d3.select(this);
            if (button.text() == "Pause") {
                MOVING = false;
                clearInterval(timer);
                // timer = 0;
                button.text("Play");
            } else {
                MOVING = true;
                timer = setInterval(step, 2000);
                button.text("Pause");
            }
            console.log("Slider MOVING: " + MOVING);
        })
})


function drawBubbles(data) {
    CHART.selectAll(".bubble-group").remove();
    let bubble_group = CHART.selectAll(".bubble-group")
        .data(data)

    bubble_group.enter()
        .append("g")
        .attr("class", "bubble-group")

    let text = bubble_group
        .append("text")
        .attr("class", "bubble-text")
        .attr("x", function (d) { return d.cx; })
        .attr("y", function (d) { return d.cy; })
        .text(function(d) { return d.topic; })
        .attr("font-size", "1px")
        .transition()
        .duration(1000)
        .attr("font-size", "12px")

    let bubbles = bubble_group
        .append("circle")
        .attr("class", "bubble")

    bubbles
        .attr("r", 0)
        .attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .transition()
        .duration(1000)
        .style("fill", 'blue')
        .style("opacity", 0.7)
        .attr("r", 40)
    

//     bubbles.enter()
//     .append("circle")
//     .attr("class", "bubble")
//     .attr("cx", function (d) { return d.cx; })
//     .attr("cy", function (d) { return d.cy; })
//     .style("fill", 'blue')
//     .attr("r", 60)
//         .transition()
//         .duration(400)
//         .attr("r", 80)
//         .transition()
//         .attr("r", 60);

//   bubbles.exit().remove()

        // .transition()
        // .duration(500)
}

function step() {
    update();
    CURRENT_SLIDER_VALUE = CURRENT_SLIDER_VALUE + (SLIDER_WIDTH / 10);
    if (CURRENT_SLIDER_VALUE > SLIDER_WIDTH) {
        MOVING = false;
        CURRENT_SLIDER_VALUE = 0;
        clearInterval(timer);
        // timer = 0;
        playButton.text("Play");
    }
}


function prepare(d) {
    d.id = d.id;
    d.date = PARSEDATE(d.date);
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
    let date_value = SLIDER_SCALE.invert(CURRENT_SLIDER_VALUE)
    let numeric_value = SLIDER_SCALE(date_value)
    HANDLE.attr("cx", numeric_value);

    SLIDER_LABEL
        .attr("x", numeric_value)
        .text(FORMATDATE(date_value));
    let data = getRandomBubble(BUBBLE_DATA, 10)
    drawBubbles(data)

}

function circleCenterList() {
    let list = []
    for (let x_axis = 100; x_axis <= CHART_WIDTH; x_axis = x_axis + 150) {
        for (let y_axis = 100; y_axis <= CHART_HEIGHT; y_axis = y_axis + 150) {
            list.push({ "cx": x_axis, "cy": y_axis, "topic": "TOPIC No:"+ x_axis + "_" + y_axis})
        }
    }
    return list
}

function getRandomBubble(data, size) {
    console.log(_.shuffle(data).slice(0, size))
    return _.shuffle(data).slice(0, size)
}

function setshadow() {
    var defs = CANVAS.append("defs");
    // create filter with id #drop-shadow
    // height=130% so that the shadow is not clipped
    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "120%");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2)
        .attr("result", "blur");

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    // filter.append("feOffset")
    //     // .attr("in", "blur")
    //     .attr("dx", 5)
    //     .attr("dy", 5)
    //     .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
}