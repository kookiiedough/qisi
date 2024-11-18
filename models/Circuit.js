const mongoose = require('mongoose');

const circuitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qubits: { type: Number, required: true },
  gates: [{
    type: { type: String, required: true },
    targets: [{ type: Number, required: true }],
    controls: [{ type: Number }],
    params: { type: Map, of: Number }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Circuit = mongoose.model('Circuit', circuitSchema);

module.exports = Circuit;