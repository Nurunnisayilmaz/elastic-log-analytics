# Elastic Log Analytics

## Problem

## Solution

## Features

### Analytics API
RESTful endpoints for real-time log analysis:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search/errors` | GET | Fetch error logs with time filtering |
| `/api/analytics/top-endpoints` | GET | Identify most-hit endpoints |
| `/api/analytics/slow-requests` | GET | Find requests exceeding threshold |
| `/api/analytics/overview` | GET | Dashboard overview with aggregations |

## Quick Start

### Installation & Setup

# Install API dependencies
cd api
npm install

# Install Producer dependencies
cd ../producer
npm install
cd ..
```

1. **Start infrastructure (Docker)**
```bash
docker-compose up -d
```

This starts:
- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601

2. **Generate and push logs**

Terminal 1 - Start the log producer:
```bash
cd producer
npm run dev
```

Terminal 2 - Push logs to Elasticsearch:
```bash
cd producer
npm run push-logs
```

Terminal 3 - Start the Analytics API:
```bash
cd api
npm run dev
```

The API will be available at: http://localhost:3000/api

### Usage Examples

**Get error logs from the last hour:**
```Postman
GET "http://localhost:3000/api/search/errors?lastMinutes=60"
```

**Find top 10 endpoints:**
```Postman
GET "http://localhost:3000/api/analytics/top-endpoints?lastMinutes=60"
```

**Find requests slower than 1 second:**
```Postman
GET "http://localhost:3000/api/analytics/slow-requests?threshold=1000&lastMinutes=60"
```

**Get dashboard overview:**
```Postman
GET "http://localhost:3000/api/analytics/overview?lastMinutes=60"
```

## Project Structure

```
elastic-log-analytics/
├── api/                          # Express REST API
│   ├── src/
│   │   ├── index.ts             # Express server setup
│   │   ├── esClient.ts          # Elasticsearch client configuration
│   │   ├── controllers/
│   │   │   └── log.controller.ts # Analytics endpoints
│   │   └── routes/
│   │       └── log.route.ts     # Route definitions
│   └── package.json
│
├── producer/                     # Log generation & ingestion
│   ├── src/
│   │   ├── index.ts             # Main producer loop
│   │   ├── logger.ts            # Fake log generation
│   │   ├── esPush.ts            # Push logs to Elasticsearch
│   │   └── types.ts             # TypeScript type definitions
│   └── package.json
│
├── elastic/                      # Elasticsearch configuration
│   ├── mapping.json             # Index mapping template
│   ├── ingest-pipeline.json     # Log enrichment pipeline
│   └── ilm-policy.json          # Lifecycle policy
│
├── filebeat/                     # Filebeat configuration
│   └── filebeat.yml             # Filebeat config
│
├── kibana/                       # Kibana configuration
│   └── dashboards.ndjson        # Pre-built dashboards
│
├── logs/                         # Generated logs directory
│   └── app.log                  # Application logs file
│
├── docker-compose.yml           # Container orchestration
└── README.md                    # This file
```

## Configuration

**Stop containers**
```bash
docker-compose down
```

**Clear data**
```bash
docker-compose down -v
```

**Access Elasticsearch directly**
```Terminal
http://localhost:9200/_cat/indices
```
