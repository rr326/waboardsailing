import { iKitesurfProcessor } from "./processiKitesurf.js"
import { TempestwxProcessor } from "./processTempestwx.js"
import { cli } from "./cli.js"
import { setLoglevel, logger } from "./logging.js"
import { getConfig } from "./config.js"
import {getDB} from "./storage.js"

async function main(locations: WindSite[], debug: boolean, cache: boolean) {
    let pageProcessors = [
        new iKitesurfProcessor(debug, cache),
        new TempestwxProcessor(debug, cache),
    ]

    for await (const location of locations) {
        for (const processor of pageProcessors) {
            if (processor.handleUrl(location.url)) {
                let windData = await processor.processPage(location.url)
                logger.info(
                    `Processed: ${processor.constructor.name}\nLocation: ${location.name}\n%O`,
                    windData,
                )
            }
        }
    }
}

// main()
logger.info("windmap running")
let argv = cli()
const config = getConfig()
if (!config || !config.WindSites) {
    logger.error("No WindSites found in config. config: %O", config)
    process.exit(1)
}
const locations = config.WindSites as WindSite[]
logger.debug("config: %O", config)

setLoglevel(argv.debug ? "debug" : "info")
logger.debug("Command line arguments: %O", argv)
let db = getDB()

//await main(locations, argv.debug, argv.cache)
logger.info("windmap complete")
