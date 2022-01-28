import React from 'react';

import userEvent from '@testing-library/user-event';

import { getByRole, render, screen } from 'src/test-utils';

import TranslationEdit from './TranslationEdit';

describe('TranslationEdit', () => {
  const create = (props = {}) => {
    return render(
      <TranslationEdit
        translation={{ path: [] }}
        languages={[]}
        generationRules={[]}
        {...props}
      />
    );
  };

  const getControls = () => screen.getAllByTestId('translation-control');
  const getLanguageControl = (l) =>
    getControls().find((c) => c.getAttribute('data-testlanguage') === l);
  const getLanguageInput = (l) => getByRole(getLanguageControl(l), 'textbox');
  const getLocks = () => getControls().map((c) => getByRole(c, 'button'));
  const getLanguageLock = (l) => getByRole(getLanguageControl(l), 'button');

  test('render', () => {
    expect(create()).toBeTruthy();
  });

  test('langs should be sorted', () => {
    create({
      isUpdating: false,
      languages: ['en', 'fr'],
      generationRules: { fr: 'aa', en: '{en}' },
      translation: {
        path: [],
        translations: { fr: '', en: '' },
      },
    });

    const controls = getControls();
    expect(
      controls.map((c) => c.getAttribute('data-testlanguage'))
    ).toStrictEqual(['en', 'fr']);
  });

  test('langs should be unlocked when updating translation', () => {
    create({
      isUpdating: true,
      languages: ['en', 'fr'],
      generationRules: { en: 'aa', fr: '{en}' },
      translation: {
        path: [],
        translations: { en: '', fr: '' },
      },
    });

    const locks = getLocks();
    expect(locks.length).toBe(2);
    locks.forEach((lock) => {
      expect(lock.getAttribute('data-testvalue')).toBe('false');
    });
  });

  test('langs should be locked when creating translation', () => {
    create({
      isUpdating: false,
      languages: ['en', 'fr'],
      generationRules: { en: 'aa', fr: '{en}' },
      translation: {
        path: [],
        translations: { en: '', fr: '' },
      },
    });

    const locks = getLocks();
    expect(locks.length).toBe(2);
    locks.forEach((lock) => {
      expect(lock.getAttribute('data-testvalue')).toBe('true');
    });
  });

  test('langs should not be updated if unlocked', () => {
    create({
      isUpdating: true,
      languages: ['en', 'fr'],
      generationRules: { en: 'aa', fr: '{en}' },
      translation: {
        path: [],
        translations: { en: '', fr: '' },
      },
    });

    const enInput = getLanguageInput('en');
    const frInput = getLanguageInput('fr');
    userEvent.type(enInput, 'hi there');
    expect(enInput).toHaveValue('hi there');
    expect(frInput).toHaveValue('');
  });

  test('should toggle locks', () => {
    create({
      isUpdating: true,
      languages: ['en', 'fr'],
      generationRules: { en: 'aa', fr: '{en}' },
      translation: {
        path: [],
        translations: { en: '', fr: '' },
      },
    });

    const locks = getLocks();
    locks.forEach((lock) => {
      let value = false;
      for (let i = 0; i < 10; i++) {
        expect(lock).toHaveAttribute('data-testvalue', `${value}`);
        userEvent.click(lock);
        value = !value;
        expect(lock).toHaveAttribute('data-testvalue', `${value}`);
      }
    });
  });

  test('langs should be updated if locked', () => {
    create({
      isUpdating: true,
      languages: ['en', 'fr'],
      generationRules: { en: '', fr: '{en}' },
      translation: {
        path: [],
        translations: { en: '', fr: '' },
      },
    });

    const enInput = getLanguageInput('en');
    const frInput = getLanguageInput('fr');
    const frLock = getLanguageLock('fr');

    expect(frLock.getAttribute('data-testvalue')).toBe('false');
    userEvent.click(frLock);
    expect(frLock.getAttribute('data-testvalue')).toBe('true');
    userEvent.type(enInput, 'hi there');
    expect(enInput).toHaveValue('hi there');
    expect(frInput).toHaveValue('hi there');
  });
});
