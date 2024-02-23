import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighPriorityEmailCountComponent } from './high-priority-email-count.component';

describe('HighPriorityEmailCountComponent', () => {
  let component: HighPriorityEmailCountComponent;
  let fixture: ComponentFixture<HighPriorityEmailCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighPriorityEmailCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HighPriorityEmailCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
