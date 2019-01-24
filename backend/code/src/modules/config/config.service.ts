import * as Joi from 'joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    // set environment variables in actual environment
    dotenv.config({ path: filePath });

    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = config;
    // this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      PORT: Joi.number().default(3000),
      API_AUTH_ENABLED: Joi.boolean().required(),
      JWT_SECRET_KEY: Joi.required(),
      TYPEORM_CONNECTION: Joi.string(),
      TYPEORM_HOST: Joi.string(),
      TYPEORM_PORT: Joi.string(),
      TYPEORM_DATABASE: Joi.string(),
      TYPEORM_USERNAME: Joi.string(),
      TYPEORM_PASSWORD: Joi.string(),
      TYPEORM_SYNCHRONIZE: Joi.string(),
      TYPEORM_LOGGING: Joi.string(),
      TYPEORM_MIGRATIONS_RUN: Joi.string(),

      TYPEORM_ENTITIES: Joi.string(),
      TYPEORM_MIGRATIONS: Joi.string(),
      TYPEORM_SUBSCRIBERS: Joi.string(),
      TYPEORM_ENTITIES_DIR: Joi.string(),
      TYPEORM_MIGRATIONS_DIR: Joi.string(),
      TYPEORM_SUBSCRIBERS_DIR: Joi.string(),

      SMTP_HOST: Joi.string(),
      SMTP_PORT: Joi.string(),
      SMTP_USER: Joi.string(),
      SMTP_PASSWORD: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Property getters
   */

  get isApiAuthEnabled(): boolean {
    return Boolean(this.envConfig.API_AUTH_ENABLED);
  }

  get nodeEnvironment(): string {
    return this.envConfig.NODE_ENV;
  }

  get jwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }
  get jwtExpiryTime(): number {
    return Number(this.envConfig.JWT_EXPIRE_TIME);
  }
}
