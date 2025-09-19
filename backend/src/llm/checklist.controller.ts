import {
  Controller,
  Get,
  BadRequestException,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('checklist')
@UseGuards(JwtAuthGuard)
export class ChecklistController {
  constructor(private checklistService: ChecklistService) {}


  @Get('user/me')
  async getChecklistsByUser(@Request() req: any) {
    const userId = req.user.id;
    return this.checklistService.getChecklistsByUser(userId);
  }

  @Get(':id')
  async getChecklistById(@Param('id', ParseIntPipe) id: number) {
    const checklist = await this.checklistService.getChecklistById(id);
    if (!checklist) {
      throw new BadRequestException('체크리스트를 찾을 수 없습니다.');
    }
    return checklist;
  }

}
