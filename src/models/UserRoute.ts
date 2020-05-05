import { UserRouteResponse, UserRouteStatus } from '../generated/graphql';

export type UserRoute = {
  id: string
  title: string
  progress: number
  status: UserRouteStatus
  toResponse: toUserRouteResponse
}

type toUserRouteResponse = () => UserRouteResponse;

const toUserRouteResponse:toUserRouteResponse = function ():UserRouteResponse {
  return {
    routeId: 'tempTest',
    title: 'Howdy',
    status: UserRouteStatus.Active
  }
};