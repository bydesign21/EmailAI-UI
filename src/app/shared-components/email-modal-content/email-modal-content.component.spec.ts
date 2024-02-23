import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalContentComponent } from './email-modal-content.component';

describe('EmailModalContentComponent', () => {
  let component: EmailModalContentComponent;
  let fixture: ComponentFixture<EmailModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailModalContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
