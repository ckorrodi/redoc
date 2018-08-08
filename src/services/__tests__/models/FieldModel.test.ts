import { FieldModel } from '../../models/Field';
import { OpenAPIParser } from '../../OpenAPIParser';
import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

import { loadAndBundleSpec } from '../../../utils/loadAndBundleSpec';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('FieldModel', () => {
    let parser;

    beforeEach(async () => {
      const spec = await loadAndBundleSpec(require('../fixtures/fields.json'));
      parser = new OpenAPIParser(spec, undefined, opts);
    });

    test('basic field details', () => {
      const field = new FieldModel(
        parser,
        parser.spec.components!.parameters!.testParam,
        '#/components/parameters/testParam',
        opts,
      );

      expect(field.name).toEqual('test_name');
      expect(field.in).toEqual('path');
      expect(field.required).toEqual(false);
      expect(field.schema.type).toEqual('string');
    });

    test('field name should populated from name even if $ref (headers)', () => {
      const field = new FieldModel(
        parser,
        parser.spec.components!.headers!.testTest,
        '#/components/headers/testHeader',
        opts,
      );
      expect(field.name).toEqual('Test-Header');
    });
  });
});
