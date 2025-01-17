const d3 = require('d3');
const pie = require('flair-visualizations/js/charts/pie');
const line = require('flair-visualizations/js/charts/line');
const clusteredverticalbar = require('flair-visualizations/js/charts/clusteredverticalbar');
const clusteredhorizontalbar = require('flair-visualizations/js/charts/clusteredhorizontalbar');
const stackedhorizontalbar = require('flair-visualizations/js/charts/stackedhorizontalbar');
const stackedverticalbar = require('flair-visualizations/js/charts/stackedverticalbar');
const heatmap = require('flair-visualizations/js/charts/heatmap');
const combo = require('flair-visualizations/js/charts/combo');
const treemap = require('flair-visualizations/js/charts/treemap');
const infographics = require('flair-visualizations/js/charts/infographics');
const boxplot = require('flair-visualizations/js/charts/boxplot');
const bullet = require('flair-visualizations/js/charts/bullet');
const sankey = require('flair-visualizations/js/charts/sankey');
const table = require('flair-visualizations/js/charts/table');
const pivottable = require('flair-visualizations/js/charts/pivottable');
const doughnut = require('flair-visualizations/js/charts/doughnut');
const kpi = require('flair-visualizations/js/charts/kpi');
const scatter = require('flair-visualizations/js/charts/scatter');
const gauge = require('flair-visualizations/js/charts/gauge');

const load_config = require('./load-config');

const jsdom = require('jsdom');
const chartUtility = require('./chart-util');
const { JSDOM } = jsdom;


