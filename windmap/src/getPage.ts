import puppeteer from "puppeteer"
import * as cheerio from "cheerio"
import { getLoggedinBrowser } from "./login.js"
import { LocalStorage } from "node-localstorage"
import { parse as parseDate } from "date-fns"

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
    let dateText = cc.find("div .jw-cc-data-date").text()
    let speedText = cc.find("div .jw-cc-data-speed").text()
    let speedMatch = speedText.match(/(\d+)\s(mph|)\s([a-zA-Z]+)\s\((.+)°\)/)
    let date = parseDate(dateText, "d MMM h:mma", new Date())

    return {
        windDirection: parseInt(speedMatch[4]),
        windAvg: parseInt(speedMatch[1]),
        windSpeedText: speedText,
        pageTimestamp: new Date(),
        dataTimestamp: date,
    } as WeatherData
}
