var casper = require('casper').create({   
    clientScripts: ["jquery.min.js"],
    verbose: true, 
    logLevel: 'debug',
    pageSettings: {
         loadImages:  false,         // The WebPage instance used by Casper will
         loadPlugins: false,         // use these settings
         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});

var url = 'http://www.hi-bogo.net';

casper.start(url, function() {
   this.fill('form[name="loginForm"]', { 
        user_id: 'XXX', 
        passwd: 'XXX'
    }, true);
});

casper.then(function(){
   this.wait(1.5);
   this.open('http://www.hi-bogo.net/cdsb/board.php?board=kentertain', {});
});

casper.then(function(){
    var titles = this.evaluate(function(){
        var titles = new Array();
        $("table.board01 a.Font9:lt(3)").each(function() {
            titles.push('http://www.hi-bogo.net/cdsb/' + $(this).attr("href"));
            // console.log($(this).text());
            // console.log('http://www.hi-bogo.net/cdsb/' + $(this).attr("href"));
        });
        return titles;
    });

    this.each(titles, function(self, link) {
        self.thenOpen(link, function() {
            var torrent = this.evaluate(function() {
                return 'http://www.hi-bogo.net/cdsb/' + $('a.link:first').attr("href");
            });
            this.download(torrent, 'test.torrent');
        });
    });
});

casper.run();
