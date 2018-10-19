import mysql, { PoolConnection, Pool, MysqlError, PoolConfig } from 'mysql';

export class MySqlDatabase {
    public readonly pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = mysql.createPool(config);
    }

    public async query(queryStr: string, values: any[]): Promise<any> {
        const connection = await this.getConnection();

        return new Promise((resolve, reject) => {
            connection.query(queryStr, values, (err: MysqlError | null, results: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            });
        });
    }

    private getConnection(): Promise<PoolConnection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: MysqlError, connection: PoolConnection) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(connection);
            });
        });
    }
}
