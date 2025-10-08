import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getAppInfo() {
    return {
      name: this.configService.get('APP_NAME') || 'E-Commerce Platform',
      version: this.configService.get('APP_VERSION') || '1.0.0',
      environment: this.configService.get('NODE_ENV') || 'development',
      docs: this.configService.get('NODE_ENV') === 'development' ? '/docs' : null,
    };
  }

  getHealthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV'),
    };
  }
}

