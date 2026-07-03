import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/ask')
  ask(@Body('question') question: string) {
    console.log('askQuestion called');

    return this.appService.askQuestion(question);
  }
}
