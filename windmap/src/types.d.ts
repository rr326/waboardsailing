type WindSite = {
    name: string
    url: string
}

// TODO: Cast these to appropriate types
interface WeatherData {
    windDirection:  number
    windAvg: number
    windSpeedText: string
    pageTimestamp: Date
    dataTimestamp: Date
    [extraProp: string]: any
}
