import React, { Component } from 'react';

import './App.css';

import PlotCloud from './PlotCloud';
import Data from './Data';

import PlayToneCloud from './PlayToneCloud';


class App extends Component {
  constructor(props) {
    super(props);

    this.data = new Data('ens1');

    this.state = {
      docID: 'infMask_1_0_',
      num: 0,
      score: 0,
      deviant: false
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.plot = new PlotCloud();
    this.toneCloud = new PlayToneCloud();
    this.init();
  }
  init() {
    console.log(this.state.num);
    this.data.get(this.state.docID+this.state.num).then((docs)=>{
      console.log('docs', docs);
      this.setState({
        score: docs.score,
        deviant: docs.goodAnswer
      });
      this.plot.init(docs);
      // this.toneCloud.play(docs);
    }).catch((err)=>{
      console.log(err);
    });
  }
  handleAdd(event) {
    this.setState((prevState) => ({
      num: prevState.num + 1
    }), () => this.init());
  }
  handleSubmit(event) {
    console.log('A name was submitted: ' + this.state.docID);
    // this.setState({docID: event.target.docID});
    // avoid refresh
    event.preventDefault();
  }
  handleRemove(event) {
    this.setState(prevState => ({
      num: prevState.num - 1
    }));
    console.log(this.state);
    this.init();
  }
  render() {
    return (
      <div>
      <MetaDataTrial
        id={this.state.docID+this.state.num}
        score={this.state.score}
        deviant={this.state.deviant} />
      <p>
        {'Change trial: '}
        <button onClick={this.handleAdd}>+</button>
        <button onClick={this.handleRemove}>-</button>
      </p>
      </div>
    );
  }
}





class MetaDataTrial extends React.Component {
  render() {
    return (
      <div>
        Trial id: {this.props.id}<br/>
        Score: {this.props.score}<br/>
        Deviant: {this.props.deviant}
      </div>
    );
  }
}



export default App;
