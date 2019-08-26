
export  const barchartFormat  = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'World\'s largest cities per 2017'
    },
    subtitle: {
        text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Amount (rupees)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Amount: <b>{point.y:.1f} rupees</b>'
    },
    series: [{
        name: 'Month',
        data: [
            ['Shanghai', 24.2],
            ['Beijing', 20.8],
            ['Karachi', 14.9],
            ['Shenzhen', 13.7],
            ['Guangzhou', 13.1],
            ['Istanbul', 12.7],
            ['Mumbai', 12.4],
            ['Moscow', 12.2],
            ['São Paulo', 12.0],
            ['Delhi', 11.7],
            ['Kinshasa', 11.5],
            ['Tianjin', 11.2],
            ['Lahore', 11.1],
            ['Jakarta', 10.6],
            ['Dongguan', 10.6],
            ['Lagos', 10.6],
            ['Bengaluru', 10.3],
            ['Seoul', 9.8],
            ['Foshan', 9.3],
            ['Tokyo', 9.3]
        ],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '12px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]

};

export const pieChartFormat={
    chart : {
        plotBorderWidth: null,
        plotShadow: false
     },
     title : {
        text: 'Browser market shares at a specific website, 2014'   
     },
     tooltip : {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
     },
     plotOptions : {
        pie: {
           allowPointSelect: true,
           cursor: 'pointer',
     
           dataLabels: {
              enabled: false           
           },
     
           showInLegend: true
        }
     },
     series : [{
        type: 'pie',
        name: 'Browser share',
        data: [
           ['Firefox',   45.0],
           ['IE',       26.8],
           {
              name: 'Chrome',
              y: 12.8,
              sliced: true,
              selected: true
           },
           ['Safari',    8.5],
           ['Opera',     6.2],
           ['Others',      0.7]
        ]
     }]
    };

