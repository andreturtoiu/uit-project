
import React from 'react';
import { Form } from 'react-bootstrap';
import CSVReader from "react-csv-reader";


export default class Begin extends React.Component{
  constructor(props){        
    super(props)      
    this.state = {
        showForm: false,
        columns:[]
    }
}
  //fileinfo USE TO CHECK ERRORS
  checkDataset = (data, fileInfo) => {
    const keys = Object.keys(data[0])   
    //CONTROLLI SUL FILE QUI
    //Check delle colonne ed eventualmente togli quello che non è numerico
    this.setState({showForm:true})

    };
  
    render(){
      const parseOptions = {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase()
      };
      return(
        <div className='block-div-begin'>
          <div>  
            <Form>
              <Form.Group>
              <CSVReader
                    cssClass="react-csv-input"
                    label={`Upload CSV file`}
                    onFileLoaded={this.checkDataset}
                    parserOptions={parseOptions}
                />
                
                {this.state.showForm && 
                <div>                
                  <p>Qui generi i check sulla base delle colonne </p>  
                  <p></p>
                  <button>Conferma selezione data e setti lo state di Block</button>
                </div>}
              </Form.Group>
            </Form>       
          </div>     
      </div>
      
      )
    }
    
  }