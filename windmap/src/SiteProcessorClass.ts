import puppeteer, { Browser, Page } from "puppeteer"
import { LocalStorage } from "node-localstorage"
import * as fs from "fs"
import * as path from "path"
import { logger } from "./logging.js"

const localStorage = new LocalStorage("./tmp")

export class SiteProcessor {
    urlRegex: RegExp = new RegExp("^https://")
    requiresLogin: boolean = false
    debug: boolean
    useCache: boolean

    constructor(debug: boolean, useCache: boolean) {
        this.debug = debug
        this.useCache = useCache
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
        let data: WeatherData = {
            windDirection: 0,
            windAvg: 0,
            windSpeedText: "0",
            pageTimestamp: new Date(),
            dataTimestamp: new Date(),
        }
        return data
    }
    /**
     * Support functions
     */

    async fetchPage(url: string): Promise<string> {
        logger.debug("Fetching page: ", url)
        return await this._getPage(url)
    }

    handleUrl(url: string): boolean {
        logger.debug(
            `${this.constructor.name}.handleUrl(): (${url}) => (${this.urlRegex.test(url)})`,
        )
        return this.urlRegex.test(url)
    }

    async _fetchPageRaw(pageUrl: string): Promise<string | null> {
        let response = null,
            body = null
        logger.info(`fetching ${pageUrl}`)
        try {
            response = await fetch(pageUrl)
            if (response.ok) {
                logger.info(`got page response ${pageUrl}`)
                body = await response.text()
                logger.info(`got body ${pageUrl}`)
            } else {
                throw new Error("Network response was not ok.")
            }
        } catch (error) {
            logger.error(`Error fetching ${error}`)
        } finally {
            return body
        }
    }

    async _fetchPageJS(pageUrl: string) {
        const [browser, page] = await this._getLoggedinBrowser(pageUrl)
        await page.goto(pageUrl, { waitUntil: "networkidle0" })

        // await new Promise((r) => setTimeout(r, 1000)) // wait for JS to load. 1 s enough?
        let html = await page.content()
        await browser.close()
        return html
    }

    async _getPage(pageUrl: string) {
        logger.info(`getpage ${pageUrl}`)
        let page = localStorage.getItem(pageUrl)
        if (this.useCache && page) {
            logger.info(`got page from local storage ${pageUrl}`)
        } else {
            page = await this._fetchPageJS(pageUrl)
            localStorage.setItem(pageUrl, page)
            logger.info(
                `got page from fetch and saved to local storage: ${pageUrl}`,
            )
        }
        return page
    }

    async _getLoggedinBrowser(
        url: string,
        headless = false,
    ): Promise<[Browser, Page]> {
        let browser = await puppeteer.launch({ headless: headless })
        let page = await browser.newPage()

        if (this.requiresLogin) {
            let loggedIn = await this.loginSite(url, browser, page)
            if (!loggedIn) {
                throw new Error("Login failed for " + url)
            }
        }
        return [browser, page]
    }

    async processPage(url: string): Promise<WeatherData | null> {
        if (this.handleUrl(url)) {
            try {
                logger.debug("Processing page: ", url)
                let html = await this.fetchPage(url)
                let data = this.parseHtml(html)
                return data
            } catch (e) {
                logger.error(`Error processing page: ${url} - ${e}`)
                return null
            }
        } else {
            return null
        }
    }

    loadCredentials() {
        const credentialsPath = path.join(
            "/Users/rrosen/dev/waboardsailing/windmap/.credentials.json",
        )

        try {
            const credentialsData = fs.readFileSync(credentialsPath, "utf-8")
            return JSON.parse(credentialsData)
        } catch (error) {
            logger.error(`Error loading credentials file: ${error}`)
            return null // Or handle the error differently
        }
    }
}
