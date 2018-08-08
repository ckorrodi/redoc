import { OpenAPIExample, Referenced } from '../../types';

export class ExampleModel {
  value: any;
  summary?: string;
  description?: string;
  externalValue?: string;

  constructor(infoOrRef: Referenced<OpenAPIExample>) {
    Object.assign(this, infoOrRef);
  }
}
