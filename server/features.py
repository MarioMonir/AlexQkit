import copy
import numpy as np
from math import log2
from scipy.linalg import fractional_matrix_power

from qiskit import QuantumCircuit
from qiskit.quantum_info.operators import Operator

class Features():
        
    def sqrt(self, gate):
        a = np.matrix(gate)
        return fractional_matrix_power(a, 0.5).tolist()

###############################################################################################################################
                
    def matrixToGateObject(self,matrix,name):
        """
        returns gate object of a matrix
        """
        num_qubits=int(log2(len(matrix)))
        tempCircuit=QuantumCircuit(num_qubits,name=name)
        customGate = Operator(matrix)
        tempCircuit.unitary(customGate, list(range(num_qubits)))
        return tempCircuit.to_gate()

###############################################################################################################################  

    def elementaryGates(self, rows, circuitObj):
        newGates={}
        customGates=circuitObj.customGates
        columns = np.transpose(rows).tolist()
        i = 0
        while i < len(columns):
            c = []
            gatePositions=[]
            for j in range(len(columns[i])):
                if columns[i][j] == "i":
                    continue
                if columns[i][j] == "●" or columns[i][j] == "○":
                    c.append(j)
                else:
                    gatePositions.append(j)
            if len(c) > 1:
                allNames=[]
                for gatePos in gatePositions:
                    if columns[i][gatePos][:7] == "custom_":
                        end = columns[i][gatePos].find(".")
                        name = "√("+columns[i][gatePos][7:end]+")"
                        gateMatrix = customGates[columns[i][gatePos][7:end]]
                    else:
                        name = "√("+columns[i][gatePos]+")"
                        gateMatrix = circuitObj.gateToMatrix(columns[i][gatePos])
                    if name not in customGates:
                        gate=self.sqrt(np.array(gateMatrix))
                        gateCopy=copy.deepcopy(gate)
                        customGates[name] = gate
                        circuitObj.gatesObjects[name]=self.matrixToGateObject(gate,name)
                        newGates[name]=gateCopy
                    name2 = name+"†"
                    if name2 not in customGates:
                        gate=np.matrix(customGates[name]).getH().tolist()
                        gateCopy=copy.deepcopy(gate)
                        customGates[name2] = gate
                        circuitObj.gatesObjects[name2]=self.matrixToGateObject(gate,name2)
                        newGates[name2]= gateCopy
                    allNames.append(name)

                col = ["i"]*len(columns[i])
                col[c[1]] = columns[i][c[1]]
                for l in range(len(gatePositions)):
                    col[gatePositions[l]] = "custom_"+allNames[l]
                for k in range(len(c)-2):
                    col[c[k+2]] = columns[i][c[k+2]]
                columns.insert(i+1, col)
                
                col = ["i"]*len(columns[i])
                col[c[0]] = columns[i][c[0]]
                col[c[1]] = "x"
                for k in range(len(c)-2):
                    col[c[k+2]] = columns[i][c[k+2]]
                columns.insert(i+1, col)

                col = ["i"]*len(columns[i])
                col[c[1]] = columns[i][c[1]]
                for l in range(len(gatePositions)):
                    col[gatePositions[l]] = "custom_"+allNames[l]+"†"
                for k in range(len(c)-2):
                    col[c[k+2]] = columns[i][c[k+2]]
                columns.insert(i+1, col)
                
                col = ["i"]*len(columns[i])
                col[c[0]] = columns[i][c[0]]
                col[c[1]] = "x"
                for k in range(len(c)-2):
                    col[c[k+2]] = columns[i][c[k+2]]
                columns.insert(i+1, col)

                col = ["i"]*len(columns[i])
                col[c[0]] = columns[i][c[0]]
                for l in range(len(gatePositions)):
                    col[gatePositions[l]] = "custom_"+allNames[l]
                for k in range(len(c)-2):
                    col[c[k+2]] = columns[i][c[k+2]]
                columns.insert(i+1, col)

                del columns[i]

            if len(c) == 2:
                i = i+4
            elif len(c) > 2:
                i = i-1
            i = i+1
            
        return np.transpose(columns).tolist(),newGates

###############################################################################################################################

    def strToComplex(self, matrix):
        matrixCopy=copy.deepcopy(matrix)
        for i in range(len(matrixCopy)):
            for j in range(len(matrixCopy[i])):
                if(type(matrixCopy[i][j]) == type("")):
                    matrixCopy[i][j] = matrixCopy[i][j].replace("i", "j")
                    matrixCopy[i][j] = complex(matrixCopy[i][j])
        return matrixCopy

###############################################################################################################################

    def complexToStr(self, matrix):
        matrixCopy=copy.deepcopy(matrix)
        for i in range(len(matrixCopy)):
            for j in range(len(matrixCopy[i])):
                if(type(matrixCopy[i][j]) == type(0j)):
                    matrixCopy[i][j] = str(np.around(matrixCopy[i][j],4)).replace("j","i")
        return matrixCopy

###############################################################################################################################

    def getGates(self, circuit):
        cols = []
        # print(circuit.data[0][1][0].register.size)
        for i in range(len(circuit.data)):
            name = circuit.data[i][0].name
            # print(name)
            if name == "measure":
                name = "m"
            column = ['i']*circuit.data[0][1][0].register.size
            for j in range(len(circuit.data[i][1])):
                pos = circuit.data[i][1][j].index
                # print(pos)
                if 'c' == name[0]:
                    column[pos] = 'c'
                    name = name[1:]
                else:
                    column[pos] = name
                # print(column)
            cols.append(column)
        # print(cols)
        return cols

###############################################################################################################################