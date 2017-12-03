const fs = require("fs");
const htmlparser = require('htmlparser2');

let relativePath = "../../";
let rebuiltHtml = "";

var handler = new htmlparser.DomHandler(function (err,dom){
  // dom = JSON DOM from htmlparser

  // get an array of all DOM <link> elements and append to the href attribute
  let linkHtml = htmlparser.DomUtils.getElementsByTagName("link", dom);
  for(var i=0; i < linkHtml.length; i++){
      console.log(`replacing ${linkHtml[i].name}: ${linkHtml[i].attribs.href}`);
      linkHtml[i].attribs.href = relativePath + linkHtml[i].attribs.href;
      console.log(`with: ${linkHtml[i].attribs.href}`);
  }

    // convert the dom json back into html
    rebuiltHtml = htmlparser.DomUtils.getInnerHTML({ children: dom});
});

let sourceHtml = fs.createReadStream("./base.html");
var parser = new htmlparser.WritableStream(handler);
let outputHtml = fs.createWriteStream('./newhtml.html');

// run the app: read in html -> pipe to parser -> write out to file
sourceHtml.pipe(parser).on('finish', function(){
  outputHtml.write(rebuiltHtml);
  outputHtml.on('finish', () => {  
    console.log('new html file written!');
  });
  outputHtml.end();
});