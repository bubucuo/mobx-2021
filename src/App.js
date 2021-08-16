import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

// 对应用状态进行建模。
class Timer {
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increase() {
    this.secondsPassed += 1;
  }

  reset() {
    this.secondsPassed = 0;
  }
}

const timer = new Timer();

// 构建一个使用 observable 状态的“用户界面”。

// ReactDOM.render(<TimerView timer={myTimer} />, document.body);

// 每秒更新一次‘已过秒数：X’中的文本。
setInterval(() => {
  timer.increase();
}, 1000);

export default observer(function App(props) {
  return (
    <div>
      <h3>App</h3>
      <button onClick={() => timer.reset()}>
        已过秒数：{timer.secondsPassed}
      </button>
    </div>
  );
});
