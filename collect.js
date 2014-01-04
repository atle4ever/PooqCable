// Patterns

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
        user_id: 'atle4ever', 
        passwd: 'ahenahen'
    }, true);
});

// Goto korean entertain
casper.then(function(){
   this.wait(1.5);
   this.open('http://www.hi-bogo.net/cdsb/board.php?board=kentertain', {});
});

// Filter titles and download torrent files
casper.then(function(){
    var titles = this.evaluate(function(){
        var titles = new Array();
        $("table.board01 a.Font9").each(function() {

            // Patterns
            var patterns = [
                new RegExp("정글의 법칙.*HANrel"),
                new RegExp("마녀사냥.*WITH"),
                new RegExp("꽃보다 누나.*WITH")
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
            this.download(torrent[1], '/home/sjkim/PooqCableProd/torrent_files/' + torrent[0] + '.torrent');
        });
    });
});

casper.run();
