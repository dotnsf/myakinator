//. app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    ejs = require( 'ejs' ),
    app = express();

var { Aki } = require( 'aki-api' );
var region = { region: 'jp' };

var settings = require( './settings' );

var akinators = {};

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

app.get( '/', function( req, res ){
  res.render( 'index', { settings: settings } );
});

app.get( '/question', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      res.write( JSON.stringify( { status: true, question: akinators[did].question }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.get( '/answers', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      res.write( JSON.stringify( { status: true, answers: akinators[did].answers }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.get( '/step', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      res.write( JSON.stringify( { status: true, step: akinators[did].currentStep }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.get( '/progress', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      res.write( JSON.stringify( { status: true, progress: akinators[did].progress }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.post( '/answer', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;
  var answer = req.body.answer;

  if( did ){
    if( akinators[did] ){
      answer = parseInt( answer );
      if( answer >= 0 && answer < 5 ){
        await akinators[did].step( answer );

        var progress = parseFloat( akinators[did].progress );
        if( progress >= settings.eligible ){
          await akinators[did].win();
          res.write( JSON.stringify( { status: true, step: akinators[did].currentStep, progress: progress, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
          res.end();

          //. このまま再度ページロードされると、情報が残ったままになっておかしな初期ページになってしまう
          //. ので、次回ロード時に強制初期化できるよう削除
          delete akinators[did];
        }else{
          res.write( JSON.stringify( { status: true, step: akinators[did].currentStep, progress: progress, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
          res.end();
        }
      }else{
        res.status( 400 );
        res.write( JSON.stringify( { status: false, error: 'no answer specified.' }, null, 2 ) );
        res.end();
      }
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.post( '/start', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      await akinators[did].start();

      res.write( JSON.stringify( { status: true, step: akinators[did].currentStep, progress: akinators[did].progress, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.post( '/stop', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      await akinators[did].win();

      res.write( JSON.stringify( { status: true, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.post( '/reset', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );
  var did = req.query.did;

  if( did ){
    if( akinators[did] ){
      akinators[did] = new Aki( region );
      await akinators[did].start();

      res.write( JSON.stringify( { status: true, did: did, step: 0, progress: akinators[did].progress, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: 'no akinator instance found.' }, null, 2 ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no device id specified.' }, null, 2 ) );
    res.end();
  }
});

app.post( '/setcookie', async function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var did = req.body.did;
  //console.log( 'did = ' + did );
  if( did ){
    akinators[did] = new Aki( region );
    await akinators[did].start();

    var dt = new Date();
    var ts = dt.getTime();
    ts += 1000 * 60 * 60 * 24 * 365 * 100; //. 100 years
    dt.setTime( ts );
    var value = ( "deviceid=" + did + '; expires=' + dt.toUTCString() + '; path=/' );

    res.setHeader( 'Set-Cookie', value );

    res.write( JSON.stringify( { status: true, did: did, step: 0, progress: akinators[did].progress, question: akinators[did].question, answers: akinators[did].answers }, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false }, null, 2 ) );
    res.end();
  }
});


function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
