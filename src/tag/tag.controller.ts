import { Controller, Get } from '@nestjs/common';

@Controller('tag')
export class TagController {
  @Get()
  getAll(): Array<string> {
    return ['dungeon', 'master'];
  }
}
