import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HusGridComponent } from './hus-grid.component';

describe('HusGridComponent', () => {
  let component: HusGridComponent;
  let fixture: ComponentFixture<HusGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HusGridComponent]
    });
    fixture = TestBed.createComponent(HusGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
