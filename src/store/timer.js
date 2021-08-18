import { makeAutoObservable } from "mobx";

class Timer {
  sec = 0;
  constructor() {
    makeAutoObservable(this);
  }
  add() {
    this.sec += 1;
    console.log("this.sec", this.sec); //sy-log
  }
}

const timer = new Timer();

export default timer;
