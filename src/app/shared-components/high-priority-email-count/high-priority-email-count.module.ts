import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighPriorityEmailCountComponent } from './high-priority-email-count.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';



@NgModule({
  declarations: [HighPriorityEmailCountComponent],
  imports: [
    CommonModule,
    NzSpinModule,
    NzIconModule
  ],
  exports: [HighPriorityEmailCountComponent]
})
export class HighPriorityEmailCountModule { }
