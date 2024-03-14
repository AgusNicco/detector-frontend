var url = 'http://127.0.0.1:5000/predict';
var url = 'https://detector-api.azurewebsites.net/predict';
var pingUrl = 'https://detector-api.azurewebsites.net/status';

function pingServer() {
    fetch(pingUrl, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

pingServer();



document.getElementById('predictButton').addEventListener('click', function () {
    var loadingElement = document.createElement('div');
    loadingElement.innerHTML = '<div> <h3 id="features-heading">Scanning<h3> <div class="loader"></div> </div>';
    const textInput = document.getElementById('textInput').value;
    const resultElement = document.getElementById('features');
    resultElement.innerHTML = '';
    resultElement.appendChild(loadingElement);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
    })
        .then(response => response.json())
        .then(data => {
            // const resultElement = document.getElementById('result');

            resultElement.innerHTML = '';


            if (data.prediction !== undefined) {
                const prediction = data.prediction > 0.75 ? 'AI Detected' : data.prediction > 0.5 ? 'Uncertain' : 'AI Not Detected';


                const probability = (data.prediction * 100).toFixed(2);
                const prevalenceFactor = (data.features.prevalence + data.features.bigram_prevalence + data.features.trigram_prevalence + data.features.fourgram_prevalence).toFixed(2);
                const sentenceVariance = data.features.sentence_std.toFixed(2);
                const paragraphVariance = data.features.paragraph_std.toFixed(2);
                const confidenceLevel = data.features.confidence_level;
                const false_positive_rate = data.features.false_positive_rate;
                const length = data.features.length.toFixed(2);
                const message = data.features.message;

                if (data.prediction > 0.75) {
                    resultElement.innerHTML += `
                    <div id="output-container">
                        <div id= "features-heading">${prediction}</div>
                        <div id="output-features-container">
                            <div class="feature-element">AI Probability: ${probability}%</div>
                            <div class="feature-element">Confidence Level: ${confidenceLevel}</div>
                            <div class="feature-element">False Positive Rate: ${false_positive_rate}%</div>
                            <div class="feature-element">Prevalence Factor: ${prevalenceFactor}</div>
                            <div class="feature-element">Sentence Variance: ${sentenceVariance}</div>
                            <div class="feature-element">Paragraph Variance: ${paragraphVariance}</div>
                            <div class="feature-element">Length: ${length}</div>
                        </div>
                        <div class="output-message">${message}</div>
                    </div>`;
                }
                else {
                    resultElement.innerHTML += `
                    <div id="output-container">
                        <div id= "features-heading">${prediction}</div>
                        <div id="output-features-container">
                            <div class="feature-element">AI Probability: ${probability}%</div>
                            <div class="feature-element">Prevalence Factor: ${prevalenceFactor}</div>
                            <div class="feature-element">Sentence Variance: ${sentenceVariance}</div>
                            <div class="feature-element">Paragraph Variance: ${paragraphVariance}</div>
                            <div class="feature-element">Length: ${length}</div>
                        </div>
                        <div class="output-message">${message}</div>
                    </div>`;
                }
            } else {
                resultElement.innerHTML = '<p>Error: Could not get a prediction.</p>';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
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
