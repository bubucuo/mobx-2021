import { makeObservable, observable, computed, action } from "mobx";

class Parent {
  // 被注释的实例字段不可被重新定义
  name = "无语";
  arrowAction = () => {};

  // 未被注释的实例字段可以被重新定义
  overridableArrowAction = action(() => {});

  // 被注释的原型methods/getters可以被重新定义
  action() {
    this.name += "。";
  }
  actionBound() {}
  get computed() {}

  constructor(value) {
    makeObservable(this, {
      name: observable,
      arrowAction: action,
      action: action,
      actionBound: action.bound,
      computed: computed,
    });
  }
}

export default Parent;
