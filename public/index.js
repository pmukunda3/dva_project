

(function() {
    // let CANVAS_WIDTH = 1000
    // let CANVAS_HEIGHT = 600
    let CHART_WIDTH = 800
    let CHART_HEIGHT = 400
    let SLIDER_WIDTH = CHART_WIDTH
    let SLIDER_HEIGHT = 100
    let MARGIN = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    }


    let canvas = d3
    .select('#canvas')
    .append('svg')
    .attr('height', CHART_HEIGHT + SLIDER_HEIGHT + MARGIN.top + MARGIN.bottom)
    .attr('width', CHART_WIDTH + MARGIN.left + MARGIN.bottom)
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')');
    
      
    let chart = canvas
    .append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
    .attr('height', CHART_HEIGHT)
    .attr('width', CHART_WIDTH);

    let slider = canvas
        .append('g')
        .attr("class", "slider")
        .attr('transform', 'translate(' + MARGIN.left + ',' + CHART_HEIGHT+ ')')
        .attr('height', SLIDER_HEIGHT)
        .attr('width', SLIDER_WIDTH);

    // -------- slider code -------------

    let formatDateIntoYear = d3.time.format("%Y");
    let formatDate = d3.time.format("%b %Y");
    // let parseDate = d3.timeParse("%m/%d/%y");

    let startDate = new Date("2004-11-01")      
    let endDate = new Date("2017-04-01");

    let moving = false;
    let currentValue = 0;
    let targetValue = SLIDER_WIDTH;

    let playButton = d3.select("#play-button");

    // TODO: -- GET DATES FROM THE INPUT BOX AND PUT IT HERE ---
    // SCALES
    // -- SLIDER SCALE
    let slider_x = d3.time.scale()
        .domain([startDate, endDate])
        .range([0, targetValue])
        .clamp(true);

    slider.append("line")
        .attr("class", "track")
        .attr("x1", slider_x.range()[0])
        .attr("x2", slider_x.range()[1])
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () { slider.interrupt(); })
            .on("start drag", function () {
                currentValue = d3.event.x;
                update(x.invert(currentValue));
            })
        );

})();


