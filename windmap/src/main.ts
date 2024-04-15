import { iKitesurfProcessor } from "./processiKitesurf.js"
import { TempestwxProcessor } from "./processTempestwx.js"
import { cli } from "./cli.js"

async function main(locations: WindSite[], debug: boolean, cache: boolean) {
    let pageProcessors = [
        new iKitesurfProcessor(debug, cache),
        new TempestwxProcessor(debug, cache),
    ]

    for await (const location of locations) {
        for (const processor of pageProcessors) {
            if (processor.handleUrl(location.url)) {
                let windData = await processor.processPage(location.url)
                console.log(
                    `Back from ${processor.constructor.name}.processPage(): `,
                    location.name,
                    windData,
                )
            }
        }
    }
}

let locations: WindSite[] = [
    {
        name: "Waverlyish",
        url: "https://tempestwx.com/station/105376/",
    },
    {
        name: "Golden Gardens Light 2",
        url: "https://wx.ikitesurf.com/spot/93975",
    },
]

// main()
console.log("windmap/main.js running!")
let argv = cli()
console.log("Command line arguments:", argv)

await main(locations, argv.debug, argv.cache)
console.log("windmap/main.js done!")
