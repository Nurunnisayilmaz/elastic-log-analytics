import { Request, Response } from 'express';
import { esClient } from '../esClient';
import { AppLog } from '../types/log';

export class LogController {

  // GET /search/logs
  static async searchLogs(req: Request, res: Response) {
    try {
      const {
        service,
        level,
        message,
        q,
        lastMinutes,
        page,
        pageSize,
      } = req.query;

      const pageNumber =
        typeof page === 'string' && Number(page) > 0 ? Number(page) : 1;

      const size =
        typeof pageSize === 'string' && Number(pageSize) > 0
          ? Number(pageSize)
          : 20;

      const from = (pageNumber - 1) * size;

      const mustQueries: any[] = [];

      if (service) {
        mustQueries.push({
          prefix: {
            service_name: service,
          },
        });
      }

      if (level) {
        mustQueries.push({ term: { level } });
      }

      if (message) {
        mustQueries.push({
          match: {
            message: {
              query: message,
              operator: 'and',
            },
          },
        });
      }

      if (q) {
        mustQueries.push({
          multi_match: {
            query: q,
            fields: [
              'message',
              'endpoint.text',
            ],
            type: 'phrase_prefix',
          },
        });
      }

      if (lastMinutes) {
        mustQueries.push({
          range: {
            '@timestamp': {
              gte: `now-${Number(lastMinutes)}m`,
            },
          },
        });
      }

      const response = await esClient.search<AppLog>({
        index: 'logs-app-*',
        from,
        size,
        sort: [{ '@timestamp': 'desc' }],
        query: {
          bool: {
            must: mustQueries.length ? mustQueries : [{ match_all: {} }],
          },
        },
        highlight: {
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
          fields: {
            message: {},
            'endpoint.text': {},
          },
        },
      });

      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : response.hits.total?.value ?? 0;

      const logs = response.hits.hits.map(hit => ({
        id: hit._id,
        ...(hit._source as AppLog),
        highlight: hit.highlight || {},
      }));

      res.json({
        page: pageNumber,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size),
        count: logs.length,
        logs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  // GET /search/errors?lastMinutes=60
  static async getErrors(req: Request, res: Response) {
    try {
      const lastMinutes = Number(req.query.lastMinutes) || 60;

      const response = await esClient.search({
        index: 'logs-app-*',
        size: 100,
        sort: [{ '@timestamp': 'desc' }],
        query: {
          bool: {
            must: [
              { term: { level: 'ERROR' } },
              {
                range: {
                  '@timestamp': {
                    gte: `now-${lastMinutes}m`,
                  },
                },
              },
            ],
          },
        },
      });

      const logs = response.hits.hits.map(hit => hit._source);

      res.json({
        count: logs.length,
        logs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch error logs' });
    }
  }

  // GET /analytics/top-endpoints?lastMinutes=60
  static async getTopEndpoints(req: Request, res: Response) {
    try {
      const lastMinutes = Number(req.query.lastMinutes) || 60;

      const response = await esClient.search({
        index: 'logs-app-*',
        size: 0,
        query: {
          range: {
            '@timestamp': {
              gte: `now-${lastMinutes}m`,
            },
          },
        },
        aggregations: {
          top_endpoints: {
            terms: {
              field: 'endpoint.keyword',
              size: 10,
            },
          },
        },
      });

      const buckets =
        (response.aggregations?.top_endpoints as {
          buckets: { key: string; doc_count: number }[];
        })?.buckets ?? [];

      res.json(buckets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch top endpoints' });
    }
  }

  // GET /analytics/slow-requests?threshold=1000&lastMinutes=60
  static async getSlowRequests(req: Request, res: Response) {
    try {
      const threshold = Number(req.query.threshold) || 1000;
      const lastMinutes = Number(req.query.lastMinutes) || 60;

      const response = await esClient.search({
        index: 'logs-app-*',
        size: 100,
        sort: [{ response_time: 'desc' }],
        query: {
          bool: {
            must: [
              {
                range: {
                  response_time: {
                    gte: threshold,
                  },
                },
              },
              {
                range: {
                  '@timestamp': {
                    gte: `now-${lastMinutes}m`,
                  },
                },
              },
            ],
          },
        },
      });

      const logs = response.hits.hits.map(hit => hit._source);

      res.json({
        count: logs.length,
        logs,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch slow requests' });
    }
  }

  // GET /analytics/overview?lastMinutes=60
  static async getOverview(req: Request, res: Response) {
    const lastMinutes = Number(req.query.lastMinutes) || 60;

    const result = await esClient.search({
      index: 'logs-app-*',
      size: 0,
      query: {
        range: {
          '@timestamp': {
            gte: `now-${lastMinutes}m`,
          },
        },
      },
      aggs: {
        total_logs: {
          value_count: { field: '@timestamp' },
        },
        error_logs: {
          filter: {
            term: { level: 'ERROR' },
          },
        },
        avg_response_time: {
          avg: { field: 'response_time' },
        },
        logs_over_time: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: '5m',
          },
        },
        top_services: {
          terms: {
            field: 'service_name',
            size: 5,
          },
        },
      },
    });

    const aggs: any = result.aggregations;

    const totalLogs = aggs.total_logs.value || 0;
    const errorLogs = aggs.error_logs.doc_count || 0;

    res.json({
      totalLogs,
      errorRate:
        totalLogs === 0
          ? '0%'
          : `${((errorLogs / totalLogs) * 100).toFixed(2)}%`,
      avgResponseTime: Math.round(aggs.avg_response_time.value || 0),
      logsOverTime: aggs.logs_over_time.buckets,
      topServices: aggs.top_services.buckets,
    });
  }
}