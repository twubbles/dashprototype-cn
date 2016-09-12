
// responsive function for navagation menu 
function navBarMenu() {
    var x = document.getElementById("thetopnavbar");
    if (x.className === "topnavbar") {
        x.className += " responsive";
    } else {
        x.className = "topnavbar";
    }
}


// function for live feed chart
$(function () {
    $(document).ready(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
       
        $('#barcontainer').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, 
                marginRight: 10,
                events: {
                    load: function () {

                        // This is where the function uses jQuery to call random a number from random.org and the current time
                        
                        var series = this.series[0];
                        setInterval(function () {
                            $.get("https://www.random.org/integers/?num=1&min=1&max=200&col=1&base=10&format=plain&rnd=new", 
                                  function(data, status){
        
    
                            var x = (new Date()).getTime(), 
                                y = data / 100;
                            series.addPoint([x, y], true, true);
                        });
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data from atmospheric noise'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of psuedo-random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            }]
        });
    });
});

// This is the pie chart function
// generation is triggered via a button click
$("button").click(function () {
    
    // jQuery makes a get request to random.org for 5 numbers from 1-500 here
   $.get("https://www.random.org/integers/?num=5&min=1&max=500&col=1&base=10&format=plain&rnd=new", function(data, status){
       
       // the plaintext data is split into an array here
    var randarray = data.split(/\s+/);
    $('#piecontainer').highcharts({
        
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Numbers generated'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Portion of Total',
            colorByPoint: true,
            
            // the array is still in strings, which works for the name of each element, but the value needs to be converted
            // to an integer
            
            data: [{
                name: randarray[0],
                y: parseInt(randarray[0])
            }, {
                name: randarray[1],
                y: parseInt(randarray[1]),
                sliced: true,
                selected: true
            },{
                name: randarray[2],
                y: parseInt(randarray[2]),
                sliced: true,
                selected: true
            },{
                name: randarray[3],
                y: parseInt(randarray[3]),
                sliced: true,
                selected: true
            },{
                name: randarray[4],
                y: parseInt(randarray[4])
            }]
        }]
    });
  });
});


// this is the d3 bar chart
var margin = {top: 20, right: 20, bottom: 30, left: 40}
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "%");
var svg = d3.select("body div.bar2-container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 960 500")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // the data is called directly from a gist in tab spaced value (tsv) format.
d3.tsv("https://gist.githubusercontent.com/twubbles/ff6abf396e349c3b6f573b8d890081d3/raw/5b4a68dc96a8ef8247c4ef32a2c6e7264eea7f51/data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });
});
function type(d) {
  d.frequency = +d.frequency;
  return d;
}
