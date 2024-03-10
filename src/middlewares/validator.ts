import { middleware } from 'express-openapi-validator';

export const openApiValidator = middleware({
  apiSpec: './openapi-spec.json',
  validateRequests: true,
  validateResponses: true,
  validateApiSpec: true,
  ignorePaths: /\/api-docs/,
});
