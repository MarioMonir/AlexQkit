import axios from "axios";
import { appRoute, defaultBlochSphereRoute } from "../data/routes";

export default {
  // Setters
  setCols: (state, count) => {
    // counter
    state.jsonObject.colsCount = count;
  },
  setExe: (state, count) => {
    // counter
    state.jsonObject.exeCount = count;
  },
  setContorls: (state, val) => {
    // counter
    state.specialGatesCounter.controls += val;
  },
  setSwaps: (state, val) => {
    // counter
    state.specialGatesCounter.swaps += val;
  },
  setCustoms: (state, val) => {
    // counter
    state.specialGatesCounter.customs += val;
  },
  setRow: (state, { qstate, list, idx }) => {
    state.jsonObject.init[idx] = qstate;
    state.jsonObject.rows[idx] = list;
  },

  /* ================================================================= */
  // Appenders Functions
  appendInit: (state) => state.jsonObject.init.push("0"),
  appendWire: (state) => {
    window.console.log("append wire");
    state.jsonObject.wires++;
    state.jsonObject["rows"].push(
      new Array(state.jsonObject.colsCount).fill("i"),
    );
  },
  appendMessage: (state, { messageType, messageBody }) => {
    state.messages[messageType].push(messageBody);
  },
  appendCustomGate: (state, customGate) => {
    state.gates.push(customGate);
  },

  /* ================================================================= */

  // Remove Functions
  popInit: (state) => state.jsonObject.init.pop(),
  popWire: (state) => {
    state.jsonObject.wires--;
    //state.jsonObject.wires = Math.max(0, this.jsonObject.wires - 1);
    state.jsonObject.rows.pop();
  },

  // Reset System
  resetJsonObject: (state) => {
    state.jsonObject = {
      API_TOKEN: "",
      colsCount: 0,
      device: "",
      rows: [[], []],
      exeCount: 0,
      init: ["0", "0"],
      radian: false,
      repeated: {},
      shots: 1024,
      wires: 2,
    };
  },
  resetMessages: (state) => {
    state.messages = {
      advanced: [],
      alert: [],
      violation: [],
      errors: [],
    };
  },
  resetSpecialGates: (state) => {
    state.specialGatesCounter = {
      controls: 0,
      swaps: 0,
      customs: 0,
    };
  },

  /* ================================================================= */

  countGate:(state,gateName)=>{
    let count = 0;
    for (let i = 0; i < state.jsonObject.rows; i++) {
       for (let j = 0; j <state.jsonObject.colsCount; j++) {
         count = state.jsonObject.rows[i][j]===gateName ? count+=1:count
       }
    }
    window.console.log(count)
    return count
  },



  /* ================================================================= */
  // Validation Functions

  //Check for in every Column there is an even numbers of swaps
  swapConstrains: (state) => {
    //window.console.log("check swap")
    for (let col = 0; col < state.jsonObject.exeCount; col++) {
      let count = 0;
      for (let row = 0; row < state.jsonObject.wires; row++) {
        if (state.jsonObject.rows[row][col] === "swap") {
          count++;
        }
      }
      if (count == 1) {
        state.messages.violation.push(
          "on column(" +
            (col + 1) +
            ") : you need to put more swap gate at same column",
        );
      } else if (count > 2) {
        state.messages.violation.push(
          "on column (" +
            (col + 1) +
            ") : you can put only two swaps in one column",
        );
      }
    }
  },

  wirescustom: (/*state*/) => {
    // for (let col = 0; col < state.jsonObject.colsCount; col++) {
    //   let dicCount = {};
    // //  window.console.log(dicCount);
    //   for (let row = 0; row < state.jsonObject.wires-1; row++) {
    //     if (state.jsonObject.rows[row][col].startsWith("custom_")) {
    //       var nameofgate = state.jsonObject.rows[row][col];  //custom_q.0
    //       nameofgate = nameofgate.substring(0, nameofgate.indexOf(".")); //custom_q
    //       if (!(nameofgate in dicCount)) {
    //         dicCount[nameofgate] = 1;
    //       }
    //       else {
    //         dicCount[nameofgate] += 1;
    //       }
    //       for (let i in state.gates) {
    //             if(nameofgate === state.gates[i]["name"]){
    //                var wire =  state.gates[i]["wires"];
    //              //  window.console.log(state.gates)
    //                var realname= state.gates[i]["id"];}
    //           }
    //     }
    //    // window.console.log(wire);
    //     //window.console.log(dicCount[nameofgate]);
    //     if (wire != dicCount[nameofgate] && dicCount[nameofgate] != undefined) {
    //      window.console.log("gate "+realname+" can be put only for  "+wire+ "wires"+"not "+ dicCount[nameofgate] );
    //       state.messages.violation.push("gate "+realname+" at column "+ (col+1)+ " can be put only for "+wire+ " wires"+" not "+ dicCount[nameofgate])
    //     }
    //   }
    // }
  },
  /* ================================================================= */

  // Server Functions
  sendCircuit: (state) => {
    try {
      //window.console.log(state.jsonObject)
      axios.post(appRoute, state.jsonObject).then(
        (res) => {
          state.results = res.data;

          // 3ak fe 3ak lazem yet8ayer
          for (let i = 1; i <= state.jsonObject.wires; i++) {
            var imgofblochSphere = document.getElementById("bloch-sphere-" + i);
            imgofblochSphere.src =
              defaultBlochSphereRoute + "/" + i + "?time=" + new Date();
          }
        },
        (error) => {
          window.console.log(error);
        },
      );
    } catch (error) {
      window.console.log("i think there is an error " + error);
    }
  },



/* ================================================================= */
// browser localStorage functions 
store:(state,objectName)=>{
    localStorage.setItem(objectName,JSON.stringify(state[objectName]))
},

  getStorage:(state,objectName)=>{
    state[objectName] = JSON.parse(localStorage.getItem(objectName))
    return state[objectName]
}
}