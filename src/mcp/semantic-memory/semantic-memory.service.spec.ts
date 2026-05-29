import { Test, TestingModule } from '@nestjs/testing';
import { SemanticMemoryService } from './semantic-memory.service';

describe('SemanticMemoryService', () => {
  let service: SemanticMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemanticMemoryService],
    }).compile();

    service = module.get<SemanticMemoryService>(SemanticMemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
