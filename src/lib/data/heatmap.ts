const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const HOURE_DAYS = [
    "12",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
];

const chartData = [
    [0, 0, 30],
    [0, 1, 10],
    [0, 2, 20],
    [0, 3, 40],
    [0, 4, 50],
    [0, 5, 30],
    [0, 6, 0],
    [0, 7, 70],
    [0, 8, 0],
    [0, 9, 90],
    [0, 10, 0],
    [0, 11, 2],
    [0, 12, 4],
    [0, 13, 1],
    [0, 14, 1],
    [0, 15, 3],
    [0, 16, 4],
    [0, 17, 6],
    [0, 18, 4],
    [0, 19, 4],
    [0, 20, 3],
    [0, 21, 3],
    [0, 22, 2],
    [0, 12, 5],
    [1, 0, 7],
    [1, 1, 0],
    [1, 2, 0],
    [1, 3, 0],
    [1, 4, 0],
    [1, 5, 0],
    [1, 6, 0],
    [1, 7, 0],
    [1, 8, 0],
    [1, 9, 0],
    [1, 10, 5],
    [1, 11, 2],
    [1, 12, 2],
    [1, 13, 6],
    [1, 14, 9],
    [1, 15, 11],
    [1, 16, 6],
    [1, 17, 7],
    [1, 18, 8],
    [1, 19, 12],
    [1, 20, 5],
    [1, 21, 5],
    [1, 22, 7],
    [1, 12, 2],
    [2, 0, 1],
    [2, 1, 1],
    [2, 2, 0],
    [2, 3, 0],
    [2, 4, 0],
    [2, 5, 0],
    [2, 6, 0],
    [2, 7, 0],
    [2, 8, 0],
    [2, 9, 0],
    [2, 10, 3],
    [2, 11, 2],
    [2, 12, 1],
    [2, 13, 9],
    [2, 14, 8],
    [2, 15, 10],
    [2, 16, 6],
    [2, 17, 5],
    [2, 18, 5],
    [2, 19, 5],
    [2, 20, 7],
    [2, 21, 4],
    [2, 22, 2],
    [2, 12, 4],
    [3, 0, 7],
    [3, 1, 3],
    [3, 2, 0],
    [3, 3, 0],
    [3, 4, 0],
    [3, 5, 0],
    [3, 6, 0],
    [3, 7, 0],
    [3, 8, 1],
    [3, 9, 0],
    [3, 10, 5],
    [3, 11, 4],
    [3, 12, 7],
    [3, 13, 14],
    [3, 14, 13],
    [3, 15, 12],
    [3, 16, 9],
    [3, 17, 5],
    [3, 18, 5],
    [3, 19, 10],
    [3, 20, 6],
    [3, 21, 4],
    [3, 22, 4],
    [3, 12, 1],
    [4, 0, 1],
    [4, 1, 3],
    [4, 2, 0],
    [4, 3, 0],
    [4, 4, 0],
    [4, 5, 1],
    [4, 6, 0],
    [4, 7, 0],
    [4, 8, 0],
    [4, 9, 2],
    [4, 10, 4],
    [4, 11, 4],
    [4, 12, 2],
    [4, 13, 4],
    [4, 14, 4],
    [4, 15, 14],
    [4, 16, 12],
    [4, 17, 1],
    [4, 18, 8],
    [4, 19, 5],
    [4, 20, 3],
    [4, 21, 205],
    [4, 22, 3],
    [4, 12, 0],
    [5, 0, 2],
    [5, 1, 1],
    [5, 2, 0],
    [5, 3, 3],
    [5, 4, 0],
    [5, 5, 0],
    [5, 6, 0],
    [5, 7, 0],
    [5, 8, 2],
    [5, 9, 0],
    [5, 10, 4],
    [5, 11, 1],
    [5, 12, 5],
    [5, 13, 10],
    [5, 14, 5],
    [5, 15, 7],
    [5, 16, 11],
    [5, 17, 6],
    [5, 18, 0],
    [5, 19, 5],
    [5, 20, 3],
    [5, 21, 4],
    [5, 22, 2],
    [5, 12, 0],
    [6, 0, 1],
    [6, 1, 0],
    [6, 2, 0],
    [6, 3, 0],
    [6, 4, 0],
    [6, 5, 0],
    [6, 6, 0],
    [6, 7, 0],
    [6, 8, 0],
    [6, 9, 0],
    [6, 10, 1],
    [6, 11, 0],
    [6, 12, 2],
    [6, 13, 1],
    [6, 14, 3],
    [6, 15, 4],
    [6, 16, 0],
    [6, 17, 0],
    [6, 18, 0],
    [6, 19, 0],
    [6, 20, 1],
    [6, 21, 2],
    [6, 22, 2],
    [6, 12, 6],
].map((item) => [item[1], item[0], item[2] || 0]);

