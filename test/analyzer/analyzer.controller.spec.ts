import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerController } from '../../src/analyzer/analyzer.controller';
import { AnalyzerService } from '../../src/analyzer/analyzer.service';

describe('AnalyzerController', () => {
  let controller: AnalyzerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyzerController],
      providers: [AnalyzerService]
    }).compile();

    controller = module.get<AnalyzerController>(AnalyzerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
