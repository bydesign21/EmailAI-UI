import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { EmailSentimentAnalysisPercentageComponent } from './email-sentiment-analysis-percentage.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [EmailSentimentAnalysisPercentageComponent],
  imports: [
    CommonModule,
    NzProgressModule,
    NzIconModule,
    NzSpinModule
  ],
  exports: [EmailSentimentAnalysisPercentageComponent]
})
export class EmailSentimentAnalysisPercentageModule { }
