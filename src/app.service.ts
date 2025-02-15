import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Worrld!';
  }

  firstHiInProject(): string {
    return 'First Hi Project!';
  }
}
