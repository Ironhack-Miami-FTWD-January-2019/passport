document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  const baseURL = 'https://api.coindesk.com/v1/bpi/historical/close.json'
  //Demo link from chart.js lab: https://api.coindesk.com/v1/bpi/historical/close.json
  //Demo link from alpha vantage : https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo
  //API Key: J32AHKQGTWBB4KXL

  function updateChart(e)
  {
      let fromPair = document.getElementById("fromPair").value;
      let toPair = document.getElementById("toPair").value;
      let url = `${baseURL}?start=${fromPair}&end=${toPair}`;
      //?currency=<VALUE>
      
      axios.get(url)
      .then((res) =>{
          console.log(res.data.bpi)
          
          var ctx = document.getElementById("myChart").getContext('2d');
          var myChart = new Chart(ctx, {
              type: 'line', //needs to be candlestick
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
