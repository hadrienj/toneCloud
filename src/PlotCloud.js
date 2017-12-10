import * as d3 from "d3";
import Player from './Player';

class PlotCloud {
  constructor() {
    // set the dimensions and margins of the graph
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.svg = this.setSVG();
    this.player = new Player();
  }
  init(docs) {
    console.log(docs);
    this.docs = docs;
    var data = this.docs.toneCloudParam;
    this.drawCloud(data);
  }
  setSVG() {
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Create the axes and their ranges
    this.xScale = d3.scaleLinear()
      .range([0, this.width]);
    this.yScale = d3.scaleLinear()
      .range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    // remove the last tick on axes
    this.xAxis.tickSizeOuter([0]);
    this.yAxis.tickSizeOuter([0]);

    this.yAxis.ticks(5);
    this.xAxis.ticks(6);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("class", "xaxis")
      .call(this.xAxis);
    // Add the Y Axis
    svg.append("g")
      .attr("class", "yaxis")
      .call(this.yAxis);

    return svg;
  }
  drawCloud(data) {
    // clean the plot
    d3.selectAll("circle").remove();

    // select 3 seconds to plot
    const dataSub = data.filter(x=>x.time<3);

    // Scale the range of the data
    this.xScale.domain(d3.extent(dataSub, function(d) { return d.time; }));
    this.yScale.domain([0, d3.max(dataSub, function(d) { return d.freq; })]);

    // Add the scatterplot
    this.svg.selectAll("dot")
        .data(dataSub)
      .enter().append("circle")
        .attr("r", 3)
        .attr("cx", (d) => { return this.xScale(d.time); })
        .attr("cy", (d) => { return this.yScale(d.freq); })
        .style("fill", "#4480bc");

    // Update the Axis
    this.xAxis.scale(this.xScale);
    this.yAxis.scale(this.yScale);
    this.svg.select(".xaxis")
      .call(this.xAxis)
    this.svg.select(".yaxis")
      .call(this.yAxis);

    // we want to keep the context of the click event to get position
    var that = this;
    // Play sound from the x click position
    d3.select("svg").on("click", function(d, i) {
      that.player.play({
        xScale: that.xScale,
        xPos: d3.mouse(this)[0]-that.margin.left,
        height: that.height,
        dataSub,
        svg: that.svg,
      });
    });
  }
}
export default PlotCloud;