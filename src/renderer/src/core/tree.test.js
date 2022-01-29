import { getChildArray, createNode, jsonsToTree } from './tree';

describe('tree', () => {
  describe('getChildArray', () => {
    test('return empty array for empty node without children', () => {
      const node = createNode({ id: 0, children: [] });
      expect(getChildArray(node)).toEqual([]);
    });

    test('return empty array for nodes without keys', () => {
      const node = createNode({
        id: 0,
        children: [
          createNode({ id: 1, children: [] }),
          createNode({ id: 2, children: [] }),
        ],
      });
      expect(getChildArray(node)).toEqual([]);
    });

    test('return array with only item being the same node if its a key', () => {
      const node = createNode({ id: 0, translations: {} });
      expect(getChildArray(node).map((n) => n.id)).toEqual([0]);
    });

    test('return child keys on nested node', () => {
      const node = createNode({
        id: 0,
        children: [createNode({ id: 1 }), createNode({ id: 2 })],
      });
      expect(getChildArray(node).map((n) => n.id)).toEqual([1, 2]);
    });

    test('return child keys on nested node with empty groups', () => {
      const node = createNode({
        id: 0,
        children: [
          createNode({ id: 100, children: [] }),
          createNode({ id: 101, children: [createNode({ id: 1 })] }),
          createNode({ id: 2 }),
          createNode({ id: 3 }),
        ],
      });
      expect(getChildArray(node).map((n) => n.id)).toEqual([1, 2, 3]);
    });
  });

  describe('jsonsToTree', () => {
    test('empty jsons to empty tree', () => {
      const tree = jsonsToTree([{}, {}], ['en', 'fr']);
      expect(tree).toEqual([]);
    });

    test('one root key, one language', () => {
      const tree = jsonsToTree([{ A: 'en lang' }], ['en']);
      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          translations: { en: 'en lang' },
        }),
      ]);
    });

    test('one root key, three languages', () => {
      const tree = jsonsToTree(
        [{ A: 'en lang' }, { A: 'fr lang' }, { A: 'de lang' }],
        ['en', 'fr', 'de']
      );
      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          translations: {
            de: 'de lang',
            en: 'en lang',
            fr: 'fr lang',
          },
        }),
      ]);
    });

    test('three root keys, three languages', () => {
      const tree = jsonsToTree(
        [
          { A: 'A en lang', B: 'B en lang' },
          { A: 'A fr lang', B: 'B fr lang' },
          { A: 'A de lang', B: 'B de lang' },
        ],
        ['en', 'fr', 'de']
      );
      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          translations: {
            de: 'A de lang',
            en: 'A en lang',
            fr: 'A fr lang',
          },
        }),
        expect.objectContaining({
          label: 'B',
          translations: {
            de: 'B de lang',
            en: 'B en lang',
            fr: 'B fr lang',
          },
        }),
      ]);
    });

    test('three nested keys, three languages', () => {
      const tree = jsonsToTree(
        [
          { A: { AA: 'AA en' }, B: { BB: 'BB en' }, C: { CC: 'CC en' } },
          { A: { AA: 'AA fr' }, B: { BB: 'BB fr' }, C: { CC: 'CC fr' } },
          { A: { AA: 'AA de' }, B: { BB: 'BB de' }, C: { CC: 'CC de' } },
        ],
        ['en', 'fr', 'de']
      );
      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          path: ['A'],
          children: [
            expect.objectContaining({
              label: 'AA',
              path: ['A', 'AA'],
              translations: {
                en: 'AA en',
                fr: 'AA fr',
                de: 'AA de',
              },
            }),
          ],
        }),
        expect.objectContaining({
          label: 'B',
          children: [
            expect.objectContaining({
              label: 'BB',
              path: ['B', 'BB'],
              translations: {
                en: 'BB en',
                fr: 'BB fr',
                de: 'BB de',
              },
            }),
          ],
        }),
        expect.objectContaining({
          label: 'C',
          children: [
            expect.objectContaining({
              label: 'CC',
              path: ['C', 'CC'],
              translations: {
                en: 'CC en',
                fr: 'CC fr',
                de: 'CC de',
              },
            }),
          ],
        }),
      ]);
    });

    test('mixed', () => {
      const tree = jsonsToTree(
        [
          { A: { AA: { AAA: 'AAA en' } }, B: { BB: 'BB en' }, C: 'C en' },
          { A: { AA: { AAA: 'AAA fr' } }, B: { BB: 'BB fr' }, C: 'C fr' },
          { A: { AA: { AAA: 'AAA de' } }, B: { BB: 'BB de' }, C: 'C de' },
        ],
        ['en', 'fr', 'de']
      );

      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          path: ['A'],
          children: [
            expect.objectContaining({
              label: 'AA',
              path: ['A', 'AA'],
              children: [
                expect.objectContaining({
                  label: 'AAA',
                  path: ['A', 'AA', 'AAA'],
                  translations: {
                    en: 'AAA en',
                    de: 'AAA de',
                    fr: 'AAA fr',
                  },
                }),
              ],
            }),
          ],
        }),
        expect.objectContaining({
          label: 'B',
          children: [
            expect.objectContaining({
              label: 'BB',
              path: ['B', 'BB'],
              translations: {
                en: 'BB en',
                fr: 'BB fr',
                de: 'BB de',
              },
            }),
          ],
        }),
        expect.objectContaining({
          label: 'C',
          translations: {
            en: 'C en',
            fr: 'C fr',
            de: 'C de',
          },
        }),
      ]);
    });

    test('add missing keys', () => {
      const tree = jsonsToTree(
        [
          { B: { BB: 'BB en' }, C: 'C en' },
          { A: { AA: { AAA: 'AAA fr' } }, C: 'C fr' },
          { A: { AA: { AAA: 'AAA de' } }, B: { BB: 'BB de' } },
        ],
        ['en', 'fr', 'de']
      );

      expect(tree).toEqual([
        expect.objectContaining({
          label: 'A',
          path: ['A'],
          children: [
            expect.objectContaining({
              label: 'AA',
              path: ['A', 'AA'],
              children: [
                expect.objectContaining({
                  label: 'AAA',
                  path: ['A', 'AA', 'AAA'],
                  translations: {
                    en: '',
                    de: 'AAA de',
                    fr: 'AAA fr',
                  },
                }),
              ],
            }),
          ],
        }),
        expect.objectContaining({
          label: 'B',
          children: [
            expect.objectContaining({
              label: 'BB',
              path: ['B', 'BB'],
              translations: {
                en: 'BB en',
                fr: '',
                de: 'BB de',
              },
            }),
          ],
        }),
        expect.objectContaining({
          label: 'C',
          translations: {
            en: 'C en',
            fr: 'C fr',
            de: '',
          },
        }),
      ]);
    });
  });
});
