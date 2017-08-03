import { get } from "object-path";

export default store => {
  if (!get(store, "getState")) throw new Error("A redux store is required.");

  function reduxGetState({ path }) {
    const state = store.getState();
    return get(state, path);
  }

  function reduxDispatch({ action }) {
    return store.dispatch(action);
  }

  return {
    reduxGetState,
    reduxDispatch
  };
};
