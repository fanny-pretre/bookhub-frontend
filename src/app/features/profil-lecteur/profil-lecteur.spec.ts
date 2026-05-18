import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilLecteur } from './profil-lecteur';

describe('ProfilLecteur', () => {
  let component: ProfilLecteur;
  let fixture: ComponentFixture<ProfilLecteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilLecteur],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilLecteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
