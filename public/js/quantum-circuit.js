document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('circuit-form');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const circuitData = {
      num_qubits: parseInt(formData.get('num_qubits')),
      gates: JSON.parse(formData.get('gates'))
    };

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(circuitData),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const result = await response.json();
      resultDiv.innerHTML = `<h2>Simulation Result:</h2><pre>${JSON.stringify(result, null, 2)}</pre>`;
    } catch (error) {
      console.error(`Error during simulation: ${error.message}`, error.stack);
      resultDiv.innerHTML = `<h2>Error:</h2><p>${error.message}</p>`;
    }
  });
});