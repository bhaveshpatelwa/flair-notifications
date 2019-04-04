
var express = require('express')
var bodyParser = require('body-parser');
var jobs = require('./jobs')
const fs = require('fs');
var validator = require('./validator');

var AppConfig = require('./load_config');

var images_dir = AppConfig.imageFolder;

// create image dir if not exit 
if (!fs.existsSync(images_dir)) {
    fs.mkdirSync(images_dir);
}

var app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies




app.post('/api/jobSchedule/', function (req, res) {
    var result = validator.validateReportReqBody(req.body);
    if (result.error) {
        var errors=[];
        for(err of result.error.details){
            errors.push(err.message.replace(/\"/g, ""));
        }
        res.status(200).json({
            status: 'error',
            message: errors,
        });
    }
    else {
        reslt = jobs.createJob(req.body);
        reslt.then(function (result) {
            if (result.success==1){
                res.status(201).send(result);
            }
            else{
                res.status(302).send(result);
            }
        }, function (err) {
            res.send(err);
        })
    }

});
app.put('/api/jobSchedule/', function (req, res) {
    var result = validator.validateReportReqBody(req.body);
    if (result.error) {
        var errors=[];
        for(err of result.error.details){
            errors.push(err.message.replace(/\"/g, ""));
        }
        res.status(200).json({
            status: 'error',
            message: errors,
        });
    }
    else {
        reslt = jobs.modifyJob(req.body);
        reslt.then(function (result) {
            res.send(result);
        }, function (err) {
            res.send(err);
        })
    }

});
app.delete('/api/jobSchedule/', function (req, res) {
    reslt = jobs.deleteJob(req.body);
        reslt.then(function (result) {
            res.send(result);
        }, function (err) {
            res.send(err);
        })

});
app.get('/api/jobSchedule/', function (req, res) {
    reslt = jobs.jobLogs(req.body);
        reslt.then(function (result) {
            res.send(result);
        }, function (err) {
            res.send(err);
        })

});

app.get('/api/user/:userName/reports', (req, res) => {
    reslt = jobs.reportsByUser(req.params.userName);
        reslt.then(function (result) {
            res.send(result);
        }, function (err) {
            res.send(err);
        })
  });

module.exports = app;  // for testing





