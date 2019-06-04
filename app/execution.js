var sendmailtool = require('./send-mail');
var models = require('./database/models/index');
var wkhtmltoimage = require('wkhtmltoimage');
var grpc_client = require('./grpc/client');
var charts=require('./chart/generate-charts');
var logger=require('./logger');

var AppConfig = require('./load_config');
var image_dir = AppConfig.imageFolder;

const retryDelay = 3000 //in miliseconds

var wkhtmltoimage=wkhtmltoimage.setCommand('/usr/bin/wkhtmltoimage');

const chartMap = {
    'Pie Chart': {
        generateChart: function (report_obj, data) {
            return charts.pieChart(report_obj.report_line_obj.visualizationid,data);
        }
    },
    'Line Chart': {
        generateChart: function (report_obj, data) {
            return charts.lineChart(report_obj.report_line_obj.visualizationid,data);
        }
    },
    'Clustered Vertical Bar Chart': {
        generateChart: function (report_obj, data) {
            return charts.clusteredverticalBarChart(report_obj.report_line_obj.visualizationid,data);
        }
    },
    'Clustered Horizontal Bar Chart': {
        generateChart: function (report_obj, data) {
            return charts.clusteredhorizontalBarChart(report_obj.report_line_obj.visualizationid,data);
        }
    },
    'Heat Map': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.heatmapChart(config,data);
        }
    },
    'Stacked Vertical Bar Chart': {
        generateChart: function (report_obj, data) {
            return charts.stackedverticalBarChart(report_obj.report_line_obj.visualizationid,data);
        }
    },
    'Stacked Horizontal Bar Chart': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.stackedhorizontalBarChart(config,data);
        }
    },
    'Combo Chart': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.comboChart(config,data);
        }
    },
    'Tree Map': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.treemapChart(config,data);
        }
    },
    'Info graphic': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.infographicsChart(config,data);
        }
    },
    'Box Plot': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.boxplotChart(config,data);
        }
    },
    'Bullet Chart': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.bulletChart(config,data);
        }
    },
    'Sankey': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.sankeyChart(config,data);
        }
    },
    'Table': {
        generateChart: function (report_obj, data) {
            return charts.tableChart(report_obj.report_line_obj.visualizationid,data,data);
        }
    },
    'Pivot Table': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.pivottableChart(config,data);
        }
    },
    'Doughnut Chart': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.doughnutChart(config,data);
        }
    },
    'KPI': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.kpiChart(config,data);
        }
    },
    'Scatter plot': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.scatterChart(config,data);
        }
    },
    'Gauge plot': {
        generateChart: function (report_obj, data) {
            var config={
                dimension: report_obj.report_line_obj.dimension,
                measure: report_obj.report_line_obj.measure,
            }
            return charts.gaugeChart(config,data);
        }
    },
};

exports.loadDataAndSendMail = function loadDataAndSendMail(reports_data) {
    let query=reports_data.report_line_obj.query;

    var grpcRetryCount=0;
    function loadDataFromGrpc(query){
        grpcRetryCount+=1;
        var data_call = grpc_client.getRecords(query);
        data_call.then(function (response) {
        var json_res = JSON.parse(response.data);

        //render html chart
        generate_chart=chartMap[reports_data.report_line_obj.viz_type].generateChart(reports_data,json_res.data);

        generate_chart.then(function (response) {
                var imagefilename = reports_data['report_obj']['report_name'] + '.jpg';
                wkhtmltoimage.generate(response, { output: image_dir + imagefilename });
                var to_mail_list=[];
                for(user of reports_data['report_assign_obj']['email_list']){
                    to_mail_list.push(user['user_email'])
                  }
                var mail_body = reports_data['report_obj']['mail_body']
                var report_title = reports_data['report_obj']['title_name']
                var subject = reports_data['report_obj']['subject']
                var mailRetryCount=0;
                function sendMail(subject, to_mail_list, mail_body, report_title, imagefilename){
                    mailRetryCount+=1;
                    sendmailtool.sendMail(subject, to_mail_list, mail_body, report_title, imagefilename).then(function (response) {
        
                        let shedularlog = models.SchedulerTaskLog.create({
                            SchedulerJobId: reports_data['report_shedular_obj']['id'],
                            task_executed: new Date(Date.now()).toISOString(),
                            task_status: "success",
                        });
                    },
                        function (error) {
                            logger.log({
                                level: 'error',
                                message: 'error while sending mail',
                                errMsg:error,
                              });
                            if (mailRetryCount < 2){
                                setTimeout(() => sendMail(subject, to_mail_list, mail_body, report_title, imagefilename),
                                 retryDelay);  
                            }
                            else{
                                let shedularlog = models.SchedulerTaskLog.create({
                                    SchedulerJobId: reports_data['report_shedular_obj']['id'],
                                    task_executed: new Date(Date.now()).toISOString(),
                                    task_status: "mail "+error,
                                });
                            }
                            
                        });
        
                }
                sendMail(subject, to_mail_list, mail_body, report_title, imagefilename);
            },function(err){
                logger.log({
                    level: 'error',
                    message: 'error while generating chart',
                    errMsg:err,
                  });  
            })


    }, function (err) {
        logger.log({
            level: 'error',
            message: 'error while fetching records data from GRPC ',
            errMsg:err,
          });
        if (grpcRetryCount < 2){
            setTimeout(() => loadDataFromGrpc(query), retryDelay);  
        }
        else{
            let shedularlog = models.SchedulerTaskLog.create({
                SchedulerJobId: reports_data['report_shedular_obj']['id'],
                task_executed: new Date(Date.now()).toISOString(),
                task_status: "grpc err:"+err,
            });
        }
        
    })

    }

    loadDataFromGrpc(query);
    
}

