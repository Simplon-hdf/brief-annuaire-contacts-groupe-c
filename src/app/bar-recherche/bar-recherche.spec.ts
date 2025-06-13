import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarRecherche } from './bar-recherche';

describe('BarRecherche', () => {
  let component: BarRecherche;
  let fixture: ComponentFixture<BarRecherche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarRecherche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarRecherche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
