export function convertToChart(df){
    var columns = df.listColumns()
    columns = columns.filter(x=>x!=='date')
    var df_list = df.toCollection()
    var series={}
    columns.forEach(col=>{series[col]=[]})
    var categories = [], series_list=[]
    df_list.forEach(element => {
        columns.forEach(col=>{
            series[col].push(parseFloat(element[col]).toFixed(2))
        })
        categories.push(element['date'])
    });
    
    columns.forEach(el=>{
        series_list.push({
            name: el,
            data: series[el]
        })
    })

    return { 
        categories: categories, 
        series: series_list
    }    
}

export const OPTIONS = {
    chart: {
        id: 'salesChart'
      },
    stroke: {
      show: true,
      width: 1,
    },
    colors:['#40739e', '#40739e'],
    title: {
        text: 'Chart', align: 'center', 
        style: { fontSize:  '14px', fontWeight:  'bold', fontFamily:  undefined, color:  '#263238' },
    },            
    chart: { id: "basic-bar" },
    xaxis: {
        categories: []
    },
    yaxis:{ title: { text: 'Values'} }
  }

export default function convertParams(params){

}