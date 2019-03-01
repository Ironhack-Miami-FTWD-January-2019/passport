document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  const baseURL = 'https://www.alphavantage.co/query'
  //Demo link from chart.js lab: https://api.coindesk.com/v1/bpi/historical/close.json
 
  updateChart()

  $('.from_symbol, .to_symbol, .interval').on('change', ()=>{
    updateChart()
  })

  
  function updateChart(e)
  {
    console.log('update')

    // let from_symbol = document.getElementById("from_symbol").value;
    // let endDate = document.getElementById("endDate").value;
    // let currency = document.getElementsByTagName('select').value;
    // let url = `${baseURL}?start=${startDate}&end=${endDate}`;
    let from_symbol = $('.from_symbol').val() || 'EUR'
    let to_symbol = $('.to_symbol').val() || 'USD'    
    let interval = $('.interval').val() || '15min'
    let apikey = 'J32AHKQGTWBB4KXL'

    var ctx = document.getElementById("chart1").getContext("2d");
    ctx.canvas.width = 1000;
    ctx.canvas.height = 250;
     //https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=15min&apikey=J32AHKQGTWBB4KXL
    let url = `${baseURL}?function=FX_INTRADAY&from_symbol=${from_symbol}&to_symbol=${to_symbol}&interval=${interval}&apikey=${apikey}`;
    console.log(url);
    axios.get(url).then(allData => {
      console.log(allData)
        
      var times = allData.data[`Time Series FX (${interval})`];
      //var update = false;

      //if (stockChart.series.count() > 0)
      //update = true;
      console.log(times)
      let data = []
      for (var time in times) {
        var stock_info = times[time];
        console.log(stock_info)
            //"1. open": "1.1373",
            //"2. high": "1.1375",
            //"3. low": "1.1371",
            //"4. close": "1.1373"
        data.push({
          o: Number(stock_info["1. open"]), 
          c: Number(stock_info["4. close"]),
          l: Number(stock_info["3. low"]),
          h: Number(stock_info["2. high"]),
          t: (new Date(time)).getTime()
        })
        
        
        //data.push(stock_info)
      }
      console.log(data)
      new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: "CHRT - Chart.js Corporation",
            data: data,
            fractionalDigitsCount: 2,
          }]
        },
        options: {
          tooltips: {
            position: 'nearest',
            mode: 'index',
          },
        },
      });
    })

    //setInterval(updateChart, 5000);
  }

}, false);
