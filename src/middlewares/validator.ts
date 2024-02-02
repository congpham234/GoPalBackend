import * as OpenApiValidator from 'express-openapi-validator';

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: './openapi-spec.json',
  validateRequests: true,
  validateResponses: true,
  validateApiSpec: true,
  ignorePaths: /\/api-docs/,
});
