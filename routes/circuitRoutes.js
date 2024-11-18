const express = require('express');
const router = express.Router();
const Circuit = require('../models/Circuit');
const { runQuantumSimulation } = require('../services/quantumSimulation');

// Existing DELETE route
router.delete('/circuits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCircuit = await Circuit.findByIdAndDelete(id);

    if (!deletedCircuit) {
      return res.status(404).json({ message: 'Circuit not found' });
    }

    console.log('Circuit deleted successfully:', id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting circuit:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Error deleting circuit', error: error.message });
  }
});

// New GET route handler for '/api/circuits'
router.get('/api/circuits', async (req, res) => {
  try {
    const circuits = await Circuit.find();
    res.json(circuits);
  } catch (error) {
    console.error('Error fetching circuits:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Error fetching circuits', error: error.message });
  }
});

// Test route for quantum simulation
router.post('/test-simulation', async (req, res) => {
  try {
    const circuitData = {
      num_qubits: 2,
      gates: [
        { name: 'RX', params: [0.5], wires: [0] },
        { name: 'CNOT', wires: [0, 1] }
      ]
    };

    const result = await runQuantumSimulation(circuitData);
    res.json({ result });
  } catch (error) {
    console.error('Error running quantum simulation:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Error running quantum simulation', error: error.message });
  }
});

// Updated /simulate route with error handling
router.post('/simulate', async (req, res) => {
  try {
    const circuitData = req.body;

    // Input validation
    if (!circuitData || !circuitData.num_qubits || !Array.isArray(circuitData.gates)) {
      return res.status(400).json({ error: 'Invalid circuit description. Must include num_qubits and gates array.' });
    }

    if (circuitData.num_qubits <= 0) {
      return res.status(400).json({ error: 'Number of qubits must be a positive integer.' });
    }

    for (const gate of circuitData.gates) {
      if (!gate.name || !Array.isArray(gate.wires)) {
        return res.status(400).json({ error: 'Each gate must have a name and wires array.' });
      }
    }

    const result = await runQuantumSimulation(circuitData);

    if (result.error) {
      return res.status(400).json({ error: result.error, details: result.details });
    }

    res.json(result);
  } catch (error) {
    console.error('Error running quantum simulation:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error during simulation', details: error.message });
  }
});

module.exports = router;