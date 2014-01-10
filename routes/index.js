
/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');

var PREFIX = '/home/sjkim/PooqCableProd/downloads';

exports.video = function(req, res) {
    var p = req.param('path');
    if(typeof p === 'undefined') {
        p = '';
    }

    p = path.join(PREFIX, p);
    res.sendfile(p);
};

exports.videoPlay = function(req, res) {
    var p = req.param('path');

    res.render('video', { video: 'video?path=' + p });
};

exports.index = function(req, res) {
    var p = req.param('path');
    if(typeof p === 'undefined') {
        p = '';
    }
    fullPath = path.join(PREFIX, p);
    var contents = fs.readdirSync(fullPath);

    var links = new Array(); 
    var videos = new Array();

    for(var i in contents) {
        var newPath = path.join(p, contents[i]);
        var newFullPath = path.join(fullPath, contents[i]);
        var stat = fs.statSync(newFullPath);
        if(stat.isFile()) {
            // TODO: use audio codec instead of prefix
            if(contents[i].substring(0,2)  == 'C_')
                videos.push([stat['mtime'].getTime(), contents[i], 'video_play?path=' + encodeURIComponent(newPath)]);
        } else {
            links.push([contents[i], '?path=' + encodeURIComponent(newPath)]);
        }
    }

    // sort by modified time
    videos.sort();
    videos.reverse();
    res.render('index', { links: links, videos: videos});
};
