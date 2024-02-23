import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailModalContentComponent } from './email-modal-content.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';



@NgModule({
  declarations: [EmailModalContentComponent],
  imports: [
    CommonModule,
    NzCollapseModule
  ],
  exports: [EmailModalContentComponent]
})
export class EmailModalContentModule { }
