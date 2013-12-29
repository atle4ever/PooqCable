var casper = require('casper').create({   
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
   // search for 'casperjs' from google form
   console.log("page loaded");
   this.fill('form[name="loginForm"]', { 
        user_id: 'atle4ever', 
        passwd: 'ahenahen'
    }, true);
});

casper.then(function(){
   this.wait(3);
   this.open('http://www.hi-bogo.net/cdsb/board.php?board=newmovie', {});
});

casper.then(function(){
   this.echo(this.getHTML());
});

casper.run();
