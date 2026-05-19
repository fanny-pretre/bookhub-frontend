import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAdminComponent } from './book-admin.component';

describe('BookAdminComponent', () => {
  let component: BookAdminComponent;
  let fixture: ComponentFixture<BookAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
