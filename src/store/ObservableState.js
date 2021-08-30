import {
  makeObservable,
  observable,
  computed,
  action,
  flow,
  makeAutoObservable,
} from "mobx";

// ! 方法1： class
class ObservableState {
  count = null;
  user = null;

  constructor(count) {
    // makeObservable(this, {
    //   count: observable,
    //   user: observable,
    //   double: computed,
    //   add: action.bound,
    //   fetch: flow,
    // });
    makeAutoObservable(this, {}, { autoBind: true });
    this.count = count;
  }

  get double() {
    return this.count * 2;
  }

  add() {
    this.count++;
  }

  *fetch() {
    const response = yield fetch("https://randomuser.me/api");
    response.json().then((res) => {
      this.user = res.results[0];
    });
  }
}

// !方法2： factory makeAutoObservable
// function ObservableState(count) {
//   return makeAutoObservable(
//     {
//       count,
//       user: null,
//       get double() {
//         return this.count * 2;
//       },
//       add() {
//         this.count++;
//       },
//       *fetch() {
//         const response = yield fetch("https://randomuser.me/api");
//         response.json().then((res) => {
//           this.user = res.results[0];
//         });
//       },
//     },
//     {
//       //  user: false,
//     }
//   );
// }

// function ObservableState(count) {
//   return makeObservable(
//     {
//       count,
//       user: null,
//       get double() {
//         return this.count * 2;
//       },
//       add() {
//         this.count++;
//       },
//       *fetch() {
//         const response = yield fetch("https://randomuser.me/api");
//         response.json().then((res) => {
//           this.user = res.results[0];
//         });
//       },
//     },
//     {
//       count: observable,
//       user: observable,
//       double: computed,
//       add: action,
//       fetch: flow,
//     }
//   );
// }

// !方法3： observable
// const ObservableState = observable(
//   {
//     count: 0,
//     user: null,
//     get double() {
//       return this.count * 2;
//     },
//     // add() {
//     //   this.count++;
//     // },
//     *fetch() {
//       const response = yield fetch("https://randomuser.me/api");
//       response.json().then((res) => {
//         this.user = res.results[0];
//       });
//     },
//   },
//   {
//     // user: false,
//   },
//   {
//     proxy: false,
//     autoBind: true,
//   }
// );

// ObservableState.add = action(function () {
//   this.count++;
// });

export default ObservableState;
