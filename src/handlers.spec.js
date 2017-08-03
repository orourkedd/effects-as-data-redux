import buildHandlers from "./handlers";
import * as cmds from "./cmds";
import { spy } from "sinon";

test("buildHandlers() should throw error if no store is passed in", () => {
  expect(buildHandlers).toThrow("A redux store is required.");
});

test("reduxGetState() should get state", () => {
  const name = "Chelsea";
  const store = {
    getState: () => ({
      user: {
        name
      }
    })
  };
  const cmd = cmds.reduxGetState("user.name");
  const { reduxGetState } = buildHandlers(store);
  const actual = reduxGetState(cmd);
  const expected = name;
  expect(actual).toEqual(expected);
});

test("reduxDispatch() should dispatch a redux action", () => {
  const action = { type: "SET_USER" };
  const store = {
    getState: spy(),
    dispatch: spy()
  };
  const cmd = cmds.reduxDispatch(action);
  const { reduxDispatch } = buildHandlers(store);
  reduxDispatch(cmd);
  const actual = store.dispatch.firstCall.args;
  const expected = [action];
  expect(actual).toEqual(expected);
});
