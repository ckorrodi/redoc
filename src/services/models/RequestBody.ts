import { OpenAPIRequestBody } from '../../types';

import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { MediaContentModel } from './MediaContent';

export class RequestBodyModel {
  description: string;
  required: boolean;
  content?: MediaContentModel;

  constructor(parser: OpenAPIParser, info: OpenAPIRequestBody, options: RedocNormalizedOptions) {
    this.description = info.description || '';
    this.required = !!info.required;
    if (info.content !== undefined) {
      this.content = new MediaContentModel(parser, info.content, true, options);
    }
  }
}
