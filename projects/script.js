document.getElementById('generateBtn').addEventListener('click', () => {
    const input = document.getElementById('nameInput').value.trim();
    const names = input.split('\n').map(name => name.trim()).filter(name => name !== '');

    if (names.length < 2) {
        document.getElementById('result').innerHTML = "<p style='color: red;'>Please enter at least two names!</p>";
        return;
    }

    // Shuffle names for random pairing
    const givers = [...names];
    const receivers = [...names];
    shuffleArray(receivers);

    // Ensure no one gets their own name
    while (!isValidPairing(givers, receivers)) {
        shuffleArray(receivers);
    }

    // Display results
    const pairs = givers.map((giver, index) => `${giver} ➡️ ${receivers[index]}`);
    document.getElementById('result').innerHTML = `<h3>Secret Santa Pairs:</h3><ul>${pairs.map(pair => `<li>${pair}</li>`).join('')}</ul>`;
});

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Helper function to ensure valid pairings
function isValidPairing(givers, receivers) {
    return !givers.some((giver, index) => giver === receivers[index]);
}
