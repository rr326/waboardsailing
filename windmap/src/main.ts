import { iKitesurfProcessor } from "./processiKitesurf.js"
import { TempestwxProcessor } from "./processTempestwx.js"
import yargs from "yargs/yargs"

async function main(locations: WindSite[]) {
    let pageProcessors = [new iKitesurfProcessor(), new TempestwxProcessor()]

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
console.log("windmap/main.js running!")

yargs(process.argv.slice(2))
    .scriptName("pirate-parser")
    .usage('$0 <cmd> [args]')
    .command('hello [name]', 'welcome ter yargs!', (yargs) => {
    yargs.positional('name', {
        type: 'string',
        default: 'Cambi',
        describe: 'the name to say hello to'
    })
    }, function (argv) {
    console.log('hello', argv.name, 'welcome to yargs!')
    })
    .help()
    .argv


// await main(locations)
console.log("windmap/main.js done!")
