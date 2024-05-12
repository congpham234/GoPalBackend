// Map definition with correct syntax

export enum Stage {
  ALPHA = 'alpha',
  PROD = 'prod',
}

export enum Region {
  US_EAST_1 = 'us-east-1',
  EU_WEST_1 = 'eu-west-1',
  US_WEST_2 = 'us-west-2',
}

export enum Realm {
  NA = 'NA',
  EU = 'EU',
  FE = 'FE',
}

export const ALLOW_ORIGIN_STAGE_MAP = new Map<string, string[]>([
  [
    Stage.ALPHA,
    ['http://localhost:3000', 'https://d2v9cv67ztousb.cloudfront.net'],
  ],
]);
