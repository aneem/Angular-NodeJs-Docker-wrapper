import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as lusca from 'lusca';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Initialize Swagger for API docs
   */

  const options = new DocumentBuilder()
    .setTitle('Calorie Meter')
    .setDescription('Calorie Meter API description')
    .setBasePath('api')
    .setVersion('1.0')
    .addTag('User', 'Api related to user administaration')
    .addTag('Authentication', 'Api related to user authentication')
    .addTag('Meal', 'Api related to user meal')
    .setContactEmail('aneempp@gmail.com')
    .addBearerAuth('Authorization', 'header', 'apiKey')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  /**
   * Compression for gzipping response
   */
  app.use(compression());

  /**
   * Api Logger [Morgan]
   */
  app.use(morgan('dev'));

  /**
   * Enable Helmet for security
   */
  app.use(helmet());

  /**
   * Enable CORS
   */
  app.enableCors();

  /**
   * Enable rate limiting
   */
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  /**
   * CSRF protection
   */
  // app.use(csurf());
  // app.use(lusca.xframe("SAMEORIGIN"));
  // app.use(lusca.xssProtection(true));

  await app.listen(3000);
}
bootstrap();
