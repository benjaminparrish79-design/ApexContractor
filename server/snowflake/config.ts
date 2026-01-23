import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const snowflakeConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT || 'PVZKANA-GUC20741',
  user: process.env.SNOWFLAKE_USER || 'APEXCONTRACTOR',
  password: process.env.SNOWFLAKE_PASSWORD || '',
  warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH',
  database: process.env.SNOWFLAKE_DATABASE || 'APEXCONTRACTOR_DB',
  schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
};

let connection: any = null;

export async function getSnowflakeConnection() {
  if (connection) {
    return connection;
  }

  return new Promise((resolve, reject) => {
    connection = snowflake.createConnection({
      account: snowflakeConfig.account,
      user: snowflakeConfig.user,
      password: snowflakeConfig.password,
      warehouse: snowflakeConfig.warehouse,
      database: snowflakeConfig.database,
      schema: snowflakeConfig.schema,
    });

    connection.connect((err: any) => {
      if (err) {
        console.error('[Snowflake] Connection failed:', err);
        reject(err);
      } else {
        console.log('[Snowflake] Connected successfully');
        resolve(connection);
      }
    });
  });
}

export async function executeSnowflakeQuery(query: string, params: any[] = []) {
  try {
    const conn = await getSnowflakeConnection();
    
    return new Promise((resolve, reject) => {
      conn.execute({
        sqlText: query,
        binds: params,
        complete: (err: any, stmt: any, rows: any) => {
          if (err) {
            console.error('[Snowflake] Query failed:', err);
            reject(err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  } catch (error) {
    console.error('[Snowflake] Execution error:', error);
    throw error;
  }
}

export async function closeSnowflakeConnection() {
  if (connection) {
    return new Promise((resolve, reject) => {
      connection.destroy((err: any) => {
        if (err) {
          console.error('[Snowflake] Disconnect failed:', err);
          reject(err);
        } else {
          console.log('[Snowflake] Disconnected');
          connection = null;
          resolve(true);
        }
      });
    });
  }
}
