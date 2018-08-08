import { OpenAPISecurityScheme, Referenced } from '../../types';
import { SECURITY_SCHEMES_SECTION } from '../../utils/openapi';
import { OpenAPIParser } from '../OpenAPIParser';

export class SecuritySchemeModel {
  id: string;
  sectionId: string;
  type: OpenAPISecurityScheme['type'];
  description: string;
  apiKey?: {
    name: string;
    in: OpenAPISecurityScheme['in'];
  };

  http?: {
    scheme: string;
    bearerFormat?: string;
  };

  flows: OpenAPISecurityScheme['flows'];
  openId?: {
    connectUrl: string;
  };

  constructor(id: string, scheme: Referenced<OpenAPISecurityScheme>) {
    this.id = id;
    this.sectionId = SECURITY_SCHEMES_SECTION + id;
    this.type = scheme.type;
    this.description = scheme.description || '';
    if (scheme.type === 'apiKey') {
      this.apiKey = {
        name: scheme.name!,
        in: scheme.in,
      };
    }

    if (scheme.type === 'http') {
      this.http = {
        scheme: scheme.scheme!,
        bearerFormat: scheme.bearerFormat,
      };
    }

    if (scheme.type === 'openIdConnect') {
      this.openId = {
        connectUrl: scheme.openIdConnectUrl!,
      };
    }

    if (scheme.type === 'oauth2' && scheme.flows) {
      this.flows = scheme.flows;
    }
  }
}

export class SecuritySchemesModel {
  schemes: SecuritySchemeModel[];

  constructor(parser: OpenAPIParser) {
    const schemes = (parser.spec.components && parser.spec.components.securitySchemes) || {};
    this.schemes = Object.keys(schemes).map(name => new SecuritySchemeModel(name, schemes[name]));
  }
}
