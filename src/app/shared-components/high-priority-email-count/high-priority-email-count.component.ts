import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-high-priority-email-count',
  standalone: false,
  templateUrl: './high-priority-email-count.component.html',
  styleUrl: './high-priority-email-count.component.scss'
})
export class HighPriorityEmailCountComponent {
  @Input() count: number = 0;
  @Input() isLoading: boolean = true;
}
