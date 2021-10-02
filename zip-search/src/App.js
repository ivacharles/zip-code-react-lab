import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
function City(props) {
  return (
    <Card  border="primary" className="m-1" >
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

function ZipSearchField(props) {
  return (
    <Form >
      <Form.Group className="col-md-6 mx-auto mb-3" controlId="searchForm.ControlInput1">
        <Form.Control size="lg" className="mb-2" type="search" placeholder="Enter a five digit zip code" onChange={(e) => props.handleChange(e)} />
      </Form.Group>
    </Form>
  );
}


class App extends Component {
  state = {
    zipCode: '',
    cities: [],
  }

  zipChange = (event) => {

    console.log(event.target.value)

    this.setState({ zipCode: event.target.value })

    if(event.target.value.length === 5) {
      fetch('https://ctp-zip-api.herokuapp.com/zip/'+event.target.value)
        .then(res => res.json())
        .then(datas => {
          console.log(datas)
          // save the data to my state,
          // and in the render function diplay the <City /> components dynamically
          // this.setState({ cities: data }) // 1
          this.setState( { cities: datas } );
        })
        .catch(err => {
          this.setState({ cities: [] })
        })
    } else {
      this.setState({ cities: [] })
    }
  }
  
  render() {
    return (
      <Container className="border p-5" >
        <Row className="p-3">
          <h2 className="mx-auto"> Zip Code Search</h2>
        </Row>
        <ZipSearchField handleChange={ (e) => this.zipChange(e) } />
        <p className="col-md-6 mx-auto">Current Zip code is: { this.state.zipCode }</p>
        <Row xs={1} md={2} lg={5} className="justify-content-between" >
            { this.state.cities.map(city => <City data={city} />) }
        </Row>
      </Container>
    );
  }
}

export default App;
