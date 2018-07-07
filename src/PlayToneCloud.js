import {
 cosSquared } from './ramps';


class PlayToneCloud {
  constructor() {
    let audioCtx = window.AudioContext|| window.webkitAudioContext;
    this.context = new audioCtx();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.5;

    this.ascCos = cosSquared({
      direction: 'ascending',
      max: 0.5
    });
    this.descCos = cosSquared({
      direction: 'descending',
      max: 0.5
    });
  }
  play({toneCloud, time}) {
    this.masterGain.gain.value = 0.5;
    this.startOscillators(toneCloud);
  }
  startOscillators(obj) {
    this.sources = [];
    // time base is removed to start the tonecloud at 0
    const timeBase = Math.min.apply(null, obj.map(x => x.time));

    for (var i=0; i<obj.length; i++) {
      const timeScaled = obj[i].time-timeBase;

      let osc = this.context.createOscillator();
      osc.frequency.value = obj[i].freq;

      let gain = this.context.createGain();
      gain.gain.value = 0.5;

      this.sources[this.sources.length] = {osc:osc, gain:gain};

      osc.connect(gain);
      gain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.applyRamps(this.context, gain, obj[i].gain,
        (this.context.currentTime+timeScaled), obj[i].dur, 0.01, 0.01);

      osc.start(this.context.currentTime+timeScaled);
      osc.stop(this.context.currentTime+timeScaled + obj[i].dur);
    }
  }
  applyRamps(context, gainNode, gainMax, nextNoteTime, dur, ascRampDur, descRampDur) {
    gainNode.gain.setValueCurveAtTime(this.ascCos, nextNoteTime , ascRampDur);
    gainNode.gain.setValueCurveAtTime(this.descCos,
      nextNoteTime + dur - descRampDur, descRampDur);
  };
  stop() {
    this.masterGain.gain.value = 0;
    // disconnect oscillators to free up memory
    for (var i of this.sources) {
      i.osc.stop();
      i.osc.disconnect();
    }
  }
}

export default PlayToneCloud;