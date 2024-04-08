const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./tmp');
  }

async function fetchPageRaw(pageUrl) {
    let response = null, body=null
    console.log('fetching', pageUrl)
    try {
        response = await fetch(pageUrl)
        if (response.ok) {
            console.log('got page response', pageUrl)
            body = await response.text()
            console.log('got body', pageUrl)
        } else {
            throw new Error('Network response was not ok.')
        }
    }
    catch (error) {
        console.error('Error fetching', error)
    }
    finally {
        return body
    }
}

async function fetchPageJS(pageUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageUrl, {waitUntil: 'networkidle0'});
    await new Promise(r => setTimeout(r, 1000)) // wait for JS to load. 1 s enough?
    let html=await page.content()
    return html
}

async function getPage(pageUrl, useCache=false) {
    console.log('getpage', pageUrl)
    let page=localStorage.getItem(pageUrl)
    if (useCache && page) {
        console.log('got page from local storage', pageUrl)
    } else {
        page = await fetchPageJS(pageUrl)
        localStorage.setItem(pageUrl, page)
        console.log('got page from fetch and saved to local storage', pageUrl)
    }
    return page
}

function tempestGetWindData(body) {
    const $ = cheerio.load(body)
    let ccWind = $('#cc-wind')
    let windDirection=ccWind.find('.wind-direction-icon').attr('data-wind-direction')
    let windAvg = ccWind.find('span[data-param=wind_avg]').text()
    let pageTimestamp = $('#list-summary-view').find('span[data-param=timestamp]').text()
    let rapidWindTimestamp = ccWind.attr('data-rapid_wind_timestamp')
    return {
        "windDirection": windDirection, 
        "windAvg": windAvg,
        "pageTimestamp": pageTimestamp,
        "rapidWindTimestamp": rapidWindTimestamp
    }
}

async function main() {
    // let response = await getpage('https://quotes.toscrape.com/random')
    let body = await getPage('https://tempestwx.com/station/105376/', useCache=true)
    let windData = tempestGetWindData(body)
    console.log('Back from getPage')
}


// main()
console.log('windmap/index.js running!')
main()
