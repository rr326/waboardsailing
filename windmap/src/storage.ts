import { Sequelize, DataTypes, Model } from "sequelize"
import { logger } from "./logging.js"

let sequelize: Sequelize // Store the connection instance

class WindData extends Model {
    declare id: number
    declare loccationName: string
    declare windDirection: number
    declare windAvg: number
    declare pageTimestamp: Date
    declare dataTimestamp: Date
}

function initModels(sequelize: Sequelize) {
    WindData.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            locationName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            windDirection: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            windAvg: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            pageTimestamp: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dataTimestamp: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "WindData",
        },
    )
}

async function initDB(debugLogging: boolean) {
    let dbLogger = null
    if (debugLogging) {
        dbLogger = (msg: string) => logger.debug(msg)
        //logger.debug.bind(logger), // Displays all messages
    } else {
        dbLogger = (msg: string) => {}
    }

    if (!sequelize) {
        // Initialize only if not already connected
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "./db.sqlite3",
            logging: dbLogger,
        })

        initModels(sequelize)
        try {
            await sequelize.authenticate()
            await sequelize.sync({ alter: true })
            console.log("Database connected and synchronized")
        } catch (error) {
            console.error("Error connecting or synchronizing:", error)
        }
    }
}

export function getDB(debugLogging = false): Sequelize {
    initDB(debugLogging) // Ensure initialization on every call
    return sequelize
}

export async function storeWindData(
    db: Sequelize,
    location: string,
    data: WeatherData,
) {
    return await WindData.create({
        locationName: location,
        windDirection: data.windDirection,
        windAvg: data.windAvg,
        pageTimestamp: data.pageTimestamp,
        dataTimestamp: data.dataTimestamp,
    })
}
