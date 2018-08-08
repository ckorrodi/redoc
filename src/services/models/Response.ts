import { action, observable } from 'mobx';

import { OpenAPIResponse } from '../../types';

import { getStatusCodeType } from '../../utils';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';

export class ResponseModel {
  @observable expanded: boolean;

  content?: MediaContentModel;
  code: string;
  summary: string;
  description: string;
  type: string;
  headers: FieldModel[] = [];

  constructor(
    parser: OpenAPIParser,
    code: string,
    defaultAsError: boolean,
    response: OpenAPIResponse,
    options: RedocNormalizedOptions,
  ) {
    this.expanded = options.expandResponses === 'all' || options.expandResponses[code];
    this.code = code;
    if (response.content !== undefined) {
      this.content = new MediaContentModel(parser, response.content, false, options);
    }

    if (response['x-summary'] !== undefined) {
      this.summary = response['x-summary'];
      this.description = response.description || '';
    } else {
      this.summary = response.description || '';
      this.description = '';
    }

    this.type = getStatusCodeType(code, defaultAsError);

    const headers = response.headers;
    if (headers !== undefined) {
      this.headers = Object.keys(headers).map(name => {
        const header = headers[name];
        return new FieldModel(parser, { ...header, name } as any, '', options);
      });
    }
  }

  @action
  toggle() {
    this.expanded = !this.expanded;
  }
}
