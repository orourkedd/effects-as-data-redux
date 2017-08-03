import { reduxGetState, reduxDispatch } from "./cmds";

test("reduxGetState() should return an reduxGetState action", () => {
  const path = "user.name";
  const actual = reduxGetState(path);
  const expected = {
    type: "reduxGetState",
    path
  };
  expect(actual).toEqual(expected);
});

test("reduxDispatch() should return a reduxDispatch action", () => {
  const action = { type: "SET_USER" };
  const actual = reduxDispatch(action);
  const expected = {
    type: "reduxDispatch",
    action
  };
  expect(actual).toEqual(expected);
});