var charts = {
  pieChart: async function (viz_id, data) {
    
    var pieFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="pie" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(pieFakeDom.window.document)
    
    var pieChartobj = pie();
    var chartConfig = await load_config.pieChartConfig(viz_id);
    chartConfig.valueAsArc=false; //for server side

    pieChartobj.config(chartConfig).print(true).data(data);
    pieChartobj(d3.select(pieFakeDom.window.document).select('#pie'))
    return  pieChartobj._getHTML();

  },
  lineChart: async function (viz_id, data) {

    var linefakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="line" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(linefakeDom.window.document);

    var linechart = line();
    var chartConfig = await load_config.lineChartConfig(viz_id);

    linechart.config(chartConfig).print(true).data(data);
    linechart(d3.select(linefakeDom.window.document).select('#line'))
    return linechart._getHTML();

  },
  clusteredverticalBarChart: async function (viz_id, data) {
    var clusteredverticalBarFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="clusteredverticalBar" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(clusteredverticalBarFakeDom.window.document)

    var clusteredverticalBarChartObj = clusteredverticalbar();
    var chartConfig = await load_config.clusteredverticalBarConfig(viz_id);

    clusteredverticalBarChartObj.config(chartConfig).print(true).data(data);
    clusteredverticalBarChartObj(d3.select(clusteredverticalBarFakeDom.window.document).select('#clusteredverticalBar'))
    return clusteredverticalBarChartObj._getHTML();

  },
  clusteredhorizontalBarChart: async function (viz_id, data) {
    var clusteredhorizontalBarFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="clusteredhorizontalBar" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(clusteredhorizontalBarFakeDom.window.document)

    var clusteredhorizontalBarChartObj = clusteredhorizontalbar();
    var chartConfig = await load_config.clusteredhorizontalBarConfig(viz_id);

    clusteredhorizontalBarChartObj.config(chartConfig).print(true).data(data);
    clusteredhorizontalBarChartObj(d3.select(clusteredhorizontalBarFakeDom.window.document).select('#clusteredhorizontalBar'))
    return clusteredhorizontalBarChartObj._getHTML();
  },
  stackedverticalBarChart: async function (viz_id, data) {
    var stackedverticalBarFakeDom= new JSDOM('<!DOCTYPE html><html><body><div id="stackedverticalBar" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(stackedverticalBarFakeDom.window.document)

    var stackedverticalBarChartObj = stackedverticalbar();
    var chartConfig = await load_config.stackedverticalBarConfig(viz_id);

    stackedverticalBarChartObj.config(chartConfig).print(true).data(data);
    stackedverticalBarChartObj(d3.select(stackedverticalBarFakeDom.window.document).select('#stackedverticalBar'))
    return stackedverticalBarChartObj._getHTML();

  },
  stackedhorizontalBarChart: async function (viz_id, data) {
    var stackedhorizontalBarFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="stackedhorizontalBar" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(stackedhorizontalBarFakeDom.window.document)

    var stackedhorizontalBarChartObj = stackedhorizontalbar();
    var chartConfig = await load_config.stackedHorizontalBarConfig(viz_id);
    
    stackedhorizontalBarChartObj.config(chartConfig).print(true).data(data);
    stackedhorizontalBarChartObj(d3.select(stackedhorizontalBarFakeDom.window.document).select('#stackedhorizontalBar'))
    return stackedhorizontalBarChartObj._getHTML();

  },
  heatmapChart: async function (config, data) {

    var heatmapFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="heatmap" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(heatmapFakeDom.window.document)
    var heatmapChartobj = heatmap();
    var newConfig = convertConfigToLowerCase(config);

    var chartConfig = {
      dimension: newConfig.dimension,
      measure: newConfig.measure,
      dimLabelColor: "00ff00",
      displayName: "abc",
      fontStyleForDimension: "italic",
      fontWeightForDimension: "900",
      fontSizeForDimension: "15",

      "showValues": [true, true, true, true, true, true, true],
      "displayNameForMeasure": ["Measure 1", "Measure 2", "Measure 2", "Measure 2", "Measure 2", "Measure 2", "Measure 2"],
      "showIcon": [true, true, true, true, true, true, true,],
      valuePosition: ["left", "right", "center", "left", "right", "center", "right"],
      iconName: ['fa fa-globe', 'fa fa-male', 'fa fa-globe', 'fa fa-male', 'fa fa-globe', 'fa fa-male', 'fa fa-globe'],
      iconFontWeight: ["bold", "900", "900", "900", "900", "900", "900"],
      iconColor: ['#FFFFFF', '#DDC224', '#FFFFFF', '#DDC224', '#FFFFFF', '#DDC224', '#FFFFFF'],
      iconPosition: ["left", "right", "center", "left", "right", "center", "right"],
      showIcon: [true, true, true, true, true, true, true],
      colourCoding: [
        'upto,500000,#ff0000|upto,900000,#ff0080|above,900000,#ff0040|default,,#ff00bf',
        'upto,500000,#8000ff|upto,900000,#4000ff|above,900000,#0000ff|default,,#00bfff',
        'upto,500000,#00ff80|upto,900000,#00ff40|above,900000,#40ff00|default,,#bfff00',
        'upto,500000,#008080|upto,900000,#0B614B|above,900000,#5F9EA0|default,,#00CED1',
        'upto,500000,#9932CC|upto,900000,#9400D3|above,900000,#8A2BE2|default,,#BA55D3',
        'upto,500000,#C71585|upto,900000,#DB7093|above,900000,#FF1493|default,,#FFB6C1',
        'upto,500000,#D2691E|upto,900000,#CD853F|above,900000,#DAA520|default,,#F4A460'
      ],
      "valueTextColour": ["#e06a6a", "#00ff00", "#ff0000", "#639ece", "#ababab", "#e06a6a", "#639ece"],
      "fontStyleForMeasure": ["italic", "bold", "bold", "bold", "bold", "bold", "bold"],
      "fontWeightForMeasure": ["bold", "900", "900", "900", "900", "900", "900"],
      "numberFormat": ["M", "M", "M", "M", "M", "M", "M"],
      "fontSizeForMeasure": ["8", "10", "12", "15", "8", "9", "10"]
    };
    heatmapChartobj.config(chartConfig).tooltip(false).print(true);
    d3.select(heatmapFakeDom.window.document).select('#heatmap').datum(data).call(heatmapChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = heatmapChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;


  },
  comboChart: async function (config, data) {

    var comboFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="combo" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(comboFakeDom.window.document)
    var comboChartobj = combo();
    var newConfig = convertConfigToLowerCase(config);

    var chartConfig = {
      dimension: newConfig.dimension,
      measure: newConfig.measure,
      showLegend: true, // true|false
      legendPosition: 'top', // top|bottom|right|left
      "showXaxis": true,
      "showYaxis": true,
      "showXaxisLabel": true,
      "showYaxisLabel": true,
      "xAxisColor": "#ff0000",
      "yAxisColor": "#00ff00",
      "showGrid": true,
      "stacked": false,
      "displayName": "Dimension 1",
      "showValues": [true, true],
      "displayNameForMeasure": ["Measure 1", "Measure 2"],
      "fontStyle": ["italic", "bold"],
      "fontWeight": ["bold", "900"],
      "numberFormat": ["M", "M"],
      "textColor": ["#e06a6a", "#00ff00"],
      "displayColor": ["", ""],
      "borderColor": ["", ""],
      "fontSize": ["8", "8"],
      "comboChartType": ['Line', 'Bar'],
      "lineType": ["Line", ""],
      "pointType": ["rectrounded", ""]
    };

    comboChartobj.config(chartConfig).tooltip(false).print(true);
    d3.select(comboFakeDom.window.document).select('#combo').datum(data).call(comboChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = comboChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;


  },
  treemapChart: async function (config, data) {

    var treemapFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="treemap" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(treemapFakeDom.window.document)
    var treemapChartobj = treemap();
    var newConfig = convertConfigToLowerCase(config);

    var chartConfig = {
      dimension: newConfig.dimension,
      showLabelForDimension: [true, true],
      labelColorForDimension: ["#ffffff", "blue"],
      displayColor: ["#0000FF", "#00BFFF"],
      "fontStyleForDimension": ["italic", "bold"],
      fontWeightForDimension: ["900", "900"],
      "fontSizeForDimension": ["15", "10"],
      "measure": newConfig.measure,
      "showLabel": true,
      colorPattern: 'single_color',//gradient_color|unique_color|single_color
      showValues: true,
      "valueTextColour": "#e06a6a",
      "fontStyleForMes": "italic",
      fontWeightForMes: "bold",
      "fontSizeForMes": "8",
      "numberFormat": "K",
    }
    treemapChartobj.config(chartConfig).tooltip(false).print(true);

    d3.select(treemapFakeDom.window.document).select('#treemap').datum(data).call(treemapChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = treemapChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;


  },
  infographicsChart: async function (config, data) {

    var infographicsFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="infographics" style="width:540px; height:600px;"></div></body></html>');
    chartUtility.configureDomForcharts(infographicsFakeDom.window.document)
    var infographicsChartobj = infographics();
    var newConfig = convertConfigToLowerCase(config);

    var chartConfig = {
      chartBorderColor: "#ebbe44",
      chartDisplayColor: "#e91919",
      chartType: "bar",
      dimension: newConfig.dimension,
      kpiAlignment: "Center",
      kpiBackgroundColor: "#FFFFFF",
      kpiColor: "#1e9fed",
      kpiColorExpression: null,
      kpiDisplayName: "Display name",
      kpiFontSize: 9,
      kpiFontStyle: "Normal",
      kpiFontWeight: "normal",
      kpiIcon: null,
      kpiIconColor: null,
      kpiIconExpression: null,
      kpiIconFontWeight: "normal",
      kpiNumberFormat: "Actual",
      measure: newConfig.measure,
    }
    infographicsChartobj.config(chartConfig).tooltip(false).print(true);

    d3.select(infographicsFakeDom.window.document).select('#infographics').datum(data).call(infographicsChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = infographicsChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;


  },
  boxplotChart: async function (config, data) {

    var boxplotFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="boxplot" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(boxplotFakeDom.window.document)
    var boxplotChartobj = boxplot();
    var newConfig = convertConfigToLowerCase(config);
    var chartConfig = {
      dimension: newConfig.dimension,
      measure: newConfig.measure,
      "showXaxis": true,
      "showYaxis": true,
      "axisColor": true,
      "showLabels": false,
      "labelColor": "Dimension 1",
      "numberFormat": [true, true, true, true, true],
      "displayColor": ["#efefef", "#909090", "#ababab", "#eeaaee", "#121545"]
    };
    boxplotChartobj.config(chartConfig).tooltip(false).print(true);

    d3.select(boxplotFakeDom.window.document).select('#boxplot').datum(data).call(boxplotChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = boxplotChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;


  },
  bulletChart: async function (config, data) {

    var bulletFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="bullet" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(bulletFakeDom.window.document)
    var bulletChartobj = bullet();
    var newConfig = convertConfigToLowerCase(config);

    var chartConfig = {
      dimension: newConfig.dimension,
      measures: newConfig.measure,
      "fontStyle": "italic",
      "fontWeight": "bold",
      "fontSize": "15",
      "showLabel": true,
      "valueColor": "#ff00ff",
      "targetColor": "#00ff00",
      "orientation": "Horizontal",//horizontal|vertical
      "segments": "3",
      "segmentInfo": 'upto,100,#8000ff|upto,200,#4000ff|above,500,#0000ff|default,,#00bfff',
      "measureNumberFormat": "K",
      "targetNumberFormat": "K"
    }
    bulletChartobj.config(chartConfig).tooltip(false).print(true);

    d3.select(bulletFakeDom.window.document).select('#bullet').datum(data).call(bulletChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = bulletChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;
  },
  sankeyChart: async function (config, data) {

    var sankeyFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="sankey" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(sankeyFakeDom.window.document)
    var sankeyChartobj = sankey();

    var newConfig = convertConfigToLowerCase(config);
    var chartConfig = {
      dimension: newConfig.dimension,
      measure: newConfig.measure,
      showLabels: [true, true],// true|false
      fontStyle: ['italic', 'italic'], // top|bottom|right|left
      "fontWeight": ["900", "bold"],
      "fontSize": ["15", "10"],
      "textColor": ["#ff0000", "#000000"],
      colorPattern: 'single_color',//gradient_color|unique_color|single_color
      "displayColor": "#ff0000",
      "borderColor": "#00ff00",
      "numberFormat": "K"
    };

    sankeyChartobj.config(chartConfig).tooltip(false).print(true);

    d3.select(sankeyFakeDom.window.document).select('#sankey').datum(data).call(sankeyChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = sankeyChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;
  },
  tableChart: async function (viz_id, data) {

    var tableFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="table" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(tableFakeDom.window.document)
    var tableChartobj = table();

    var chartConfig = await load_config.tableChartConfig(viz_id)
    tableChartobj.config(chartConfig).print(true);

    d3.select(tableFakeDom.window.document).select('#table').datum(data).call(tableChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = tableChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;
  },
  pivottableChart: async function (config, data) {

    var pivottableFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="pivottable"></div></body></html>');
    chartUtility.configureDomForcharts(pivottableFakeDom.window.document)
    var pivottableChartobj = pivottable();

    var newConfig = convertConfigToLowerCase(config);
    var chartConfig = {
      cellColorExpressionForMeasure: [undefined, undefined],
      cellColorForDimension: ["rgb(226, 166, 166)", "rgb(239, 72, 72)"],
      cellColorForMeasure: ["rgba(255, 255, 255, 1)", "rgb(227, 45, 45)"],
      dimension: newConfig.dimension,
      displayNameForDimension: ["Display name", "Display name"],
      displayNameForMeasure: ["Display name", "Display name"],
      fontSizeForDimension: [9, 9],
      fontSizeForMeasure: [9, 9],
      fontStyleForDimension: ["Normal", "Normal"],
      fontStyleForMeasure: ["Normal", "Normal"],
      fontWeightForDimension: ["normal", "normal"],
      fontWeightForMeasure: ["normal", "normal"],
      iconColor: [],
      iconExpressionForMeasure: [undefined, undefined],
      iconFontWeight: [],
      iconNameForMeasure: [undefined, undefined],
      iconPositionForMeasure: [undefined, undefined],
      isPivoted: [false, true],
      measure: newConfig.measure,
      numberFormatForMeasure: ["Actual", "Actual"],
      textAlignmentForDimension: ["Left", "Left"],
      textAlignmentForMeasure: ["center", "center"],
      textColorExpressionForDimension: [undefined, undefined],
      textColorExpressionForMeasure: [undefined, undefined],
      textColorForDimension: ["#91ccef", "#131ae9"],
      textColorForMeasure: ["#617c8c", "#f01238"]
    };

    pivottableChartobj.config(chartConfig).print(true);

    d3.select(pivottableFakeDom.window.document).select('#pivottable').datum(data).call(pivottableChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = pivottableChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;
  },
  doughnutChart: async function (viz_id, data) {
    var doughnutFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="doughnut" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(doughnutFakeDom.window.document)
    
    var doughnutChartobj = doughnut();
    var chartConfig = await load_config.DoughnutChartConfig(viz_id);
    chartConfig.valueAsArc=false; //for server side
    
    doughnutChartobj.config(chartConfig).print(true).data(data);
    doughnutChartobj(d3.select(doughnutFakeDom.window.document).select('#doughnut'))
    return  doughnutChartobj._getHTML();

  },
  kpiChart: async function (viz_id, data) {
    var kpiFakeDom = new JSDOM('<!DOCTYPE html><html><body><div id="kpi" width="950" height="440"></div></body></html>');
    chartUtility.configureDomForcharts(kpiFakeDom.window.document)
    var kpiChartobj = kpi();
    var chartConfig = await load_config.KPIChartConfig(viz_id);
    
    kpiChartobj.config(chartConfig).print(true).data(data);
    kpiChartobj(d3.select(kpiFakeDom.window.document).select('#kpi'))
    return  kpiChartobj._getHTML();

  },
  scatterChart: async function (config, data) {
    var scatterFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="scatter" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(scatterFakeDom.window.document)
    var scatterChartobj = scatter();
    var newConfig = convertConfigToLowerCase(config);
    var chartConfig = {
      dimension: newConfig.dimension,
      measure: newConfig.measure,
      showLegend: true, // true|false
      legendPosition: 'top', // top|bottom|right|left
      "showXaxis": true,
      "showYaxis": true,
      "showXaxisLabel": true,
      "showYaxisLabel": true,
      "xAxisColor": "#ff0000",
      "yAxisColor": "#00ff00",
      "showGrid": true,
      "stacked": false,
      "displayName": "Dimension 1",
      "showValues": [true, true, true],
      "displayNameForMeasure": ["Measure 1", "Measure 2", "Measure 2"],
      "fontStyle": ["italic", "bold", "bold"],
      "fontWeight": ["bold", "900", "900"],
      "numberFormat": ["M", "M", "M"],
      "textColor": ["#e06a6a", "#00ff00", "#00ff00"],
      "displayColor": ["", "", ""],
      "borderColor": ["", "", ""],
      "fontSize": ["8", "8", ""]
    };
    scatterChartobj.config(chartConfig).print(true);
    d3.select(scatterFakeDom.window.document).select('#scatter').datum(data).call(scatterChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = scatterChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;

  },
  gaugeChart: async function (config, data) {
    var gaugeFakeDom = new JSDOM('<!DOCTYPE html><html><body><svg id="gauge" width="950" height="440"/></body></html>');
    chartUtility.configureDomForcharts(gaugeFakeDom.window.document)
    var gaugeChartobj = gauge();
    var newConfig = convertConfigToLowerCase(config);
    var chartConfig = {
      displayColor: "#ed2c2c",
      displayName: "Display name",
      fontStyle: "Normal",
      fontWeight: "normal",
      gaugeType: "half circle",
      isGradient: false,
      measures: newConfig.measure,
      numberFormat: "Actual",
      showValues: false,
      targetDisplayColor: "#1824ed",
      targetDisplayName: "Display name",
      targetFontStyle: "Normal",
      targetFontWeight: "normal",
      targetNumberFormat: "Actual",
      targetShowValues: false,
      targetTextColor: "#617c8c",
      textColor: "#617c8c",
    }
    gaugeChartobj.config(chartConfig).print(true);
    d3.select(gaugeFakeDom.window.document).select('#gauge').datum(data).call(gaugeChartobj);

    let chartRenderingPromise = new Promise((resolve, reject) => {
      setTimeout(function () {
        var chartHtml = gaugeChartobj._getHTML();
        resolve(chartHtml)
      }, 2000);
    });
    result = await chartRenderingPromise;
    return result;

  },
}

module.exports = charts;

function convertConfigToLowerCase(config) {
  var newDimension = []
  var newMeassure = []
  config.dimension.forEach(function (elm) {
    newDimension.push(elm.toLowerCase())
  });
  config.measure.forEach(function (elm) {
    newMeassure.push(elm.toLowerCase())
  });
  return config = { dimension: newDimension, measure: newMeassure }
}