import { AppLog, LogLevel } from './types';
import { faker } from '@faker-js/faker';

const services = ['auth-service', 'user-service', 'payment-service'];
const endpoints = ['/api/login', '/api/register', '/api/pay', '/api/profile'];

export function generateLog(): AppLog {
  const level: LogLevel = faker.helpers.arrayElement(['INFO','WARN','ERROR']);
  const response_time = faker.number.int({ min: 50, max: 2000 }); // <-- burası değişti
  const status_code = level === 'ERROR' ? 500 : level === 'WARN' ? 400 : 200;

  return {
    '@timestamp': new Date().toISOString(),
    level,
    service_name: faker.helpers.arrayElement(services),
    endpoint: faker.helpers.arrayElement(endpoints),
    response_time,
    status_code,
    user_id: `u_${faker.number.int({ min: 1000, max: 9999 })}`,
    message: faker.hacker.phrase()
  };
}