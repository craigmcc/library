import { Connection } from "@craigmcc/ts-database";
import { MigrationData } from "@craigmcc/ts-migrate";

exports.down = async (data: MigrationData, context: Connection): Promise<void> => {
        console.info("CreateAuthors.down() not yet implemented");
    }

exports.up = async (data: MigrationData, context: Connection): Promise<void> => {
        console.info("CreateAuthors.up() not yet implemented");
    }
