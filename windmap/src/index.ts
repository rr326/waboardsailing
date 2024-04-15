import { iKitesurfProcessor } from "./processiKitesurf.js"
import { TempestwxProcessor } from "./processTempestwx.js"


async function main(locations: WindSite[]) {
    let pageProcessors = [new iKitesurfProcessor(), new TempestwxProcessor()]

    for await (const location of locations) {
        for (const processor of pageProcessors) {
            let windData = await processor.processPage(location.url)
            console.log(`Back from ${processor.constructor.name}.processPage(): `, location.name, windData)
        }

    }
}

let locations: WindSite[] = [
    {
        name: "Waverlyish",
        url: "https://tempestwx.com/station/105376/",
    },
    // {
    //     name: "Golden Gardens Light 2",
    //     url: "https://wx.ikitesurf.com/spot/93975",
    // },
]

// main()
console.log("windmap/index.js running!")
await main(locations)
console.log("windmap/index.js done!")
