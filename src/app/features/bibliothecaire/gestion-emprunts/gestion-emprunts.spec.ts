import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEmpruntsComponent } from './gestion-emprunts';

describe('GestionEmprunts', () => {
  let component: GestionEmpruntsComponent;
  let fixture: ComponentFixture<GestionEmpruntsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionEmpruntsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionEmpruntsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
