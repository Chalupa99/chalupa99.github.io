let availableNumbers = Array.from({ length: 10 }, (_, i) => i + 1); // [1, 2, ..., 10]

document.getElementById("generateBtn").addEventListener("click", function () {
    const resultDiv = document.getElementById("result");
    const messageDiv = document.getElementById("message");

    if (availableNumbers.length === 0) {
        resultDiv.innerHTML = "<p>All numbers have been generated!</p>";
        return;
    }

    // Generate a random index and pick the number
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const number = availableNumbers.splice(randomIndex, 1)[0];

    // Display the generated number
    resultDiv.innerHTML = `<p>Generated Number: <strong>${number}</strong></p>`;

    // Display remaining numbers
    messageDiv.innerHTML = `Remaining Numbers: ${availableNumbers.join(", ") || "None"}`;
});
