import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailCountComponent } from './email-count.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzIconModule } from 'ng-zorro-antd/icon';



@NgModule({
  declarations: [EmailCountComponent],
  imports: [
    CommonModule,
    NzSpinModule,
    NzIconModule
  ],
  exports: [EmailCountComponent],
  providers: [
    provideAnimations()
  ]
})
export class EmailCountModule { }
