import puppeteer, { Browser } from "puppeteer"
import { LocalStorage } from "node-localstorage"
import * as fs from 'fs';
import * as path from "path"
import * as cheerio from 'cheerio'


// If I'm in a browser, it is already defined.
localStorage = localStorage || new LocalStorage("./windmap/tmp")

const credentials = loadCredentials()
console.log("credentials", credentials)

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

async function loginiWindsurf(browser: Browser) {
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

async function loginSite(url: string, browser: Browser) {
    if (url.startsWith("https://wx.iwindsurf.com")) {
        return loginiWindsurf(browser)
    } else {
        throw new Error("Unknown URL to login: " + url)
    }
}

function requiresLogin(url: string) {
    return (
        url.startsWith("https://wx.ikitesurf.com") ||
        url.startsWith("https://wx.iwindsurf.com")
    )
}

export async function getLoggedinBrowser(url: string, headless = true): Promise<Browser> {
    let browser = await puppeteer.launch({ headless: headless })

    if (requiresLogin(url)) {
        let loggedIn = await loginSite(url, browser)
        if (!loggedIn) {
            throw new Error("Login failed for " + url)
        }
    }
    return browser
}
