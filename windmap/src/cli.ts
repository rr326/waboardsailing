import yargs, { Argv } from "yargs"
import { hideBin } from "yargs/helpers"

interface CliArgs {
    debug: boolean
    cache: boolean
}

export function cli(): CliArgs {
    const argv = yargs(hideBin(process.argv))
        .usage(
            "$0",
            "This will download wind data from iKitesurf and Tempestwx",
        )
        .options({
            debug: {
                type: "boolean",
                description: "Enable debug mode",
                default: false,
            },
        })
        .options({
            cache: {
                type: "boolean",
                description: "Use cached data",
                default: true,
            },
        })
        .showHelpOnFail(true)
        .parseSync() // Use parseSync() for better error handling within a script
    return argv
}
