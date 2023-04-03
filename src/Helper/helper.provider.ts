import { Injectable } from '@nestjs/common/decorators';
import * as fs from 'fs';
import { resolve } from 'path';

@Injectable()
export class HelperService {
  constructor() {}

  async deleteUploadedImage(filePath: string) {
    return await fs.unlink(filePath, () => resolve());
  }
}
