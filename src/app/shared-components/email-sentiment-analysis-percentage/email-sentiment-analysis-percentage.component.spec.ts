import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentimentAnalysisPercentageComponent } from './email-sentiment-analysis-percentage.component';

describe('EmailSentimentAnalysisPercentageComponent', () => {
  let component: EmailSentimentAnalysisPercentageComponent;
  let fixture: ComponentFixture<EmailSentimentAnalysisPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSentimentAnalysisPercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailSentimentAnalysisPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
