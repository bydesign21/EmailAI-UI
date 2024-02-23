import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCountComponent } from './email-count.component';

describe('EmailCountComponent', () => {
  let component: EmailCountComponent;
  let fixture: ComponentFixture<EmailCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
