import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';

function City(props) {
  return (
    <Card border="primary" className="m-1" >
      <Card.Body>
        <Card.Title>{props.data.City}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush" >
        <ListGroup.Item action variant="info" >Population: {props.data.EstimatedPopulation}</ListGroup.Item>
        <ListGroup.Item action variant="info" >Location: {props.data.LocationType}</ListGroup.Item>
        <ListGroup.Item action variant="info" >ZipCode Type: {props.data.ZipCodeType}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
function ZipCode(props){
  return(
      <Col className="border p-2 m-2 bg-light text-center">{props.zipCode}</Col>
  );
}

function ZipSearchField(props) {
  return (
    <Form >
      <Form.Group className="col-md-6 mx-auto mb-3" controlId="searchForm.ControlInput1">
        <Form.Control size="lg" className="mb-2" type="search" placeholder="Enter a five digit zip code or city name" onChange={(e) => props.handleChange(e)} />
      </Form.Group>
    </Form>
  );
}


class App extends Component {
  state = {
    zipCode: '',
    citiesDatas: [],
    zipCodes: [],
  }

  zipChange = (event) => {

    console.log(event.target.value)

    this.setState({ zipCode: event.target.value })

    if(event.target.value.length === 5 && !isNaN(this.filterInt(event.target.value))) {
      fetch('https://ctp-zip-api.herokuapp.com/zip/'+event.target.value)
        .then(res => res.json())
        .then(datas => {
          console.log(datas)
          // save the data to my state,
          // and in the render function diplay the <City /> components dynamically
          // this.setState({ citiesDatas: data }) // 1
          this.setState( { citiesDatas: datas } );
        })
        .catch(err => {
          this.setState({ citiesDatas: [] })
        })
    }else if(this.filterStr(event.target.value) && event.target.value.length > 2 ){
      fetch('https://ctp-zip-api.herokuapp.com/city/'+event.target.value.toUpperCase())
        .then(res => res.json())
        .then(datas => {
          console.log(datas)
          // save the data to my state,
          // and in the render function diplay the <City /> components dynamically
          // this.setState({ zipCodes: data }) // 1
          this.setState( { zipCodes: datas } );
        })
        .catch(err => {
          this.setState({ zipCodes: [] })
        })
    } else {
      this.setState({ citiesDatas: [] , zipCodes: []})
    }
  }

  
  render() {
    return (
      <Container className="border p-5" >
        <Row className="p-3">
          <h2 className="mx-auto"> Zip Code / City Search</h2>
        </Row>
        <ZipSearchField handleChange={ (e) => this.zipChange(e) } />
        <p className="col-md-6 mx-auto">Current Zip code is: { this.state.zipCode }</p>
        <Row xs={1} md={2} lg={5} className="justify-content-between" >
            { this.state.citiesDatas.map(city => <City data={city} />) }
        </Row>
        <Row xs={4} md={5} lg={6} className="justify-content-between" >
          {this.state.zipCodes.map(code => <ZipCode zipCode={code} />)}
        </Row>
      </Container>
    );
  }
// this function filter the input for a number amd return a number value  or not a number, NaN.
  filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value)
    } else {
      return NaN
    }
  }
// this function filter the input for a string amd return true or false.
  filterStr(value) {
    if (/^[a-zA-Z]*$/.test(value)) {
      return true;
    } else {
      return false;
    }
  }

}

export default App;
