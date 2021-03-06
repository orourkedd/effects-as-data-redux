import * as cmds from "./cmds";
import buildReduxHandlers from "./handlers";

exports.redux = cmds;
exports.buildReduxHandlers = buildReduxHandlers;

export function generateCmdsFromActions(actions) {
  let rcmds = {};
  for (let i in actions) {
    rcmds[i] = (...args) => cmds.reduxDispatch(actions[i](...args));
  }
  return rcmds;
}

export function generateFunctionsFromActions(actions) {
  let rcmds = generateCmdsFromActions(actions);
  let functions = {};
  for (let i in rcmds) {
    functions[i] = function*(...args) {
      return yield rcmds[i](...args);
    };
  }
  return functions;
}
