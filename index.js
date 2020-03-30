const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");

//const text = fs.readFileSync("input.txt", "utf-8");
// console.log(text);

// console.log('How are you??')

// const str='Apurva Vaje'

// fs.writeFileSync('output.txt' , str);

// fs.readFile('input.txt' , 'utf-8' , (err , data) =>{
//   if(err) return console.log('ERROR!')
//   console.log(data);
// })

// console.log("How are you??")

//////////////////// SERVER ////////////////////////

const data = fs.readFileSync(`${__dirname}/node-farm/starter/dev-data/data.json`,"utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/node-farm/starter/templates/template-overview.html`,"utf-8");
const tempCards = fs.readFileSync(`${__dirname}/node-farm/starter/templates/template-cards.html`,"utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/node-farm/starter/templates/template-product.html`,"utf-8");
const dataObj = JSON.parse(data);

const slug = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slug);

const server = http.createServer((req, res) => {
  // const path = req.url;
  const { query, pathname } = url.parse(req.url, true);

  //Home Page
  if (pathname === "/" || pathname === "/home") {
    res.end("You are at home");
    //Overview Page
  } else if (pathname === "/overview") {
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCards, el));
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);
    //API Page
  } else if (pathname === "/api") {
    // It is preferred that the data is read first and then the data is called as soon as we request it
     res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    //ProductPage
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    // console.log(slug[0]);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else {
    //Error Page
    res.end("Error!!");
  }

 
});
server.listen("8000", "127.0.0.1" , ()=>{
  console.log("The server is listening");
});

