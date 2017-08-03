import { generateCmdsFromActions, generateFunctionsFromActions } from "./index";

test("generateCmdsFromActions() should generate cmds", () => {
  const actions = {
    setUser: payload => ({ type: "SET_USER", payload })
  };
  const cmds = generateCmdsFromActions(actions);
  const user = { name: "Chelsea" };
  const actual = cmds.setUser(user);
  const expected = {
    type: "reduxDispatch",
    action: {
      type: "SET_USER",
      payload: user
    }
  };
  expect(actual).toEqual(expected);
});

test("generateFunctionsFromActions() should generate effects-as-data functions", () => {
  const actions = {
    setUser: payload => ({ type: "SET_USER", payload })
  };
  const cmds = generateFunctionsFromActions(actions);
  const user = { name: "Chelsea" };
  const gen = cmds.setUser(user);
  const output1 = gen.next();
  expect(output1.value).toEqual({
    type: "reduxDispatch",
    action: actions.setUser(user)
  });
  const output2 = gen.next();
  expect(output2.value).toEqual(undefined);
  expect(output2.done).toEqual(true);
});
