
import React from 'react';
import { Form } from 'react-bootstrap';
import CSVReader from "react-csv-reader";
import moment from 'moment'
import DataFrame from 'dataframe-js'

const date_formats = [
  'D/M/YYYY',
  'M/YYYY',
  'D/M/YY',
  'YYYY',
  'MM/YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'DD/MM/YYYY HH',
  'DD/MM/YYYY HH:mm',
  'DD/MM/YYYY HH:mm:ss',
  'YYYY-MM-DD HH:mm:ss',
  'M/D/YYYY'
]

export default class Begin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      columns: [],
      date_cols: [],
      date_col: null,
      df: null,
      base_df: null
    }
  }

  getValidDateCols = (keys, firstRow) => {
    var validDateCols = []
    keys.forEach(element => {
      var value = firstRow[element]
      console.log("KEY DATE", element, value, typeof value, isNaN(value))
      var isValidDate

      if (isNaN(value)) { //value è una stringa, verifichiamo se può essere una data valida
        isValidDate = moment(value, date_formats, true).isValid()
      }
      else { //value è un numero, verifichiamo se è un timestamp valido
        isValidDate = moment.unix(value).isValid()
      }
      if (isValidDate) {
        validDateCols.push(element)
      }
    })
    return validDateCols
  }

  getValidDataCols = (keys, firstRow) => {
    var validDataCols = []
    keys.forEach(element => {
      var value = firstRow[element]
      if (!isNaN(value)) {
        validDataCols.push(element)
      }
    })
    return validDataCols
  }

  //fileinfo USE TO CHECK ERRORS
  checkDataset = (data, fileInfo) => {
    console.log("FILE INFO", fileInfo)
    const keys = Object.keys(data[0])
    console.log("KEYS", keys) //lista colonne
    console.log("DATA", data) //lista di rows
    const validDateCols = this.getValidDateCols(keys, data[0])
    const validDataCols = this.getValidDataCols(keys, data[0])
    //CONTROLLI SUL FILE QUI
    //Check delle colonne ed eventualmente togli quello che non è numerico
    console.log("VALID DATES IN CHECK", validDateCols)
    const df = new DataFrame(data, keys)

    //controllare che nel file ci siano date valide 
    if(validDateCols.length === 0){
      return
    }
    
    //TODO3: visualizzare params in onMouseOver sul Block

    this.setState({
      showForm: true,
      date_cols: validDateCols,
      date_col: validDateCols[0],
      columns: validDataCols,
      df: df,
      base_df: df,
      fileName: fileInfo.name
    })

    
    this.props.valueCallBack(this.getDesiredDataFrame(validDateCols[0]), fileInfo.name)
  };

  getDesiredDataFrame = (date_col) => {
    const { base_df, columns } = this.state
    console.log(base_df)
    const value_cols = columns.filter(l => l !== date_col)
    var requested_df = base_df.rename(date_col, 'date')
    requested_df = requested_df.select('date', ...value_cols)
    return this.parseDataFrameDate(requested_df)
  }

  parseDataFrameDate = (df) => {
    return df.withColumn('date', (row) => {
      var date = row.get('date')
      if (isNaN(date)) { //date è una stringa
        date = moment(date, date_formats, true)
      }
      else { //date è un numero
        date = moment.unix(date)
      }
      return date.format('YYYY-MM-DD HH:mm:ss')
    })
  }

  handleDateSelect = (event) => {
    console.log("ON CHANGE", event)
    console.log("ONCHANGE", event.target)
    const col = event.target.id

    //Prepare DataFrame
    var df = this.getDesiredDataFrame(col)
    this.props.valueCallBack(df, this.state.fileName)
    this.setState({ date_col: col, df: df })
  }

  render() {
    const parseOptions = {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      transformHeader: header => header.toLowerCase()
    };
    return (
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
            </Form.Group>
    {this.props.fileName && <p>Loaded file: {this.props.fileName}</p>}
            <Form.Group>
              {this.state.showForm &&
                <div>
                  <p>Seleziona la colonna da usare come data</p>
                  {this.state.date_cols.map(col =>
                    <Form.Check
                      type={'radio'}
                      id={col}
                      label={col}
                      name={"date_col_radio"}
                      onChange={this.handleDateSelect}
                      checked = { col === this.state.date_col ? true : false } //test
                    />


                  )}
                </div>}
            </Form.Group>
          </Form>
        </div>
      </div>

    )
  }

}