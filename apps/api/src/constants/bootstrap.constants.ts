import { VersioningType } from '@nestjs/common';
import { VersioningOptions } from '@nestjs/common/interfaces';

export const helmetDevelopmentConfig = {
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [
        `'self'`,
        'data:',
        'apollo-server-landing-page.cdn.apollographql.com',
      ],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [
        `'self'`,
        'apollo-server-landing-page.cdn.apollographql.com',
      ],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
};

export const versioningConfig = {
  type: VersioningType.URI,
  defaultVersion: '1',
  prefix: 'v',
} as VersioningOptions;
