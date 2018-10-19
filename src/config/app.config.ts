export const APP_CONFIG = {
    PORT: process.env.app_port || 5000,
};

export const MYSQL_CONFIG = {
    CONNECTIONS: process.env.mysql_connections as string,
    DATABASE: process.env.mysql_database as string,
    PASSWORD: process.env.mysql_password as string,
    USER: process.env.mysql_user as string,
    HOST: process.env.mysql_host as string,
};
