import puppeteer from "puppeteer"
import * as cheerio from "cheerio"
import { getLoggedinBrowser } from "./login.js"

async function fetchPageRaw(pageUrl: string) {
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

async function fetchPageJS(pageUrl: string) {
    const browser = await getLoggedinBrowser(pageUrl)
    const page = await browser.newPage()
    await page.goto(pageUrl, { waitUntil: "networkidle0" })
    await new Promise((r) => setTimeout(r, 1000)) // wait for JS to load. 1 s enough?
    let html = await page.content()
    return html
}

export async function getPage(pageUrl: string, useCache = false) {
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

function tempestParsePage(html: string) {
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
    } as WeatherData
}

function iWindsurfParsePage(html: string) {
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
    } as WeatherData
}

export async function parseHtml(html: string, url: string) {
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
