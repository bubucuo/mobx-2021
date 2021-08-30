import { makeObservable, observable, computed, action, override } from "mobx";
import Parent from "./Parent.js";

class Child extends Parent {
  /* --- 继承来的定义 --- */
  // 抛出 - TypeError: Cannot redefine property
  name = "child无语";

  // arrowAction = () = {}

  // OK - 未被注释的
  overridableArrowAction = action(() => {});

  // OK - 原型
  action() {
    this.name += ".";
  }
  actionBound() {}
  get computed() {}

  /* --- 新的定义 --- */
  childObservable = 0;
  childArrowAction = () => {};
  childAction() {}
  childActionBound() {}
  get childComputed() {}

  constructor(value) {
    super();
    makeObservable(this, {
      // 继承来的
      action: override,
      actionBound: override,
      computed: override,
      // 新的
      childObservable: observable,
      childArrowAction: action,
      childAction: action,
      childActionBound: action.bound,
      childComputed: computed,
    });
  }
}
export default Child;
