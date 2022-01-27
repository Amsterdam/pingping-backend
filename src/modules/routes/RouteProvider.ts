import { Injectable, Inject } from '@graphql-modules/di';
import { ROUTES } from 'modules/common';
import { RouteDefinition } from 'types/global';
import InitialDataUtil from 'utils/InitialDataUtil';

@Injectable()
export class RouteProvider {
  @Inject(ROUTES) private routes: RouteDefinition[];

  getAll(): RouteDefinition[] {
    return this.routes;
  }
}
