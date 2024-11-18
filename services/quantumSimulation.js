const { PythonShell } = require('python-shell');
const path = require('path');
const websocketService = require('./websocketService');
const { formatQuantumState } = require('../utils/quantumStateFormatter');

async function runQuantumSimulation(circuitData) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..', 'quantum_sim.py');
        const pyshell = new PythonShell(scriptPath, { mode: 'json' });

        pyshell.send(JSON.stringify(circuitData));

        pyshell.on('message', (message) => {
            if (message.type === 'state_update') {
                const formattedState = formatQuantumState(message.data);
                websocketService.broadcast({ type: 'quantum_state_update', data: formattedState });
            } else if (message.type === 'final_result') {
                resolve(message.data);
            }
        });

        pyshell.end((err) => {
            if (err) {
                console.error('Error finalizing quantum simulation:', err.message, err.stack);
                reject(err);
            }
        });
    });
}

module.exports = { runQuantumSimulation };