document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  const baseURL = 'https://www.alphavantage.co/query'
  //Demo link from chart.js lab: https://api.coindesk.com/v1/bpi/historical/close.json
 
  function updateChart(e)
  {
      let url = `${baseURL}?function=FX_INTRADAY&from_symbol=${from_symbol}&to_symbol=${to_symbol}&interval=${interval}&apikey=${apikey}`;
  
      var times = []
      
      axios.get(url)
      .then((res) =>{
          console.log(res.data.bpi)
          
          var ctx = document.getElementById("myChart").getContext('2d');
          var myChart = new Chart(ctx, {
              type: 'candlestick', //needs to be candlestick
              data:
              {
                  labels: Object.keys(res.data.bpi),
                  datasets: 
                  [{
                      label: "Bitcoin Price Index",
                      data: Object.values(res.data.bpi),
                      borderWidth: 1
                  }]
              },
          });
      })
  }
      
  document.getElementById('startDate').addEventListener("change", updateChart);
  document.getElementById('endDate').addEventListener("change", updateChart);
  //document.getElementsByTagName('select').addEventListener("change", updateChart);
  

  updateChart()

}, false);
