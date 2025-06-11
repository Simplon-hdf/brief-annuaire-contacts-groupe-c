import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteContact } from './carte-contact';

describe('CarteContact', () => {
  let component: CarteContact;
  let fixture: ComponentFixture<CarteContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
