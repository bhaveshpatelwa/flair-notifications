
var express = require('express')
var bodyParser = require('body-parser');
var jobs = require('./jobs')
const fs = require('fs');
var validator = require('./validator');
var logger = require('./logger');

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
        logger.log({
            level: 'error',
            message: 'error in schedule api due to invalid request body',
            errMsg: result.error.details[0].message
        });
        res.status(422).json({
            message: result.error.details[0].message.replace(/\"/g, ""),
        });
    }
    else {
        jobs.createJob(req.body).then(function (result) {
            if (result.success == 1) {
                res.status(201).json({
                    message: result.message,
                });
            }
            else {
                res.status(302).json({
                    message: result.message,
                });
            }
        }, function (err) {
            res.send(err);
        })
    }

});
app.put('/api/jobSchedule/', function (req, res) {
    var result = validator.validateReportReqBody(req.body);
    if (result.error) {
        res.status(422).json({
            message: result.error.details[0].message.replace(/\"/g, ""),
        });
    }
    else {
        jobs.modifyJob(req.body).then(function (result) {
            if (result.success == 1) {
                res.status(200).json({
                    message: result.message,
                });
            }
            else {
                res.status(404).json({
                    message: result.message,
                });
            }
        }, function (err) {
            res.send(err);
        })
    }

});
app.delete('/api/jobSchedule/', function (req, res) {
    var visualizationid = req.query.visualizationid;
    jobs.deleteJob(visualizationid).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    })

});
app.get('/api/jobSchedule/', function (req, res) {
    var visualizationid = req.query.visualizationid;
    jobs.getJob(visualizationid).then(function (result) {
        if (result.message) {
            res.status(204).json({
                message: result.message,
            });
        } else {
            res.send(result);
        }
    }, function (err) {
        res.send(err);
    })

});

app.get('/api/user/:userName/reports', (req, res) => {
    var page = (+req.query.page);
    var pageSize = (+req.query.pageSize);
    jobs.JobsByUser(req.params.userName, page, pageSize).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    })
});

app.get('/api/user/:userName/reportCount', (req, res) => {
    jobs.JobCountByUser(req.params.userName).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    })
});

app.get('/api/executeImmediate/', (req, res) => {
    var visualizationid = req.query.visualizationid;
    jobs.executeImmediate(visualizationid).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    })
});

app.get('/api/jobLogs/', (req, res) => {
    var visualizationid = req.query.visualizationid;
    jobs.jobLogs(visualizationid).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    })
});

module.exports = app;    //for testing





