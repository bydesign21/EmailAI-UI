import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-email-count',
  standalone: false,
  templateUrl: './email-count.component.html',
  styleUrl: './email-count.component.scss'
})
export class EmailCountComponent {
  @Input() count: number = 0;
  @Input() isLoading: boolean = true;
}
