async function _loginiWindsurf(page: Page) {
    // This does one round of login
    const credentials = loadCredentials()
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

async function _isLoggediniWindsurf(page: Page) {
    let html = await page.content()
    const $ = cheerio.load(html)
    let account = $(
        "#main-menu li a[href='https://secure.ikitesurf.com/account']",
    )
    return account.length > 0
}
async function loginiWindsurf(page: Page) {
    // There is a bug in iWindsurf/iKitesurf - you have to login twice!
    // signin page: https://secure.ikitesurf.com/?app=wx&rd=Search.aspx
    // post-signin page: https://wx.ikitesurf.com/Search.aspx

    for (let i = 0; i < 2; i++) {
        await _loginiWindsurf(page)
        if (await _isLoggediniWindsurf(page)) {
            console.log("Login succeeded.")
            return true
        }
    }
    console.error("Login FAILED")
    return false
}

async function loginSite(url: string, browser: Browser, page: Page) {
    if (
        url.startsWith("https://wx.iwindsurf.com") ||
        url.startsWith("https://wx.ikitesurf.com")
    ) {
        return loginiWindsurf(page)
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
