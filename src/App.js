import { observer } from "mobx-react-lite";
import timer from "./store/timer";

export default observer(function App(props) {
  return (
    <div>
      <h3>App</h3>
      <button onClick={() => timer.add()}>{timer.sec}</button>
    </div>
  );
});
