import PlayToneCloud from './PlayToneCloud';

class Player {
  constructor() {
    this.toneCloud = new PlayToneCloud();
    this.requestId = null;

    // use time from web audio API for more precision
    let audioCtx = window.AudioContext|| window.webkitAudioContext;
    this.context = new audioCtx();

    this.isPlaying = false;

    // variables used to play the tone cloud
    this.cursor = null;
    this.height = null;
    this.time = null;
    this.startTime = null;

    this.renderChart = this.renderChart.bind(this);
  }
  play({xScale, xPos, height, data, svg}) {
    if (!this.isPlaying) {
      this.isPlaying = !this.isPlaying;

      // remove old cursor line if it exists
      if (this.cursor !== null) {
        this.cursor.remove();
      }

      // time is set from the x position of the click
      let time = xScale.invert(xPos);

      // keep only tones we want to play
      let partToneCloud = data.filter(x => x.time>time);
      this.toneCloud.play({toneCloud:partToneCloud, time});

      this.cursor = svg.append("line")
        .attr("x1", xScale(time))
        .attr("y1", 0)
        .attr("x2", xScale(time))
        .attr("y2", height)
        .style("stroke-width", 3)
        .style("stroke", "grey")
        .style("fill", "none");

      var startTime = this.context.currentTime;

      this.height = height;
      this.xScale = xScale;
      this.time = time;
      this.startTime = startTime;

      // Run the loop
      this.renderChart();
    } else {
      this.isPlaying = !this.isPlaying;
      this.toneCloud.stop();
      cancelAnimationFrame(this.requestId);
    }
  }
  renderChart() {
    this.requestId = requestAnimationFrame(this.renderChart);

    let passedTime = this.context.currentTime - this.startTime;

    // Update d3 chart with new data.
    this.cursor
      .attr("x1", this.xScale(this.time+passedTime))
      .attr("y1", 0)
      .attr("x2", this.xScale(this.time+passedTime))
      .attr("y2", this.height);

    // stop the animation when there is no more tone to play
    if (this.time+passedTime > this.xScale.domain()[1]) {
      cancelAnimationFrame(this.requestId);
      this.isPlaying = !this.isPlaying;
    }
  }
}

export default Player;