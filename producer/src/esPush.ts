import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';

const client = new Client({ node: 'http://localhost:9200' });

async function pushLogs() {
  try {
    const logFile = path.join(__dirname, '../../logs/app.log');
    if (!fs.existsSync(logFile)) {
      console.error('Log file not found:', logFile);
      return;
    }

    const logs = fs.readFileSync(logFile, 'utf-8')
      .split('\n')
      .filter(Boolean);

    if (logs.length === 0) {
      console.log('Log file is empty');
      return;
    }

    console.log(`Sending ${logs.length} logs to Elasticsearch...`);

    for (const logLine of logs) {
      const log = JSON.parse(logLine);

      await client.index({
        index: `logs-app-${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}`,
        document: log
        // pipeline: 'log-enrichment' // Uncomment if you have a pipeline
      });
    }

    console.log('All logs have been sent to Elasticsearch!');
  } catch (err) {
    console.error('Error:', err);
  }
}

pushLogs();