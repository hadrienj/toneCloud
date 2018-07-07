import React, {Component } from 'react';
import './App.css';
import PlotCloud from './PlotCloud';
import Data from './Data';
import PlayToneCloud from './PlayToneCloud';
import Header from './Header';
import { Button } from 'react-bootstrap';
import { Grid, Row, Col } from 'react-flexbox-grid';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docID: 'infMask_1_0_',
      num: 0,
      score: 0,
      deviant: false,
      DB: '',
      session: 0,
      password: ''
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handler = this.handler.bind(this);

    this.plot = new PlotCloud();
    this.toneCloud = new PlayToneCloud();
    this.init();
  }
  init() {
    this.data = new Data({dbName: 'toneclouddemo'});
    this.data.get(this.state.docID+this.state.num).then((docs)=>{

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
    if (this.state.num<14) {
      this.setState((prevState) => ({
        num: prevState.num + 1
      }), () => this.init());
    }
  }
  handleRemove(event) {
    if (this.state.num>0) {
      this.setState(prevState => ({
        num: prevState.num - 1
      }), () => this.init());
    }
  }
  handler({DB, session, password}) {
    this.setState({ DB, session, password }, () => this.init());
  }
  render() {
    return (
      <div>
        <Header />
        <Info />
        <Grid fluid>
          <Row center='xs'>
            <Col xs={2} md={4} lg={6}>
              <MetaDataTrial
                num={this.state.num} />
            </Col>
            <Col xs={2} md={4} lg={6}>
              <p>
                {'Try another tone cloud? '}
                <Button bsSize="large" onClick={this.handleRemove}>Previous</Button>
                <Button bsSize="large" onClick={this.handleAdd}>Next</Button>
              </p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}



class FormDB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      session: 0,
      DB: 'demo',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit({DB: this.state.DB, session: this.state.session,
      password: this.state.password});
  }

  handleChange(event) {
    const nameInput = event.target.name;
    this.setState({
        [nameInput]: event.target.value
    });
  }

  handleChangeSession(event) {
    this.setState({session: event.target.session});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            DB:
            <input type="text" name='DB' value={this.state.DB}
              onChange={this.handleChange} />
            Session:
            <input type="text" name='session' value={this.state.session}
              onChange={this.handleChange} />
            Password:
            <input type="text" name='password' value={this.state.password}
              onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class Info extends React.Component {
  render() {
    return (
      <div className='info'>
        Tone clouds can be used in to investigate the
        auditory selective attention (Gutschalk et al., 2008). Here, you can
        see and listen to several examples of tone cloud that were used in
        psychoacoustic experiments. Characteristics of these tones clouds are
        fetched from a Couch database.
        <div className='infoCenter'>
          Click somewhere on the plot to listen to the tone cloud.
        </div>
      </div>
    );
  }
}


class MetaDataTrial extends React.Component {
  render() {
    return (
      <div>
        You are listening to the tone cloud {this.props.num}
      </div>
    );
  }
}



export default App;
