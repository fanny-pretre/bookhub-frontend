import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsValidation } from './reservations-validation';

describe('ReservationsValidation', () => {
  let component: ReservationsValidation;
  let fixture: ComponentFixture<ReservationsValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsValidation],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
