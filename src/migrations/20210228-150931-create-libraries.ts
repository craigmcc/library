import { Connection } from "@craigmcc/ts-database";
import { Migration, MigrationData } from "@craigmcc/ts-migrate";

class CreateLibraries extends Migration {

    constructor() {
        super();
    }

    public async down(data: MigrationData, context: Connection): Promise<void> {
        console.info("CreateLibraries.down() not yet implemented");
    }

    public async up(data: MigrationData, context: Connection): Promise<void> {
        console.info("CreateLibraries.up() not yet implemented");
    }

}

export default CreateLibraries;
