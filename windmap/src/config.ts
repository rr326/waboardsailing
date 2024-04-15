import fs from "fs"
import YAML from "yaml"

export function getConfig() {
    const file = fs.readFileSync("./config.yaml", "utf-8")
    return YAML.parse(file)
}
