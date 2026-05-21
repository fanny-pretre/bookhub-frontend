import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesEmpruntsComponent } from './mes-emprunts';

describe('MesEmprunts', () => {
  let component: MesEmpruntsComponent;
  let fixture: ComponentFixture<MesEmpruntsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesEmpruntsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MesEmpruntsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
