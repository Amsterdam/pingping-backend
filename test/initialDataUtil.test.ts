import { expect } from 'chai';
import InitialDataUtil from '../src/utils/InitialDataUtil';

describe('initialDataUtil', () => {
  it('get task by id from onboarding tasks', () => {
    const def = InitialDataUtil.getTaskById('onboarding.dateOfBirth');

    expect(def.title).to.eq('Wat is je geboortedatum?');
  });

  it('get task by id from route tasks', () => {
    const def = InitialDataUtil.getTaskById('financieleBasis.woonAdres');

    expect(def.title).to.eq('Regel je adres');
  });
});
