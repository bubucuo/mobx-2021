import { action, makeAutoObservable, makeObservable, observable } from "mobx";

class Todo {
  id = Math.random();
  title = "";
  finished = false;
  constructor(title) {
    makeAutoObservable(this);
    // makeObservable(this, {
    //   finished: observable,
    //   toggle: action,
    // });
    this.title = title;
  }

  toggle() {
    this.finished = !this.finished;
  }
}

export default Todo;
