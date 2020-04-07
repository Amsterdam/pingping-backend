import ResolverMap from './ResolverMap';
import { Route, OnBoardingStep } from '../types/global';

const PingPingQueries: ResolverMap = {
  getCurrentRoutes ():Route[] {
    return []
  },

  getAvailableRoutes ():Route[] {
    return []
  },

  getOnboardingSteps():OnBoardingStep[] {
    return []
  }
}

export default PingPingQueries
