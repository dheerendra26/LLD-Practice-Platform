import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAttemptDto } from './dto/create-attempt.dto.js';
import { AttemptsService } from './attempts.service.js';

@ApiTags('Attempts')
@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  create(@Body() createAttemptDto: CreateAttemptDto) {
    return this.attemptsService.create(createAttemptDto);
  }

  @Get()
  findAll() {
    return this.attemptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attemptsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attemptsService.remove(id);
  }
}
