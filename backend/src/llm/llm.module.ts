import { Module } from '@nestjs/common';
import { LlmController } from './llm.controller';
import { LlmService } from './llm.service';
import { ChecklistModule } from './checklist.module';
import { RecommendationsModule } from './recommendations.module';

@Module({
  imports: [ChecklistModule, RecommendationsModule],
  controllers: [LlmController],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}