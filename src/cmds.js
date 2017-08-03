export function reduxGetState(path) {
  return {
    type: "reduxGetState",
    path
  };
}

export function reduxDispatch(action) {
  return {
    type: "reduxDispatch",
    action
  };
}
