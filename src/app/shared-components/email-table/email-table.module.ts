import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTableComponent } from './email-table.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [EmailTableComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzSpinModule,
    NzIconModule,
    NzEmptyModule,
    NzToolTipModule,
  ],
  providers: [
    provideAnimations()
  ],
  exports: [EmailTableComponent]
})
export class EmailTableModule { }
