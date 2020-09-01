export default [
  {
    name: "Quantum Dense Coding",
    circuit: {
      wires: 4,
      init: ["0", "0", "0", "0"],
      rows: [
        ["i", "i", "i", "○", "●", "●", "i", "i", "i", "i", "i"],
        ["i", "i", "i", "●", "○", "●", "i", "i", "i", "i", "i"],
        ["H", "●", "i", "X", "Y", "Z", "i", "●", "H", "●", "M"],
        ["i", "X", "i", "i", "i", "i", "i", "X", "i", "X", "M"],
      ],
    },
  },
  {
    name: "Quantum Teleportation",
    circuit: {
      wires: 3,
      init: ["0", "0", "0"],
      rows: [
        ["i", "i", "i", "●", "H", "M", "i", "○", "●", "●"],
        ["H", "●", "i", "X", "i", "M", "i", "●", "○", "●"],
        ["i", "X", "i", "i", "i", "i", "i", "X", "Z", "Y"],
      ],
    },
  }
];
