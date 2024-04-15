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


async function initDB() {
    if (!sequelize) {
        // Initialize only if not already connected
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "./db.sqlite3",
            logging: logger.debug.bind(logger)
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

export function getDB() {
    initDB() // Ensure initialization on every call
    return sequelize
}
