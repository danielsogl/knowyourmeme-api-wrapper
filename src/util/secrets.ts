import dotenv from 'dotenv';
import fs from 'fs';

import logger from './logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const REDIS_URL = process.env['REDIS_URL'];
