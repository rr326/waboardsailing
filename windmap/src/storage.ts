import { Sequelize, DataTypes, Model, Op, literal } from "sequelize"
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
            indexes: [
                {
                    unique: false,
                    fields: ["locationName"],
                },
                {
                    unique: false,
                    fields: ["dataTimestamp"],
                },
                {
                    name: "location_data_timestamp_index",
                    unique: false,
                    fields: ["locationName", "dataTimestamp"],
                },
            ],
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
            logger.debug("Database connected and synchronized")
        } catch (error) {
            logger.error("Error connecting or synchronizing: %O", error)
        }
    }
}

export async function getDB(debugLogging = false): Promise<Sequelize> {
    await initDB(debugLogging) // Ensure initialization on every call
    return sequelize
}

export async function storeWindData(location: string, data: WeatherData) {
    return await WindData.create({
        locationName: location,
        windDirection: data.windDirection,
        windAvg: data.windAvg,
        pageTimestamp: data.pageTimestamp,
        dataTimestamp: data.dataTimestamp,
    })
}

export async function getWindData() {
    let data = await WindData.findAll({
        order: [
            ["locationName", "ASC"],
            ["dataTimestamp", "DESC"],
            ["createdAt", "DESC"],
        ],
    })
    return data
}

export async function getLastestEachLocation(maxAge: number = 3600) {
    /**
     * Get the latest data for each location
     * @param maxAge - The maximum age of the data in seconds
     *
     * returns max 1 record per location
     *
     * Devnotes
     * I could not get this to work easily or efficiently. After a
     * ton of debugging, I got this two step process to work.
     *
     * My database is small and this is a testing corner case, so not important.
     */
    let maxCreatedAt = await WindData.findAll({
        attributes: [
            "id",
            "locationName",
            "dataTimestamp",
            [literal("MAX(createdAt)"), "maxCreatedAt"],
        ],
        group: ["locationName"],
        where: {
            // Make sure this is the same as below
            dataTimestamp: {
                [Op.gt]: new Date(Date.now() - maxAge * 1000),
            },
        },
    })

    let data = await WindData.findAll({
        where: {
            id: {
                [Op.in]: maxCreatedAt.map((r) => r.getDataValue("id")),
            },
            dataTimestamp: {
                [Op.gt]: new Date(Date.now() - maxAge * 1000),
            },
        },
        order: [
            ["locationName", "ASC"],
            ["dataTimestamp", "DESC"],
            ["createdAt", "DESC"],
        ],
    })

    return data
}

export async function debugQueries() {
    let allRecords = await getWindData()
    logger.debug(
        "\ngetWindData[0,20]\n" +
            JSON.stringify(allRecords.slice(0, 20), null, 4),
    )
    let latest = await getLastestEachLocation(100000000)
    logger.debug("\ngetLastestEachLocation\n" + JSON.stringify(latest, null, 4))
}