const options = {
    chart: {
        type: "heatmap",
        plotBorderWidth: 0,
    },
    title: {
        text: null
    },
    legend: {
        title: {
            text: 'Number of interactions',
            style: {
                fontStyle: "bold",
            },
        },
        align: "right",
        layout: "horizental",
        margin: 0,
        verticalAlign: "top",
        y: 0,
        x: 25,
        symbolHeight: 20,
    },
    xAxis: {
        categories: HOURE_DAYS,
        tickInterval: 1,
        labels: {
            step: 1,
            style: {
                fontSize: "14px",
                fontFamily: "Inter",
            },
        },
        opposite: true,
        gridLineWidth: 0,
        lineWidth: 0,
        lineColor: "rgba(0,0,0,0.75)",
        tickWidth: 0,
        tickLength: 0,
        tickColor: "rgba(0,0,0,0.75)",
        title: {
            text: "",
        },
    },
    yAxis: {
        categories: WEEK_DAYS,
        lineWidth: 0,
        gridLineWidth: 0,
        title: "Weekdays",
        reversed: true,
        labels: {
            style: {
                fontSize: "14px",
                fontFamily: "Inter",
            },
        },
    },
    tooltip: {
        enabled: false,
    },
    colorAxis: {
        min: 0,
        minColor: '#F3F3F3',
        maxColor: '#45367B',
        max: 100,
        stops: [
            [0, "#F3F3F3"],
            [0.1, "#E0F1F7"],
            [0.2, "#AEDFF0"],
            [0.3, "#DAD0FF"],
            [0.5, "#AE9DF0"],
            [0.7, "#8474C0"],
            [1, "#45367B"],
        ],
    },
    series: [
        {
            name: "Revenue",
            borderWidth: 0.5,
            borderColor: "white",
            dataLabels: {
                enabled: true,
                color: "#222222",
            },
            pointPadding: 2,
            data: chartData,
            colsize: 0.9,
            rowsize: 0.8,
        },
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            // Make the labels less space demanding on mobile
            chartOptions: {
                chart: {
                    scrollablePlotArea: {
                        maxWidth: 400,
                    },
                },
                xAxis: {
                    width:1000,
                    labels: {
                        step: 1,
                        style: {
                            fontSize: "10px",
                            fontFamily: "Inter",
                        },
                    },
                },
                yAxis: {
                    labels: {
                        style: {
                            fontSize: "10px",
                            fontFamily: "Inter",
                        },
                    },
                },
                series: [
                    {
                        name: "Revenue",
                        borderWidth: 0.5,
                        borderColor: "white",
                        dataLabels: {
                            enabled: true,
                            color: "#222222",
                        },
                        pointPadding: .8,
                        data: chartData,
                        colsize: .7,
                        rowsize: .7,
                    },
                ],
            }
        }]
    }
};

export {
    WEEK_DAYS,
    HOURE_DAYS,
    chartData,
    options
};