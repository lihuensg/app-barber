import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redSocialGuard } from './red-social.guard';

describe('redSocialGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redSocialGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
