import { getPage, parseHtml } from "./getPage.js"

async function main(locations: WindSite[]) {
    for await (const location of locations) {
        let html = await getPage(location.url, false)
        let windData = parseHtml(html, location.url)
        console.log("Back from getPage: ", location.name, windData)
    }
}

let locations: WindSite[] = [
    // {
    //     name: "Waverlyish",
    //     url: "https://tempestwx.com/station/105376/",
    // },
    {
        name: "Golden Gardens Light 2",
        url: "https://wx.ikitesurf.com/spot/93975",
    },
]

// main()
console.log("windmap/index.js running!")
await main(locations)
console.log("windmap/index.js done!")
