import { action, observable } from 'mobx';

import { OpenAPIParameter } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

import { OpenAPIParser } from '../OpenAPIParser';
import { SchemaModel } from './Schema';

/**
 * Field or Parameter model ready to be used by components
 */
export class FieldModel {
  @observable expanded: boolean = false;

  schema: SchemaModel;
  name: string;
  required: boolean;
  description: string;
  example?: string;
  deprecated: boolean;
  in?: string;
  kind: string;

  constructor(
    parser: OpenAPIParser,
    field: OpenAPIParameter & { name?: string; kind?: string },
    pointer: string,
    options: RedocNormalizedOptions,
  ) {
    this.kind = field.kind || 'field';
    this.name = field.name || field.name;
    this.in = field.in;
    this.required = !!field.required;
    this.schema = new SchemaModel(parser, field.schema || {}, pointer, options);
    this.description =
      field.description === undefined ? this.schema.description || '' : field.description;
    this.example = field.example || this.schema.example;

    this.deprecated = field.deprecated === undefined ? !!this.schema.deprecated : field.deprecated;
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
