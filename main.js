document.getElementById('predictionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        age: document.getElementById('age').value,
        gender: parseFloat(document.getElementById('gender').value),
        steroid: parseInt(document.getElementById('steroid').value),
        antivirals: parseInt(document.getElementById('antivirals').value),
        fatigue: document.getElementById('fatigue').value,
        malaise: document.getElementById('malaise').value,
        anorexia: document.getElementById('anorexia').value,
        liverBig: parseFloat(document.getElementById('liverBig').value),
        liverFirm: parseFloat(document.getElementById('liverFirm').value),
        spleen: document.getElementById('spleen').value,
        spiders: document.getElementById('spiders').value,
        ascites: document.getElementById('ascites').value,
        varices: document.getElementById('varices').value,
        bili: document.getElementById('bili').value,
        alk: document.getElementById('alk').value,
        sgot: document.getElementById('sgot').value,
        albu: document.getElementById('albu').value,
        protime: document.getElementById('protime').value,
        histology: document.getElementById('histology').value
    };
    
    const requestData = {
        inputs: [formData]
    };
    
    fetch('http://localhost:8000/api/hfp_prediction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.style.display = 'block';
        
        const predictions = data.Prediction[0];
        let noHepatitisProb, hepatitisProb;
        
        if (Array.isArray(predictions) && predictions.length === 2) {
            noHepatitisProb = Math.round(predictions[1.0] * 100);
            hepatitisProb = Math.round(predictions[2.0] * 100);
        } else if (typeof predictions === 'object' && predictions.hasOwnProperty('1') && predictions.hasOwnProperty('2')) {
            noHepatitisProb = Math.round(predictions['1'] * 100);
            hepatitisProb = Math.round(predictions['2'] * 100);
        } else {
            console.error('Unexpected API response format:', data);
            alert('Error processing prediction results');
            return;
        }
        
        document.getElementById('noHepatitis').textContent = noHepatitisProb;
        document.getElementById('hepatitisProb').textContent = hepatitisProb;
        
        document.getElementById('noHepatitisBar').style.width = noHepatitisProb + '%';
        document.getElementById('noHepatitisBar').textContent = noHepatitisProb + '%';
        
        document.getElementById('hepatitisBar').style.width = hepatitisProb + '%';
        document.getElementById('hepatitisBar').textContent = hepatitisProb + '%';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error making prediction: ' + error.message);
    });
});