import { Module } from '@nestjs/common';
import { ErrorInterceptor } from './errorInterceptor';
import { HelperService } from './helper.provider';

@Module({
  providers: [HelperService, ErrorInterceptor],
  exports: [HelperService, ErrorInterceptor],
})
export class HelperModule {}
