import { Collection } from "mongoose";

// define(["require", "exports", "Scripts/MindFusion.Charting"], function (require, exports, m) 
// {"use strict"});
document.addEventListener('DOMContentLoaded', () => 
{

  console.log('IronGenerator JS imported successfully!');

  const baseURL = 'https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo';
  //Demo link from chart.js lab: https://api.coindesk.com/v1/bpi/historical/close.json
  //Demo link from alpha vantage : https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol=EUR&to_symbol=USD&interval=5min&apikey=demo
  //API Key: J32AHKQGTWBB4KXL

  let fromPair = document.getElementById("fromPair").value;
  let toPair = document.getElementById("toPair").value;
  let timeFrame = document.getElementById("timeFrame").value;
  let url = `${baseURL}` //?function=FX_INTRADAY&from_symbol=${fromPair}&to_symbol=${toPair}&interval=${timeFrame}&apikey=demo`;
  //?currency=<VALUE>
  let dataList = new Collection.List();
  
  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'candlestick',
      // data:
      // {
      //     labels: Object.keys(res.data.bpi),
      //     datasets: 
      //     [{
      //         label: "Bitcoin Price Index",
      //         data: Object.values(res.data.bpi),
      //         borderWidth: 1
      //     }]
      // },
  });

  myChart.title = "The Big Cheese";
  myChart.theme.titleFontSize = 16;

  function updateChart()
  {
      axios.get(url)
      .then((res) =>
      {
        // console.log(res.data.bpi)

        var times = json["Time Series FX (5min)"]
        var update = false;

        if(myChart.series.count() > 0) 
        {
            update = true;
        } 

        for(var time of times)
        {
            var forex_info = times[time];

            var dataItem = new myChart.ForexPrice(forex_info["1. open"], forex_info["4. close"], forex_info["3. low"], forex_info["2. high"], new Date(time ));

            dataList.add(dataItem);
        }

        var series = new myChart.ForexPriceSeries(dataList);
        series.dateTimeFormat = myChart.dateTimeFormat.ShortTime;

        var data = new Collection.ObservableCollection();
        data.add(series);
        myChart.series = data;
        myChart.draw();

      })
  }
      
//   document.getElementById('startDate').addEventListener("change", updateChart);
//   document.getElementById('endDate').addEventListener("change", updateChart);
//   document.getElementsByTagName('select').addEventListener("change", updateChart);
  

  updateChart()

}, false);
