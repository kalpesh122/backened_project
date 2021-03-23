const fs = require('fs')
const http = require('http')
// const { parse } = require('node:path')
const url = require('url')

// Routing means implementing different actions for different urls

/////////////////////////////////////////////////////////////////////////////////
// What is Api ?
// Api is basically a Service from which we can request some data
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%DESCRIPTION%}/g, product.description)
  output = output.replace(/{%ID%}/g, product.id)

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  return output
}
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8',
)

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8',
)

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8',
)

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataobj = JSON.parse(data)
// Making a Simple Web server Server
const Port = 8000
// Creating Server
const server = http.createServer((req, res) => {
  // console.log(req.url)
  const { query, pathname } = url.parse(req.url, true)
  const path_name = req.url
  // Overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    })
    const cardsHtml = dataobj
      .map((el) => replaceTemplate(tempCard, el))
      .join('')
    // console.log(cardsHtml)
    const output = tempOverview.replace(' {%PRODUCT_CARDS%}   ', cardsHtml)
    res.end(output)
  }
  // Product
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    })
    const product = dataobj[query.id]
    const output = replaceTemplate(tempProduct, product)
    res.end(output)
  }
  // Api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    })
    res.end(data)
  }
  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    })
    res.end('<h1>404, Page Not Found</h1>')
  }
})
server.listen(Port, 'localhost', () => {
  console.log(`Server is listning at Port ${Port}`)
})
/////////////////////////////////////////////////////////////////////////////////
