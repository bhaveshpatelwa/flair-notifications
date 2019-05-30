var sendmailtool = require('./send-mail');
var models = require('./database/models/index');
var wkhtmltoimage = require('wkhtmltoimage');
var grpc_client = require('./grpc/client');
var charts=require('./chart/generate-charts');
var logger=require('./logger');

var AppConfig = require('./load_config');
var image_dir = AppConfig.imageFolder;

var retryDelay = 3000 //in miliseconds

var wkhtmltoimage=wkhtmltoimage.setCommand('/usr/bin/wkhtmltoimage');


exports.loadDataAndSendMail = function loadDataAndSendMail(reports_data) {
    let query=reports_data.report_line_obj.query;

    var grpcRetryCount=0;
    function loadDataFromGrpc(query){
        grpcRetryCount+=1;
        var data_call = grpc_client.getRecords(query);
        data_call.then(function (response) {
        var json_res = JSON.parse(response.data);
        var config={
            dimension: reports_data.report_line_obj.dimension,
            measure: reports_data.report_line_obj.measure,
        }
        //render html chart
        if (reports_data.report_line_obj.viz_type == "Pie Chart") {
            chart_call= charts.pieChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Line Chart") {
            chart_call= charts.lineChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Clustered Vertical Bar Chart") {
            chart_call= charts.clusteredverticalBarChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Clustered Horizontal Bar Chart") {
            chart_call= charts.clusteredhorizontalBarChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Heat Map") {
            chart_call= charts.heatmapChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Stacked Vertical Bar Chart") {
            chart_call= charts.stackedverticalBarChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Stacked Horizontal Bar Chart") {
            chart_call= charts.stackedhorizontalBarChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Combo Chart") {
            chart_call= charts.comboChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Tree Map") {
            chart_call= charts.treemapChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Info graphic") {
            chart_call= charts.infographicsChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Box Plot") {
            chart_call= charts.boxplotChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Bullet Chart") {
            chart_call= charts.bulletChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Sankey") {
            chart_call= charts.sankeyChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Table") {
            chart_call= charts.tableChart(reports_data.report_line_obj.visualizationid,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Pivot Table") {
            chart_call= charts.pivottableChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Doughnut Chart") {
            chart_call= charts.doughnutChart(config,json_res.data);
        } 

        else if (reports_data.report_line_obj.viz_type == "KPI") {
            chart_call= charts.kpiChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Scatter plot") {
            chart_call= charts.scatterChart(config,json_res.data);
        }
        else if (reports_data.report_line_obj.viz_type == "Gauge plot") {
            chart_call= charts.gaugeChart(config,json_res.data);
        }

        chart_call.then(function (response) {
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
                            console.log(error);
                            if (mailRetryCount < 2){
                                console.log("send mail retrying");
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
