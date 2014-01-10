// Patterns

var fs = require('fs');
var execFile = require("child_process").execFile

var casper = require('casper').create({   
    clientScripts: ["jquery.min.js"], // To use $(XXX) syntax
    verbose: true, 
    logLevel: 'debug',
    pageSettings: {
         loadImages:  false,
         loadPlugins: false,
         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

// @TODO: remove?
// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// @TODO: remove?
// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

// Login
var url = 'http://www.hi-bogo.net';
casper.start(url, function() {
   this.fill('form[name="loginForm"]', { 
        user_id: 'atle4ever2', 
        passwd: 'ahenahen'
    }, true);
});

casper.then(function(){
   this.wait(1.5);
});

// Goto korean entertain
casper.then(function(){
   this.open('http://www.hi-bogo.net/cdsb/board.php?board=kentertain', {});
});

casper.then(function(){
    var titles = this.evaluate(function(){
        var titles = new Array();
        $("table.board01 a.Font9").each(function() {

            // Patterns
            var patterns = [
                new RegExp("K팝스타.*720p-HANrel"),
                new RegExp("아빠! 어디가.*720p-HANrel"),
                new RegExp("진짜 사나이.*720p-HANrel"),
                new RegExp("1박 2일.*720p-HANrel"),
                new RegExp("슈퍼맨이 돌아왔다.*720p-HANrel"),
                new RegExp("해피투게더.*720p-HANrel"),
                new RegExp("힐링캠프.*720p-HANrel"),
                new RegExp("자기야.*720p-HANrel"),
                new RegExp("우리결혼했어요.*720p-WITH"),
                new RegExp("무한도전.*720p-WITH"),
                new RegExp("정글의 법칙.*720p-WITH"),
                new RegExp("마녀사냥.*720p-WITH"),
                new RegExp("꽃보다 누나.*720p-WITH"),
                new RegExp("썰전.*720p-WITH"),
                new RegExp("라디오스타.*720p-WITH")
            ];

            var title = $(this).text();
            for(var i = 0; i < patterns.length; ++i) {
                if(title.match(patterns[i])) {
                    console.log(title);
                    titles.push('http://www.hi-bogo.net/cdsb/' + $(this).attr("href"));
                    break;
                }
            }
        });
        return titles;
    });

    this.each(titles, function(self, link) {
        self.thenOpen(link, function() {
            var torrent = this.evaluate(function() {
                return [$('a.link:first').text(), 'http://www.hi-bogo.net/cdsb/' + $('a.link:first').attr("href")];
            });
            var torrentPath = '/home/sjkim/PooqCableProd/torrent_files/' + torrent[0] + '.torrent';

            if(!fs.exists(torrentPath)) {
                this.download(torrent[1], torrentPath);
                execFile('transmission-remote', ['localhost', '-a', torrentPath], null, function(err, stdout, stderr) {
                    console.log("execFileSTDOUT:", JSON.stringify(stdout))
                    console.log("execFileSTDERR:", JSON.stringify(stderr))
                });
            }
        });
    });
});

// Goto korean drama (on-going)
casper.then(function(){
   this.open('http://www.hi-bogo.net/cdsb/board.php?board=kdramaon', {});
});

casper.then(function(){
    var titles = this.evaluate(function(){
        var titles = new Array();
        $("table.board01 a.Font9").each(function() {

            // Patterns
            var patterns = [
                // new RegExp("왕가네 식구들.*720p-HANrel")
            ];

            var title = $(this).text();
            for(var i = 0; i < patterns.length; ++i) {
                if(title.match(patterns[i])) {
                    console.log(title);
                    titles.push('http://www.hi-bogo.net/cdsb/' + $(this).attr("href"));
                    break;
                }
            }
        });
        return titles;
    });

    this.each(titles, function(self, link) {
        self.thenOpen(link, function() {
            var torrent = this.evaluate(function() {
                return [$('a.link:first').text(), 'http://www.hi-bogo.net/cdsb/' + $('a.link:first').attr("href")];
            });
            var torrentPath = '/home/sjkim/PooqCableProd/torrent_files/' + torrent[0] + '.torrent';

            if(!fs.exists(torrentPath)) {
                this.download(torrent[1], torrentPath);
                execFile('transmission-remote', ['localhost', '-a', torrentPath], null, function(err, stdout, stderr) {
                    console.log("execFileSTDOUT:", JSON.stringify(stdout))
                    console.log("execFileSTDERR:", JSON.stringify(stderr))
                });
            }
        });
    });
});

casper.run();
