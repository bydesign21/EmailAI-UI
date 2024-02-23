// email-modal-content.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  selector: 'app-email-modal-content',
  templateUrl: './email-modal-content.component.html'
})
export class EmailModalContentComponent implements OnChanges, OnInit {
  @Input() content: string = '';
  @Input() summary: string = '';
  safeHtmlContent: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {
    console.log('EmailModalContentComponent constructor called')
  }

  ngOnInit(): void {
    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
    this.cd.detectChanges();
  }

  ngOnChanges() {
    this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.data.content);
    this.cd.detectChanges();
  }
}
