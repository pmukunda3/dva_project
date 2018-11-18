
let FORMATDATEIntoYear = d3.timeFormat("%Y");
let FORMATDATE = d3.timeFormat("%b %Y");
let PARSEDATE = d3.timeParse("%m/%d/%y");

let startDate = new Date("2004-11-01"),
    endDate = new Date("2017-04-01");

let margin = {top:50, right:50, bottom:0, left:50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);  

////////// SLIDER //////////

let MOVING = false;
let currentValue = 0;
let targetValue = width;

let playButton = d3.select("#play-button");
    
let x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

let SLIDER = svg.append("g")
    .attr("class", "SLIDER")
    .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

SLIDER.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { SLIDER.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          update(x.invert(currentValue)); 
        })
    );

SLIDER.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x.ticks(10))
    .enter()
    .append("text")
    .attr("x", x)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return FORMATDATEIntoYear(d); });

let HANDLE = SLIDER.insert("circle", ".track-overlay")
    .attr("class", "HANDLE")
    .attr("r", 9);

let label = SLIDER.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(FORMATDATE(startDate))
    .attr("transform", "translate(0," + (-25) + ")")

 
////////// plot //////////

let dataset;

let plot = svg.append("g")
    .attr("class", "plot")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("circles.csv", prepare, function(data) {
  dataset = data;
  drawPlot(dataset);
  
  playButton
    .on("click", function() {
    let button = d3.select(this);
    if (button.text() == "Pause") {
      MOVING = false;
      clearInterval(timer);
      // timer = 0;
      button.text("Play");
    } else {
      MOVING = true;
      timer = setInterval(step, 100);
      button.text("Pause");
    }
    console.log("SLIDER MOVING: " + MOVING);
  })
})

function prepare(d) {
  d.id = d.id;
  d.date = PARSEDATE(d.date);
  return d;
}
  
function step() {
  update(x.invert(currentValue));
  currentValue = currentValue + (targetValue/151);
  if (currentValue > targetValue) {
    MOVING = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("SLIDER MOVING: " + MOVING);
  }
}

function drawPlot(data) {
  let locations = plot.selectAll(".location")
    .data(data);

  // if filtered dataset has more circles than already existing, transition new ones in
  locations.enter()
    .append("circle")
    .attr("class", "location")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", height/2)
    .style("fill", function(d) { return d3.hsl(d.date/1000000000, 0.8, 0.8)})
    .style("stroke", function(d) { return d3.hsl(d.date/1000000000, 0.7, 0.7)})
    .style("opacity", 0.5)
    .attr("r", 8)
      .transition()
      .duration(400)
      .attr("r", 25)
        .transition()
        .attr("r", 8);

  // if filtered dataset has less circles than already existing, remove excess
  locations.exit()
    .remove();
}

function update(h) {
  // update position and text of label according to SLIDER scale
  HANDLE.attr("cx", x(h));
  label
    .attr("x", x(h))
    .text(FORMATDATE(h));

  // filter data set and redraw plot
  let newData = dataset.filter(function(d) {
    return d.date < h;
  })
  drawPlot(newData);
}

function getCircleCenters() {
  l
}











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


let CHART = CANVAS
  .append('g')
  .attr('class', 'chart')
  .attr('transform', 'translate(' + 0 + ',' + MARGIN.top + ')')
  .attr('height', CHART_HEIGHT)
  .attr('width', CHART_WIDTH);

let SLIDER = CANVAS
  .append('g')
  .attr("class", "slider")
  .attr('transform', 'translate(' + MARGIN.left + ',' + (MARGIN.top + CHART_HEIGHT) + ')')
  .attr('height', SLIDER_HEIGHT)
  .attr('width', SLIDER_WIDTH);

// -------- SLIDER code -------------

// let FORMATDATEIntoYear = d3.time.format("%Y");
let FORMATDATE = d3.time.format("%b %Y");
let PARSEDATE = d3.time.format("%m/%d/%y").parse;

let startDate = new Date("2005-11-01")
let endDate = new Date("2017-04-01");


// ############################### SLIDER CODE ################################
let MOVING = false;
let CURRENT_SLIDER_VALUE = 0
let SLIDER_STEPS = (endDate.getFullYear() - startDate.getFullYear() + 5) * 15


let playButton = d3.select("#play-button");

// TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---


let SLIDER_SCALE = d3.time.scale()
  .domain([startDate, endDate])
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
  .attr("class", "slider-label")
  .attr("text-anchor", "middle")
  .text(FORMATDATE(startDate))
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
// let circles = CHART.selectAll("circle")
//             .data(circleCenterList())
//             .enter()
//             .append("circle");

// circles
//     .attr("cx", function (d) { return d.cx; })
//     .attr("cy", function (d) { return d.cy; })
//     .attr("r", 30)
//     .style("fill", 'blue');

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
        timer = setInterval(step, 150);
        button.text("Pause");
      }
      console.log("SLIDER MOVING: " + MOVING);
    })
})



function step() {
  update();
  CURRENT_SLIDER_VALUE = CURRENT_SLIDER_VALUE + (SLIDER_WIDTH / 300);
  if (CURRENT_SLIDER_VALUE > SLIDER_WIDTH) {
    MOVING = false;
    CURRENT_SLIDER_VALUE = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("SLIDER MOVING: " + MOVING);
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

  SLIDER_label
    .attr("x", numeric_value)
    .text(FORMATDATE(date_value));
}

// function circleCenterList() {
//     let list = []
//     for (let x_axis = 50; x_axis < CHART_WIDTH; x_axis = x_axis + 100) {
//         // for (let i = 50; i < CHART_HEIGHT; i = i + 50) {
//         list.push({ "cx": x_axis, "cy": 0 })
//         // }
//     }
//     return list
// }
// console.log(circleCenterList())