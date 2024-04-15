import { SiteProcessor } from "./SiteProcessorClass.js"
import { Browser, Page } from "puppeteer"
import * as cheerio from "cheerio"
import { parse as parseDate } from "date-fns"

export class iKitesurfProcessor extends SiteProcessor {
    urlRegex: RegExp = new RegExp(
        "^https://(wx.ikitesurf.com|wx.iwindsurf.com)",
    )
    requiresLogin: boolean = true

    constructor() {
        super()
    }

    parseHtml(html: string): WeatherData {
        const $ = cheerio.load(html)
        let cc = $("#current-conditions .spot-info-container")
        if (cc.length == 0) {
            throw new Error("No current conditions found - must be logged in!")
        }
        let dateText = cc.find("div .jw-cc-data-date").text()
        let speedText = cc.find("div .jw-cc-data-speed").text()
        let speedMatch = speedText.match(
            /(\d+)\s(mph|)\s([a-zA-Z]+)\s\((.+)°\)/,
        )
        let date = parseDate(dateText, "d MMM h:mma", new Date())

        return {
            windDirection: speedMatch && parseInt(speedMatch[4]),
            windAvg: speedMatch && parseInt(speedMatch[1]),
            windSpeedText: speedText,
            pageTimestamp: new Date(),
            dataTimestamp: date,
        } as WeatherData
    }

    /**
     * Custom Login functions
     */

    async loginSite(url: string, browser: Browser, page: Page) {
        return this.loginiWindsurf(page)
    }

    async _loginiWindsurf(page: Page) {
        // This does one round of login
        const credentials = this.loadCredentials()
        await page.goto("https://secure.ikitesurf.com/?app=wx&rd=Search.aspx", {
            waitUntil: "networkidle0",
        })
        let html = await page.content()
        await page.waitForSelector("#login-username")
        await page.type("#login-username", credentials.iwindsurf.username)
        await page.waitForSelector("#login-password")
        await page.type("#login-password", credentials.iwindsurf.password)

        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle0" }),
            page.click("input[type=submit]"),
        ])

        return true
    }

    async _isLoggediniWindsurf(page: Page) {
        let html = await page.content()
        const $ = cheerio.load(html)
        let account = $(
            "#main-menu li a[href='https://secure.ikitesurf.com/account']",
        )
        return account.length > 0
    }

    async loginiWindsurf(page: Page) {
        // There is a bug in iWindsurf/iKitesurf - you have to login twice!
        // signin page: https://secure.ikitesurf.com/?app=wx&rd=Search.aspx
        // post-signin page: https://wx.ikitesurf.com/Search.aspx

        for (let i = 0; i < 2; i++) {
            await this._loginiWindsurf(page)
            if (await this._isLoggediniWindsurf(page)) {
                console.log("Login succeeded.")
                return true
            }
        }
        console.error("Login FAILED")
        return false
    }
}
