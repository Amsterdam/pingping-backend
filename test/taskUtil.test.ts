import TaskUtil from "../src/utils/TaskUtil"
import { expect } from 'chai';

describe("taskUtil", () => {
  it ('when getting definition, should combine data from route & onboarding task', () => {
    const def = TaskUtil.getDefinition('onboarding.woonAdres')
    const routeTaskDef = TaskUtil.getDefinition(def.routeTaskId)

    expect(def.routeTaskId).to.eq(routeTaskDef.id)
  })
})