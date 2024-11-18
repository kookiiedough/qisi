import pennylane as qml
import sys
import json

def run_simulation(circuit_data):
    try:
        num_qubits = circuit_data['num_qubits']
        gates = circuit_data['gates']

        dev = qml.device("default.qubit", wires=num_qubits)

        @qml.qnode(dev)
        def circuit():
            for gate in gates:
                if gate['name'] == 'RX':
                    qml.RX(gate['params'][0], wires=gate['wires'][0])
                elif gate['name'] == 'RY':
                    qml.RY(gate['params'][0], wires=gate['wires'][0])
                elif gate['name'] == 'RZ':
                    qml.RZ(gate['params'][0], wires=gate['wires'][0])
                elif gate['name'] == 'CNOT':
                    qml.CNOT(wires=gate['wires'])
                else:
                    raise ValueError(f"Unsupported gate: {gate['name']}")
            return qml.state()

        result = circuit()
        return {"state": result.tolist()}
    except ValueError as ve:
        return {"error": "Invalid gate operation", "details": str(ve)}
    except IndexError as ie:
        return {"error": "Invalid qubit index", "details": str(ie)}
    except Exception as e:
        return {"error": "Simulation failed", "details": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = run_simulation(input_data)
        print(json.dumps(result))
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input", "details": "The input could not be parsed as JSON"}))
    except Exception as e:
        print(json.dumps({"error": "Unexpected error", "details": str(e)}), file=sys.stderr)