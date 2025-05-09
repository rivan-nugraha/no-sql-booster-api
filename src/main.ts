import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { resolve } from 'path';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import helmet from 'helmet';
import { CustomLogger } from './infra/logger/logger';
import { AllExceptionFilter } from './core/base/http/base-http-exception.filter';
import { DebugLoggerInterceptor } from './core/interceptor/debug-logger.interceptor';
import * as os from 'os';

async function bootstrap() {
  const httpsMode = !!Number(process.env.HTTPS_MODE);
  const secureOptions: NestApplicationOptions =
    generateHttpsModeOption(httpsMode);

  const app = await NestFactory.create(AppModule, {
    ...secureOptions,
    logger: new CustomLogger(),
    cors: true, // change this to Client IP when Production
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new DebugLoggerInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  app.use(helmet());

  const port = process.env.PORT;
  const host = '0.0.0.0';
  const logger = new Logger('NestBoilerplate');

  await app.listen(port, host, () => {
    logger.log(`Application Started at port: ${port}, httpsMode: ${httpsMode}`);
    if (process.env.MODE == 'DEVELOPMENT')
      logger.log(`Current IP: ${getLocalIP()}`);
  });
}

function generateHttpsModeOption(httpsMode: boolean): NestApplicationOptions {
  if (httpsMode) {
    /**
     * Enter Your Https Certificate using below code
     *
     * @hint make sure you set 'HTTPS_MODE' field in env file to 1
     * @tips recommended for using absolute root path (/)
     * @optional __dirname + path/to/file
     */

    const privateKey = fs.readFileSync(
      resolve('/home/cert/private.key'),
      'utf-8',
    );
    const certificate = fs.readFileSync(
      resolve('/home/cert/certificate.crt'),
      'utf-8',
    );

    const credentials: HttpsOptions = {
      key: privateKey,
      cert: certificate,
      passphrase: '??',
    };
    return { httpsOptions: credentials };
  }
  return {};
}

function getLocalIP () {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]!) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}


bootstrap();
