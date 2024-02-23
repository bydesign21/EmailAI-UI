import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewRef } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { BehaviorSubject, Subject, mergeMap, retryWhen, take, takeUntil, throwError, timer } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import Autolinker, { Match } from 'autolinker';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailModalContentComponent } from '../../shared-components/email-modal-content/email-modal-content.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('EmailModalTitleTemplate', { static: false })
  EmailModalTitleTemplate!: TemplateRef<any>;
  emailData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  isDataLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  destroy$: Subject<boolean> = new Subject<boolean>();
  emailsAnalyzedCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  highPriorityEmailCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  sentimentAnalysisPercentage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  nextPageToken: string | undefined = undefined;
  selectedEmail: any;
  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef,
    private modalService: NzModalService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getEmailData();
    this.handleLoadingEffects();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  handleLoadingEffects() {
    this.emailData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.handleSentimentAnalysisPercentage(data);
        this.handleHighPriorityEmailCount(data);
      });
  }

  getEmailData() {
    const auth: { type: string, value: string } = JSON.parse(sessionStorage.getItem('credential') || '');
    try {
      console.log('nextPageToken', this.nextPageToken);
      this.dashboardService.getEmailData(auth.value, 5, auth.type, this.nextPageToken)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((data: any) => {
          console.log('data', data);
          this.emailData.next([...this.emailData.getValue(), ...data.emails]);
          console.log('emailData', this.emailData.getValue());
          this.nextPageToken = decodeURIComponent(data.nextPage);
          this.isDataLoading.next(false);
          this.cd.detectChanges();
        });
    } catch (err) {
      console.log('err', err);
      this.emailData.next([]);
      this.isDataLoading.next(false);
      this.cd.detectChanges();
    }
  }

  handleLoadMore() {
    this.isDataLoading.next(true);
    this.cd.detectChanges();
    this.getEmailData();
  }

  handleAnalyzeEmail(email: any) {
    email.isLoading = true;
    this.replaceEmailInDataWithEmail(email);
    this.dashboardService.getAnalyzedEmailData(email)
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        retryWhen(errors =>
          errors.pipe(
            mergeMap((error, index) => {
              const retryAttempt = index + 1;
              // If max retries have been reached, throw the error
              if (retryAttempt > 5) {
                return throwError(() => new Error('Maximum retries exceeded'));
              }
              // Retry after a delay
              return timer(retryAttempt * 1000);
            })
          )
        )
      )
      .subscribe({
        next: (data: any) => {
          console.log('data', data);
          this.replaceEmailInDataWithAnalyzedEmail(data);
          this.incrementEmailsAnalyzedCount();
        },
        error: (err: any) => {
          console.error('err', err);
        },
        complete: () => {
          email.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  incrementEmailsAnalyzedCount() {
    const count: number = this.emailsAnalyzedCount.getValue();
    this.emailsAnalyzedCount.next(count + 1);
    this.cd.detectChanges();
  }

  handleHighPriorityEmailCount(data: any[]) {
    const highPriorityCount = data.filter((email: any) => email?.priority === 'High').length;
    this.highPriorityEmailCount.next(highPriorityCount);
    this.cd.detectChanges();
  }

  handleSentimentAnalysisPercentage(data: any[]) {
    const sentimentAnalysisPercentage = Number((data.filter((email: any) => email?.sentiment === 'Positive').length / this.emailData.getValue().length * 100).toFixed(2));
    this.sentimentAnalysisPercentage.next(sentimentAnalysisPercentage);
    this.cd.detectChanges();
  }

  replaceEmailInDataWithAnalyzedEmail(email: any) {
    email.isAnalyzed = true;
    this.replaceEmailInDataWithEmail(email);
  }

  replaceEmailInDataWithEmail(email: any) {
    const data: any[] = this.emailData.getValue();
    const index: number = data.findIndex((emailData: any) => emailData.id === email.id);
    data[index] = { ...data[index], ...email };
    this.emailData.next([...data]);
    this.cd.detectChanges();
  }

  replaceFunction(match: Match) {

    switch (match.type) {
      case 'email':
        return `<a class="text-blue-500" href="mailto:${match.getEmail()}">${match.getEmail()}</a>`;
      case 'phone':
        return `<br><a class="text-blue-500" href="tel:${match.getNumber()}">${match.getNumber()}</a>`;
      case 'hashtag':
        return `<a class="text-blue-500" href="https://twitter.com/hashtag/${match.getHashtag()}">${match.getHashtag()}</a>`;
      case 'mention':
        return `<a class="text-blue-500" href="https://twitter.com/${match.getMention()}">${match.getMention()}</a>`;
      case 'url':
        const offset = match.getOffset();
        console.log('urlOffset', offset);
        return `<a class="text-blue-500" href="${match.getUrl()}">Link</a>`;
    }

  }

  parseEmailContent(content: string): string {
    return Autolinker.link(content, {
      urls: true,
      email: true,
      phone: true,
      hashtag: 'twitter',
      mention: 'twitter',
      truncate: 10,
      replaceFn: this.replaceFunction
    })
      .replace(/(\r\n|\r|\n){2,}/g, '<br>') // Replace multiple newlines with <br>
      .replace(/^<b>(.*?)<\/b>/, '<h1 class="text-2xl font-bold mb-4">$1</h1>') // Replace <b> with <h1>
      .replace(/<br>/g, `</p><p class="mb-4">`) // Replace <br> with <p>
      .replace(/(\()?<a([^>]+)>(.*?)<\/a>(\))?/g, '<a$2>$3</a>') // remove parentheses around links
      .replace(/<br>\s*<a/g, '<a') // Remove <br> before <a>
      .replaceAll('<p class="mb-4"><a ', '<a ')
      .replaceAll('</a></p>', '</a>')
      .replaceAll(' )', '')
      .replaceAll('( ', '')
  }


  handleRowClicked(email: any) {
    this.selectedEmail = email;
    this.modalService.create({
      nzTitle: this.EmailModalTitleTemplate,
      nzContent: EmailModalContentComponent,
      nzData: {
        content: email.content ? email?.content : this.parseEmailContent(email.textContent),
        summary: email.summary,
      },
      nzClosable: true,
      nzFooter: null,
      nzWidth: '95dvw',
      nzClassName: 'email-modal overflow-scroll sm:max-h-[70dvh] max-h-full relative top-[1.5dvh] sm:top-[15dvh]'
    })
  }

  shouldShowTooltip(text: string): boolean {
    const parentWidthInPixels = this.convertDvwToPixels(90); // Convert 85dvw to pixels
    const avgCharWidth = 9.75 // Estimate average character width
    const maxCharCount = Math.floor(parentWidthInPixels / avgCharWidth);
    console.log('text.length, maxCharCount', text.length, maxCharCount);
    return text.length > maxCharCount;
  }

  private convertDvwToPixels(dvw: number): number {
    const viewportWidth = window.innerWidth;
    return (dvw / 100) * viewportWidth;
  }
}


