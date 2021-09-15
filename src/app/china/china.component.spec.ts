import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinaComponent } from './china.component';

describe('ChinaComponent', () => {
  let component: ChinaComponent;
  let fixture: ComponentFixture<ChinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
