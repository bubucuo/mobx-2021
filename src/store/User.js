import { flow, makeAutoObservable, makeObservable, observable } from "mobx";

class User {
  data = {};
  constructor(data) {
    // makeAutoObservable(this);
    makeObservable(this, {
      data: observable,
      fetch: flow,
    });
    this.data = data;
  }

  *fetch() {
    const response = yield fetch("https://randomuser.me/api");
    const res = yield response.json();
    this.data = res.results[0];
  }
}

export default User;
