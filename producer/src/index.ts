import { generateLog } from './logger';
import fs from 'fs';
import path from 'path';

const logFile = path.join(__dirname, '../../logs/app.log');

function writeLog(log: any) {
  fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
}

function startProducer(interval = 1000) {
  setInterval(() => {
    const log = generateLog();
    writeLog(log);
    console.log('Log produced:', log);
  }, interval);
}

startProducer();