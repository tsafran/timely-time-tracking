import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkSessionsComponent } from './work-sessions.component';

describe('WorkSessionsComponent', () => {
  let component: WorkSessionsComponent;
  let fixture: ComponentFixture<WorkSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkSessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
