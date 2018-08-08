/* tslint:disable:no-implicit-dependencies */

import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { filterPropsDeep } from '../../utils/test-utils';

import { loadAndBundleSpec } from '../../utils/loadAndBundleSpec';

import { ObjectSchema, Schema } from '../';
import { OpenAPIParser, SchemaModel } from '../../services';
import { RedocNormalizedOptions } from '../../services/RedocNormalizedOptions';
import * as simpleDiscriminatorFixture from './fixtures/simple-discriminator.json';

const options = new RedocNormalizedOptions({});
describe('Components', () => {
  describe('SchemaView', () => {
    describe('discriminator', () => {
      let parser: OpenAPIParser;
      beforeEach(async () => {
        parser = new OpenAPIParser(
          await loadAndBundleSpec(simpleDiscriminatorFixture),
          undefined,
          options,
        );
      });

      it('should correctly render SchemaView', async () => {
        const schema = new SchemaModel(
          parser,
          // { $ref: '#/components/schemas/Pet' },
          parser.spec.components!.schemas!.Pet,
          '#/components/schemas/Pet',
          options,
        );
        const schemaViewElement = shallow(<Schema schema={schema} />).getElement();
        expect(schemaViewElement.type).toEqual(ObjectSchema);
        expect(schemaViewElement.props.discriminator).toBeDefined();
        expect(schemaViewElement.props.discriminator.parentSchema).toBeDefined();
        expect(schemaViewElement.props.discriminator.fieldName).toEqual('type');
      });

      it('should correctly render discriminator dropdown', () => {
        const schema = new SchemaModel(
          parser,
          parser.spec.components!.schemas!.Pet,
          '#/components/schemas/Pet',
          options,
        );
        const schemaView = shallow(
          <ObjectSchema
            schema={schema.oneOf![0]}
            discriminator={{
              fieldName: schema.discriminatorProp,
              parentSchema: schema,
            }}
          />,
        );
        expect(filterPropsDeep(toJson(schemaView), ['field.schema.options'])).toMatchSnapshot();
      });
    });
  });
});
