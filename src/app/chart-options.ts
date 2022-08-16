import { GraphOption } from "./Display";

export const GRAPHOPTIONS: GraphOption = {
    type: 'line',
    options: {
        responsive: true,
        
        maintainAspectRatio: false,
        interaction: {
        mode: 'index',
        intersect: false,
        },
        stacked: false,
        plugins: {
        title: {
            display: true,
            text: null
        }
        },
        animation: {
        duration: 0
        }
    },
}

export const RADIALGUAGEOPTIONS: any = {
    width: 200,
    height: 200,
    units: "Km/h",
    minValue: 0,
    maxValue: 220,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
        "120",
        "140",
        "160",
        "180",
        "200",
        "220"
    ],
    minorTicks: 2,
    strokeTicks: true,
    highlights: [
        {
            "from": 160,
            "to": 220,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    colorPlate: "#FFFFFF00",
    colorMajorTicks: 'rgb(51, 145, 245)',
    colorMinorTicks:'rgb(51, 145, 245)',
    colorUnits: 'rgb(51, 145, 245)',
    colorNeedle: 'rgba(234, 184, 3, 1)',
    colorNeedleEnd: 'rgba(234, 184, 3, 1)',
    colorValueBoxRect:"#FFFFFF00",
    colorValueBoxBackground:"#FFFFFF00",
    colorValueText: 'rgba(234, 184, 3, 1)',
    colorNumbers: "#e8e8e8",
    colorValueBoxRectEnd: "#FFFFFF00",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 50,
    animationRule: "linear"
}

export const LINEARGUAGEOPTIONS: any = {
    width: 100,
    units: "FuelUnitsHere",
    minValue: 0,
    maxValue: 120,
    majorTicks: [
        "0",
        "20",
        "40",
        "60",
        "80",
        "100",
    ],
    minorTicks: 2,
    
    highlights: [
        {
            "from": 0,
            "to": 20,
            "color": "rgba(200, 50, 50, .75)"
        }
    ],
    strokeTicks: true,
    colorPlate: "#FFFFFF00",
    colorMajorTicks: 'rgb(51, 145, 245)',
    colorMinorTicks:'rgb(51, 145, 245)',
    colorUnits: 'rgb(51, 145, 245)',
    colorNeedle: 'rgba(234, 184, 3, 1)',
    colorNeedleEnd: 'rgba(234, 184, 3, 1)',
    colorValueBoxRect:"#FFFFFF00",
    colorValueBoxBackground:"#FFFFFF00",
    colorValueText: 'rgba(234, 184, 3, 1)',
    colorNumbers: "#e8e8e8",
    colorValueBoxRectEnd: "#FFFFFF00",
    borderShadowWidth: 0,
    borders: false,
    needleType: "arrow",
    needleWidth: 2,
    needleCircleSize: 7,
    needleCircleOuter: true,
    needleCircleInner: false,
    animationDuration: 300,
    animationRule: "linear",
}



export const CHARTCOLORS = [
    'rgba(234, 184, 3, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(50, 168, 82, 0.5)',
    'rgba(235, 52, 174, 0.5)',
    'rgba(235, 64, 52, 0.5)',
    'rgba(52, 64, 235, 0.5)'
];

