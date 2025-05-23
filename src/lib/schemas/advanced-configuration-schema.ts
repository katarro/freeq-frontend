import  z from 'zod';

export const advancedConfigurationSchema = z.object({
  // System Section
  appVersion: z.string().optional(),
  environment: z.enum(['development', 'staging', 'production']),
  debugMode: z.boolean().default(false),
  cacheEnabled: z.boolean().default(true),
  logLevel: z.enum(['error', 'warning', 'info', 'debug']),
  cronJobs: z.string().optional(),

  // Database Section
  dbHost: z.string().min(1, 'Database host is required'),
  dbPort: z.string().min(1, 'Database port is required'),
  dbName: z.string().min(1, 'Database name is required'),
  dbUser: z.string().min(1, 'Database user is required'),
  dbPassword: z.string().min(1, 'Database password is required'),
  dbBackup: z.boolean().default(true),
  backupRetention: z.coerce.number().min(1, 'Retention days must be at least 1'),

  // Storage Section
  storageType: z.enum(['local', 's3', 'gcs', 'azure']),
  s3Bucket: z.string().min(1, 'S3 bucket name is required'),
  s3Region: z.string().min(1, 'S3 region is required'),
  s3AccessKey: z.string().min(1, 'S3 access key is required'),
  s3SecretKey: z.string().min(1, 'S3 secret key is required'),
  fileCompression: z.boolean().default(true),
  maxFileSize: z.coerce.number().min(1, 'Max file size must be at least 1MB'),
});

export type AdvancedConfigurationValues = z.infer<typeof advancedConfigurationSchema>
