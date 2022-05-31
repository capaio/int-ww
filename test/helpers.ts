import { getConnection } from "typeorm";

export const clearDb = async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = await getConnection().getRepository(entity.name);
    console.log(`TRUNCATE ${entity.tableName} ;`);
    await repository.query(`SET FOREIGN_KEY_CHECKS = 0; `);
    await repository.query(`TRUNCATE ${entity.tableName} ; `);
    await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
};
