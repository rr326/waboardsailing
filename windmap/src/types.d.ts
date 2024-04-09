type WindSite = {
    name: string
    url: string
}

// TODO: Cast these to appropriate types
interface WeatherData {
    windDirection: string | number
    windAvg: string | number
    pageTimestamp: string | number | Date
    rapidWindTimestamp: string | number | Date
}
