import { observer } from "mobx-react-lite";
import { observableState } from "../store";
import { toJS } from "mobx";

export default observer(function ObservableStatePage(props) {
  console.log("observableState", observableState, toJS(observableState)); //sy-log
  return (
    <div>
      <h3>ObservableStatePage</h3>
      <p>{observableState.count}</p>
      <p>doubler: {observableState.double}</p>
      <p>{observableState.user?.name?.first}</p>
      <button onClick={() => observableState.add()}>add</button>
      <button onClick={() => observableState.fetch()}>fetch</button>
    </div>
  );
});
