import puppeteer from "puppeteer"
import cheerio from "cheerio"
import { LocalStorage } from "node-localstorage"
import * as fs from 'fs';
import * as path from "path"

if (typeof localStorage === "undefined" || localStorage === null) {
    var localStorage = new LocalStorage("./windmap/tmp")
}

async function fetchPageRaw(pageUrl) {
    let response = null,
        body = null
    console.log("fetching", pageUrl)
    try {
        response = await fetch(pageUrl)
        if (response.ok) {
            console.log("got page response", pageUrl)
            body = await response.text()
            console.log("got body", pageUrl)
        } else {
            throw new Error("Network response was not ok.")
        }
    } catch (error) {
        console.error("Error fetching", error)
    } finally {
        return body
    }
}

async function fetchPageJS(pageUrl) {
    if (requiresLogin(pageUrl)) {
        await loginSite(pageUrl)
    }
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(pageUrl, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 1000)) // wait for JS to load. 1 s enough?
    let html = await page.content()
    return html
}

async function getPage(pageUrl, useCache = false) {
    console.log("getpage", pageUrl)
    let page = localStorage.getItem(pageUrl)
    if (useCache && page) {
        console.log("got page from local storage", pageUrl)
    } else {
        page = await fetchPageJS(pageUrl)
        localStorage.setItem(pageUrl, page)
        console.log("got page from fetch and saved to local storage", pageUrl)
    }
    return page
}

function tempestParsePage(html) {
    const $ = cheerio.load(html)
    let ccWind = $("#cc-wind")
    let windDirection = ccWind
        .find(".wind-direction-icon")
        .attr("data-wind-direction")
    let windAvg = ccWind.find("span[data-param=wind_avg]").text()
    let pageTimestamp = $("#list-summary-view")
        .find("span[data-param=timestamp]")
        .text()
    let rapidWindTimestamp = ccWind.attr("data-rapid_wind_timestamp")
    return {
        windDirection: windDirection,
        windAvg: windAvg,
        pageTimestamp: pageTimestamp,
        rapidWindTimestamp: rapidWindTimestamp,
    }
}

function iWindsurfParsePage(html) {
    const $ = cheerio.load(html)
    let cc = $("#current-conditions .spot-info-container")
    if (cc.length == 0) {
        throw new Error("No current conditions found - must be logged in!")
    }
    return {
        windDirection: windDirection,
        windAvg: windAvg,
        pageTimestamp: pageTimestamp,
        rapidWindTimestamp: rapidWindTimestamp,
    }
}

async function loginiWindsurf() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://secure.iwindsurf.com/", {
        waitUntil: "networkidle0",
    })
    let html = await page.content()
    await page.waitForSelector("#login-username")
    await page.type("#login-username", credentials.iwindsurf.username)
    await page.waitForSelector("#login-password")
    await page.type("#login-password", credentials.iwindsurf.password)

    await Promise.all([
        await page.click("input[type=submit]"),
        await page.waitForNavigation({ waitUntil: 'networkidle0' }) 
      ]);    

    // Now confirm
    let newContent = await page.content()
    let $ = cheerio.load(newContent)
    let username = $("#login-password")
    if (username.length == 0) {
        console.log("Login succeeded.")
        return true
    } else {
        console.error("Login FAILED")
        return false
    }
}

async function loginSite(url) {
    if (url.startsWith("https://wx.iwindsurf.com")) {
        return loginiWindsurf()
    } else {
        throw new Error("Unknown URL to login: " + url)
    }
}

function requiresLogin(url) {
    return (
        url.startsWith("https://wx.ikitesurf.com") ||
        url.startsWith("https://wx.iwindsurf.com")
    )
}

async function parseHtml(html, url) {
    if (url.startsWith("https://tempestwx.com")) {
        return tempestParsePage(html)
    } else if (
        url.startsWith("https://wx.ikitesurf.com") ||
        url.startsWith("https://wx.iwindsurf.com")
    ) {
        return iWindsurfParsePage(html)
    } else {
        throw new Error("Unknown URL to parse: " + url)
    }
}

async function main(locations) {
    for await (const location of locations) {
        let html = await getPage(location.url, false)
        let windData = parseHtml(html, location.url)
        console.log("Back from getPage: ", location.name, windData)
    }
}

let locations = [
    //{name: 'Waverlyish', url: 'https://tempestwx.com/station/105376/'},
    {
        name: "Golden Gardens Light 2",
        url: "https://wx.iwindsurf.com/spot/93975",
    },
]

function loadCredentials() {
    const credentialsPath = path.join("/Users/rrosen/dev/waboardsailing/windmap/.credentials.json") 

    try {
        const credentialsData = fs.readFileSync(credentialsPath, "utf-8")
        return JSON.parse(credentialsData)
    } catch (error) {
        console.error("Error loading credentials file:", error)
        return null // Or handle the error differently
    }
}

// main()
console.log("windmap/index.js running!")
const credentials = loadCredentials()
console.log("credentials", credentials)

await main(locations)
console.log("windmap/index.js done!")
