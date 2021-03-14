import {Connection, DataType} from "@craigmcc/ts-database";
import {Migration} from "@craigmcc/ts-migrate";

import {
    LIBRARIES_TABLE,
    ACTIVE_COLUMN,
    ID_COLUMN,
    NAME_COLUMN,
    NOTES_COLUMN,
    SCOPE_COLUMN,
} from "./Constants";

class CreateLibraries extends Migration {

    constructor() {
        super();
    }

    public async down(db: Connection): Promise<void> {
        console.info("CLDOWN: Begin");
        try {
            console.info("CLDOWN: Before dropTable()", db.connected);
            await db.dropTable(LIBRARIES_TABLE, {
                cascade: true,
                ifExists: true,
            });
            console.info("CLDOWN: After dropTable()", db.connected);
        } catch (error) {
            console.info("CLDOWN: dropTable() Error", error);
            throw error;
        }
        console.info("CLDOWN: End");
    }

    public async up(db: Connection): Promise<void> {
        console.info("CLUP: Begin");
        try {
            console.info("CLUP: Before addTable()", db.connected);
            await db.addTable(LIBRARIES_TABLE, [
                {name: ID_COLUMN, type: DataType.INTEGER, allowNull: false, primaryKey: true},
                {name: ACTIVE_COLUMN, type: DataType.BOOLEAN, allowNull: false, defaultValue: "true"},
                {name: NAME_COLUMN, type: DataType.STRING, allowNull: false},
                {name: NOTES_COLUMN, type: DataType.STRING, allowNull: true},
                {name: SCOPE_COLUMN, type: DataType.STRING, allowNull: false}
            ]);
            console.info("CLUP: After addTable()", db.connected);
        } catch (error) {
            console.info("CLUP: addTable() Error", error);
            throw error;
        } finally {
            console.info("CLUP: addTable() Finally", db.connected);
        }
        try {
            console.info("CLUP: Before addIndex()", db.connected);
            await db.addIndex(LIBRARIES_TABLE, {
                columnName: "name", unique: true
            });
            console.info("CLUP: After addIndex()", db.connected);
        } catch (error) {
            console.info("CLUP: addIndex() Error", error);
            throw error;
        } finally {
            console.info("CLUP: addIndex() Finally", db.connected);
        }
        console.info("CLUP: End");
    }
}

export default CreateLibraries;
