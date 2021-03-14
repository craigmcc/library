import {Connection, DataType} from "@craigmcc/ts-database";

import {
    AUTHORS_TABLE,
    LIBRARIES_TABLE,
    ACTIVE_COLUMN,
    ID_COLUMN,
    FIRST_NAME_COLUMN,
    LAST_NAME_COLUMN,
    LIBRARY_ID_COLUMN,
    NOTES_COLUMN,
} from "./Constants";

export const down = async (db: Connection): Promise<void> =>
{
    console.info("CADOWN: Before dropTable()", db.connected);
    try {
        await db.dropTable(AUTHORS_TABLE, {
            cascade: true,
            ifExists: true,
        });
    } catch (error) {
        console.info("CADOWN: dropTable() Error", error);
        throw error;
    }
    console.info("CADOWN: After dropTable()", db.connected);
}

export const up = async (db: Connection): Promise<void> =>{
    console.info("CAUP: Before addTable()", db.connected);
    try {
        await db.addTable(AUTHORS_TABLE, [
            {name: ID_COLUMN, type: DataType.INTEGER, allowNull: false, primaryKey: true},
            {name: ACTIVE_COLUMN, type: DataType.BOOLEAN, allowNull: false, defaultValue: "true"},
            {name: FIRST_NAME_COLUMN, type: DataType.STRING, allowNull: false},
            {name: LAST_NAME_COLUMN, type: DataType.STRING, allowNull: false},
            {name: LIBRARY_ID_COLUMN, type: DataType.INTEGER, allowNull: false},
            {name: NOTES_COLUMN, type: DataType.STRING, allowNull: true},
        ]);
    } catch (error) {
        console.info("CAUP: addTable() Error", error);
        throw error;
    } finally {
        console.info("CAUP: addTable() Finally", db.connected);
    }
    console.info("CAUP: After addTable()", db.connected);
    try {
        await db.addIndex(AUTHORS_TABLE, {
            columnName: [
                LIBRARY_ID_COLUMN,
                LAST_NAME_COLUMN,
                FIRST_NAME_COLUMN
            ],
            unique: false,
        });
    } catch (error) {
        console.info("CAUP: addIndex() Error", error);
        throw error;
    } finally {
        console.info("CAUP: addIndex() Finally", db.connected);
    }
    console.info("CAUP: After addIndex()", db.connected);
    try {
        await db.addForeignKey(AUTHORS_TABLE, LIBRARY_ID_COLUMN,
            {
                tableName: LIBRARIES_TABLE,
                columnName: ID_COLUMN,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });
    } catch (error) {
        console.info("CAUP: addForeignKey() Error", error);
        throw error;
    } finally {
        console.info("CAUP: addForeignKey() Finally", db.connected);
    }
    console.info("CAUP: After addForeignKey()", db.connected);
}
