var url = 'http://127.0.0.1:5000/predict';
var url = 'https://detector-api.azurewebsites.net/predict';

document.getElementById('predictButton').addEventListener('click', function () {
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

            resultElement.innerHTML = '';
            if (data.prediction !== undefined) {
                const prediction = data.prediction > 0.5 ? 'AI Detected' : 'AI Not Detected';


                resultElement.innerHTML += `<p>AI Probability: ${data.prediction * 100}%</p>`;

                let message = document.createElement('div');
                if (data.prediction > 0.5) {
                    // message.innerHTML += '<p>Verdict: AI Detected</p>';
                    message.innerHTML += `<p>The following are the prevalence factors for 1-4 word sequences. Positive means AI, negative means human. </p>`;
                    message.innerHTML += `<p>Single word prevalence: ${(data.features.prevalence).toFixed(2)}</p>`;
                    message.innerHTML += `<p>Bigram prevalence: ${data.features.bigram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Trigram prevalence: ${data.features.trigram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Fourgram prevalence: ${data.features.fourgram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Variance of sentence length: ${data.features.sentence_std.toFixed(2)} (lower means AI)</p>`;
                    message.innerHTML += `<p>Length in words: ${data.features.length}</p>`;
                    if (data.features.length < 300) {
                        message.innerHTML += `<p>Warning: Length of the text is less than 300 words, which means lower accuracy</p>`;
                    }
                } else if (data.prediction == 0.5) {
                    message.innerHTML = "<p>Our model is uncertain about this text. Consider adding more words if possible.</p>";
                    message.innerHTML += `<p>The following are the prevalences factor for 1-4 word sequences. Positive means AI, negative means human. </p>`;
                    message.innerHTML += `<p>Single word prevalence: ${(data.features.prevalence).toFixed(2)}</p>`;
                    message.innerHTML += `<p>Bigram prevalence: ${data.features.bigram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Trigram prevalence: ${data.features.trigram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Fourgram prevalence: ${data.features.fourgram_prevalence.toFixed(2)}</p>`;
                    message.innerHTML += `<p>Variance of sentence length: ${data.features.sentence_std.toFixed(2)} (lower means AI)</p>`;
                    message.innerHTML += `<p>Length in words: ${data.features.length}</p>`;
                }
                else {
                    message.innerHTML = "<p>AI Not Detected</p>";
                }
                resultElement.appendChild(message);
            } else {
                resultElement.innerHTML = '<p>Error: Could not get a prediction.</p>';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('result').textContent = 'Error: Could not connect to the API.';
        });
});

document.getElementById('textInput').addEventListener('input', debounce(function () {
    const textInput = document.getElementById('textInput').value;
    const resultElement = document.getElementById('result');
    resultElement.textContent = '';

}, 100)); // 500ms debounce time




// document.getElementById('textInput').addEventListener('input', debounce(function() {
//     const textInput = document.getElementById('textInput').value;
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: textInput }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         const resultElement = document.getElementById('result');
//         if (data.prediction !== undefined) {
//             const prediction = data.prediction > 0.5 ? 'AI Detected' : 'AI Not Detected';
//             resultElement.textContent = `AI Probability: ${data.prediction*100}%`;
//         } else {
//             resultElement.textContent = 'Error: Could not get a prediction.';
//         }
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         document.getElementById('result').textContent = 'Error: Could not connect to the API.';
//     });
// }, 10)); // 500ms debounce time

// Debounce function to limit the number of API calls
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
