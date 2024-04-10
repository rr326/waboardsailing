type WindSite = {
    name: string
    url: string
}

// TODO: Cast these to appropriate types
interface WeatherData {
    windDirection: number | null
    windAvg: number | null
    windSpeedText: string
    pageTimestamp: Date | null
    dataTimestamp: Date | null
    [extraProp: string]: any
}
