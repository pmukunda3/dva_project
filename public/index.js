

// let CANVAS_WIDTH = 1000
// let CANVAS_HEIGHT = 600
let TIMER = undefined
let CURRENT_VALUE = 0
let CHART_WIDTH = 900
let CHART_HEIGHT = 500
let SLIDER_WIDTH = CHART_WIDTH
let SLIDER_HEIGHT = 80
let BUBBLE_DATA = 'CONTAIN ALL DATA'
var YEAR, MONTH;

$.ajaxSetup({
    async: false
});

let MARGIN = {
    left: 50,
    right: 50,
    top: 20,
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
    .attr('transform', 'translate(' + MARGIN.left + ',' + (MARGIN.top - 5) + ')')
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




// ############################### SLIDER CODE ################################
let MOVING = false;
let CURRENT_SLIDER_VALUE = 0
let SLIDER_STEPS = (ENDDATE.getFullYear() - STARTDATE.getFullYear()) * 10

console.log("SLIDER_STEPS", ENDDATE.getFullYear(), STARTDATE.getFullYear())

let playButton = d3.select("#play-button");

// TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---


console.log("SLIDER SCALE", STARTDATE)
console.log("SLIDER SCALE", ENDDATE)
let SLIDER_SCALE = d3.time.scale()
    .domain([STARTDATE, ENDDATE])
    .range([0, SLIDER_WIDTH])
    .clamp(true);
console.log("SLIDER SCALE", SLIDER_SCALE(STARTDATE))

let SLIDER_AXIS = d3.svg.axis()
    .scale(SLIDER_SCALE)
    .orient("bottom")
    .ticks(5)
    .tickFormat(FORMATDATE)
let COLOR_SCALE = d3.scale.category10().domain([0, 1, 2, 3, 4, 5, 6,7, 8,9])
let SIZE_SCALE = d3.scale.linear().domain([0, 9]).range([10, 70])
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
    .style("font-weight", "bold")
    .text(FORMATDATE(STARTDATE))
    .attr("font-size", "16px")
    .attr("transform", "translate(0," + (60) + ")")


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



d3.csv("", prepare, function (data) {
    dataset = data;
    // drawPlot(dataset);
    console.log("prepare() in d3.csv", data)

    playButton
        .on("click", function () {
            let button = d3.select(this);
            if (button.text() == "Pause") {
                MOVING = false;
                clearInterval(TIMER);
                // TIMER = 0;
                button.text("Play");
            } else {
                MOVING = true;
                TIMER = setInterval(step, 2300);
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
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)

    let bubbles = bubble_group
        .append("circle")
        .attr("class", "bubble")

    bubbles
        .attr("r", 10)
        .style("fill", function(d, i) {
            return COLOR_SCALE(i)
        })
        .attr("cx", function (d) { 
            return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .transition()
        .duration(800)
        .style("opacity", 0.8)
        .attr("r", function (d, i) {
            return 50
        })

    let text = bubble_group
        .append("text")
        .attr("class", "bubble-text")
        .attr("x", function (d) { return d.cx; })
        .attr("y", function (d, i) { return d.cy + 65; })
        .attr("font-size", "6px")
        // .attr("y", function (d, i) { return d.cy + SIZE_SCALE(i) + 10; })
        
        .transition()
        .duration(800)
        .text(function (d) { return d.topic; })
        .attr("font-size", "12.4px")


    bubble_group
        .append("text")
        .attr("class", "bubble-inner-text")
        .attr("x", function (d) { return d.cx; })
        .attr("y", function (d) { return d.cy })
        .text(function (d, i) { return i + 1; })
        .attr("dy", ".35em")
        .style("fill", "white")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .transition()
        .duration(800)
        .attr("font-size", function(d, i) {return 17})


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

function handleMouseOver(d, i) {
    if(MOVING == false){
        group = d3.select(this)
        group.style('cursor', 'pointer')
        circle = group.select('circle')
        BUBBLE_RADIUS = circle.attr('r')
        circle.attr('r', BUBBLE_RADIUS * 1.1)
            .style("opacity", .9)
        group.select('text')
            .style('font-size', '14.88px')
    }
}

function handleMouseOut(d, i) {
    if(MOVING == false){
        group = d3.select(this)
        group.style('cursor', 'none')
        group.select('circle')
            .attr('r', BUBBLE_RADIUS)
            .style("opacity", 1.0)
        group.select('text')
            .style('font-size', '12.4px')
    }

}

function handleClick(d, i) {
    if(MOVING == false){
        d3.select(this).classed('group-clicked', true)
        $('#newsModal').modal('show')
    }
}

// load data on displaying modal
$('#newsModal').on('show.bs.modal', function() {
    let data = d3.select(".group-clicked").data().pop();
    let topic = data['topic'];
    if (topic != null) {
        topic = topic.toLowerCase().replace(/ /g, '~');
    }
    topics = showRelatedNews(topic);
})

// reset bubble classes on closing modal
$('#newsModal').on('hidden.bs.modal', function() {
    d3.select('.group-clicked').classed('group-clicked', false)
    d3.select('#articles').html('');
})

function showRelatedNews(topic) {
    // let date_value = SLIDER_SCALE.invert(CURRENT_SLIDER_VALUE)
    // console.log(date_value);
    // YEAR = get_year(date_value);
    // MONTH = get_month(date_value);

    console.log('Topic:', topic);
    let articles;
    let url = 'http://localhost:3000/articles/' + topic + '/' + YEAR;
    if(MONTH != null){
        url = url + '/' + MONTH;
    }
    console.log('Article URL:', url);
    $.getJSON(url, function (data) {
        articles = data;
    })
    console.log('Articles', articles);

    rowData = d3.select('#articles')
        .selectAll('tr')
        .data(articles)
        .enter()
        .append('tr')
        .append('td');

    rowData.append('a')
        .attr('href', function (d) {
            return d['web_url']
        })
        .attr('target', '_blank')
        .append('p')
        .style('font-weight', 'bold')
        .style('color', 'black')
        .html(function (d) {
            let headlines = d['headlines']
            return headlines.substring(1, headlines.length - 1)
        });
    rowData.append('img')
        .attr('class', 'rounded d-block')
        .attr('src', function (d) {
            return d['image_url']
        });
    rowData.append('p');
    rowData.append('p')
        .html(function (d) {
            let snippet = d['snippet']
            return snippet.substring(1, snippet.length - 1)
        });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function step() {
    CURRENT_SLIDER_VALUE = CURRENT_SLIDER_VALUE + (SLIDER_WIDTH / SLIDER_STEPS);
    console.log("CURRENT_SLIDER_VALUE", CURRENT_SLIDER_VALUE, SLIDER_STEPS);
    console.log("step() CURRENT_SLIDER_VALUE", CURRENT_SLIDER_VALUE)
    await sleep(2000);
    update();
    if (CURRENT_SLIDER_VALUE > SLIDER_WIDTH) {
        resetSlider()
    }

}

function calculate_steps() {

}


function prepare(d) {
    d.id = d.id;
    console.log('prepare() in function prepare', d.date);
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

function get_year(date){
    if(date == null){
        return date;
    }
    let year = 1900 + date.getYear();
    console.log('Year:', year);
    return year;
}

function get_month(date){
    if(date == null){
        return date;
    }
    console.log('Month:', date.getMonth());
    return date.getMonth() + 1;
}

function update() {
    let date_value = SLIDER_SCALE.invert(CURRENT_SLIDER_VALUE)
    let numeric_value = SLIDER_SCALE(date_value)
    HANDLE.attr("cx", numeric_value);

    console.log("format inside update()", date_value, "FORMATDATE", FORMATDATE(date_value))
    SLIDER_LABEL
        .attr("x", numeric_value)
        .text(FORMATDATE(date_value));
    // let data = getRandomBubble(BUBBLE_DATA, 10)

    console.log(date_value);
    YEAR = get_year(date_value);
    MONTH = get_month(date_value);
    let data = add_new_data(YEAR, MONTH);
    drawBubbles(data)

}

function add_new_data(year, month) {
    let url = 'http://localhost:3000/topics/' + year;
    if(month != null){
        url = url + '/' + month;
    }
    console.log('Topic URL:', url);
    let current_data = null;
    $.getJSON(url, function (data) {
        current_data = data;
    })
    console.log(current_data);
    if(current_data == null){
        return [];
    }

    let left_padding_three = 175;
    let left_padding_four = 115;
    let space_three = 0;

    // initally: 100, 250, 400; 100 - 20, 250, 400 + 10, 550 + 20
    let center = [
        { cx: left_padding_three + 100 - 60, cy: 100 - 10, "topic": ""},
        { cx: left_padding_three + 250 + 10 + space_three, cy: 100 - 10 ,"topic": ""},
        { cx: left_padding_three + 400 + 80 + space_three, cy: 100 - 10, "topic": "" },
        { cx: left_padding_four + 100 - 20 - 50, cy: 250, "topic": "" },
        { cx: left_padding_four + 250 - 25, cy: 250, "topic": "" },
        { cx: left_padding_four + 400 + 10 + 20, cy: 250, "topic": "" },
        { cx: left_padding_four + 550 + 20 + 50, cy: 250, "topic": "" },
        { cx: left_padding_three + 100 - 60, cy: 400 + 10, "topic": "" },
        { cx: left_padding_three + 250 + 10 + space_three, cy: 400 + 10, "topic": "" },
        { cx: left_padding_three + 400 + 80 + space_three, cy: 400 + 10, "topic": "" },
    ]
    for (i = 0; i < center.length; i++) {
        center[i]['topic'] = current_data[i]['keyword'];
        if(current_data != null & current_data.length<i+1 & current_data[i] != null) {

        }
    }

    return center
}
// function circleCenterList() {
//     let list = []
//     for (let x_axis = 100; x_axis <= CHART_WIDTH; x_axis = x_axis + 150) {
//         for (let y_axis = 100; y_axis <= CHART_HEIGHT; y_axis = y_axis + 150) {
//             list.push({ "cx": x_axis, "cy": y_axis, "topic": "TOPIC No:"+ x_axis + "_" + y_axis})
//         }
//     }
//     let left_padding_three = 130
//     let left_padding_four = 70

//     let space_three = 0
//     let space_four = 0
//     return
// }

// { cx: 550, cy: 400, topic: "TOPIC No:550_400" },
// { cx: 700, cy: 100, topic: "TOPIC No:700_100" },
// 13: { cx: 700, cy: 250, topic: "TOPIC No:700_250" },
// 14: { cx: 700, cy: 400, topic: "TOPIC No:700_400" }
function getRandomBubble(data, size) {
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


function updateSliderAxis() {
    SLIDER_SCALE.domain([STARTDATE, ENDDATE])
    console.log("updateSliderAxis", STARTDATE, ENDDATE)
    
    SLIDER.select(".slider-axis")
        .transition()
        .duration(500)
        .call(SLIDER_AXIS)

    HANDLE.attr("cx", SLIDER_SCALE(STARTDATE));
    SLIDER_LABEL
        .attr("x", SLIDER_SCALE(STARTDATE))
        .text(FORMATDATE(STARTDATE));
    resetSlider()

    console.log("updateSliderAxis", SLIDER_SCALE(STARTDATE), FORMATDATE(STARTDATE))
}

function resetSlider() {
    MOVING = false;
    CURRENT_SLIDER_VALUE = 0;
    clearInterval(TIMER);
    // TIMER = 0;
    playButton.text("Play");
 
}