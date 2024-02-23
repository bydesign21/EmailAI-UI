import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Header {
  label: string;
  key: string;
  nzFilterFn: () => null;
  sortFn: (a: any, b: any) => any;
  filters?: { text: string; value: string }[];
  filterFn?: (keys: string[], item: any) => boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-email-table',
  standalone: false,
  templateUrl: './email-table.component.html',
  styleUrl: './email-table.component.scss'
})
export class EmailTableComponent implements OnInit {
  @Input() emails: any[] = [];
  @Input() isLoading: boolean = true;
  @Output() analyzeEmail: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit(): void {
    console.log(this.emails);
  }

  headers: Header[] = [
    {
      label: 'Analyze',
      key: 'analyze',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => null,
    },
    {
      label: 'Sender',
      key: 'sender',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => a.sender.localeCompare(b.sender),
    },
    {
      label: 'Subject',
      key: 'subject',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => a.subject.localeCompare(b.subject),
    },
    {
      label: 'Date',
      key: 'date',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => a.date.localeCompare(b.date),
    },
    {
      label: 'Priority',
      key: 'priority',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => a?.priority?.localeCompare(b?.priority),
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
      ],
      filterFn: (priority: string[], item: any) => {
        return priority.some((priority) => item.priority.indexOf(priority) !== -1);
      },
    },
    {
      label: 'Sentiment',
      key: 'sentiment',
      nzFilterFn: () => null,
      sortFn: (a: any, b: any) => a?.sentiment?.localeCompare(b?.sentiment),
      filters: [
        { text: 'Positive', value: 'positive' },
        { text: 'Neutral', value: 'neutral' },
        { text: 'Negative', value: 'negative' },
      ],
      filterFn: (sentiment: string[], item: any) => {
        return sentiment.some((sentiment) => item.sentiment.indexOf(sentiment) !== -1);
      },
    }
  ];

  filter = {
    sender: '',
    subject: '',
    date: '',
    priority: '',
    sentiment: ''
  };

  // Implement the filter logic here
  filterEmails(): any[] {
    return this.emails.filter(email => {
      return (this.filter.sender ? email.sender.includes(this.filter.sender) : true) &&
        (this.filter.subject ? email.subject.includes(this.filter.subject) : true)
    });
  }

  handleAnalyzeEmail(email: any) {
    this.analyzeEmail.emit(email);
  }

  handleRowClicked(email: any) {
    this.rowClicked.emit(email);
  }

  shouldShowTooltip(text: string): boolean {
    const parentWidthInPixels = this.convertDvwToPixels(18); // Convert 18dvw to pixels
    const avgCharWidth = 7.5 // Estimate average character width
    const maxCharCount = Math.floor(parentWidthInPixels / avgCharWidth);
    return text.length > maxCharCount;
  }

  private convertDvwToPixels(dvw: number): number {
    const viewportWidth = window.innerWidth;
    return (dvw / 100) * viewportWidth;
  }
}
