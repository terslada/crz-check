import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrzGridComponent } from './crz-grid.component';

describe('CrzGridComponent', () => {
  let component: CrzGridComponent;
  let fixture: ComponentFixture<CrzGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrzGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrzGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
