import { Browser, Page } from "puppeteer"
import * as cheerio from "cheerio"
import { LocalStorage } from "node-localstorage"
import { SiteProcessor } from "./SiteProcessorClass.js"

const localStorage = new LocalStorage("./tmp")

export class TempestwxProcessor extends SiteProcessor {
    urlRegex: RegExp = new RegExp("^https://tempestwx.com")
    requiresLogin: boolean = false

    constructor() {
        super()
    }

    /**
     * Customize these functions
     */

    async loginSite(
        url: string,
        browser: Browser,
        page: Page,
    ): Promise<boolean> {
        // The page context will be set
        throw new Error("Not implemented")
    }

    parseHtml(html: string): WeatherData {
        const $ = cheerio.load(html)
        let ccWind = $("#cc-wind")
        let windDirection = ccWind
            .find(".wind-direction-icon")
            .attr("data-wind-direction")
        let windAvg = ccWind.find("span[data-param=wind_avg]").text()
        let dataTimestamp = $("#list-summary-view")
            .find("span[data-param=timestamp]")
            .text()
        let rapidWindTimestamp = ccWind.attr("data-rapid_wind_timestamp")
        return {
            windDirection: windDirection && parseInt(windDirection),
            windAvg: parseInt(windAvg),
            windSpeedText: windAvg,
            pageTimestamp: new Date(),
            dataTimestamp:
                rapidWindTimestamp &&
                new Date(parseInt(rapidWindTimestamp) * 1000),
        } as WeatherData
    }
}
