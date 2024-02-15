var url = 'http://127.0.0.1:5000/predict';
var url = 'https://detector-api.azurewebsites.net/predict';

document.getElementById('predictButton').addEventListener('click', function() {
    const textInput = document.getElementById('textInput').value;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
    })
    .then(response => response.json())
    .then(data => {
        const resultElement = document.getElementById('result');
        if (data.prediction !== undefined) {
            const prediction = data.prediction > 0.5 ? 'AI Detected' : 'AI Not Detected';
            resultElement.textContent = `AI Probability: ${data.prediction*100}%`;
        } else {
            resultElement.textContent = 'Error: Could not get a prediction.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error: Could not connect to the API.';
    });
});


document.getElementById('textInput').addEventListener('input', debounce(function() {
    const textInput = document.getElementById('textInput').value;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const resultElement = document.getElementById('result');
        if (data.prediction !== undefined) {
            const prediction = data.prediction > 0.5 ? 'AI Detected' : 'AI Not Detected';
            resultElement.textContent = `AI Probability: ${data.prediction*100}%`;
        } else {
            resultElement.textContent = 'Error: Could not get a prediction.';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error: Could not connect to the API.';
    });
}, 10)); // 500ms debounce time

// Debounce function to limit the number of API calls
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
