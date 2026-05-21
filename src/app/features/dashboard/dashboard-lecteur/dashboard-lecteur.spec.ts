import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLecteur } from './dashboard-lecteur';

describe('DashboardLecteur', () => {
  let component: DashboardLecteur;
  let fixture: ComponentFixture<DashboardLecteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLecteur],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLecteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
