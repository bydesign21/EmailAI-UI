import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-email-sentiment-analysis-percentage',
  standalone: false,
  templateUrl: './email-sentiment-analysis-percentage.component.html',
  styleUrl: './email-sentiment-analysis-percentage.component.scss'
})
export class EmailSentimentAnalysisPercentageComponent {
  @Input() percentage: number = 0;
  @Input() isLoading: boolean = true;
}
