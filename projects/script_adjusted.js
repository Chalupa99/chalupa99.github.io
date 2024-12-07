let availableNames = [];

// Load the names from the txt file
fetch('names.txt')
    .then(response => response.text())
    .then(data => {
        // Split the file content by line and filter out empty lines
        availableNames = data.split('\n').map(name => name.trim()).filter(name => name !== "");
    })
    .catch(error => {
        console.error("Error loading names:", error);
    });

document.getElementById("generateBtn").addEventListener("click", function () {
    const resultDiv = document.getElementById("result");

    if (availableNames.length === 0) {
        resultDiv.innerHTML = "<p>All names have been drawn!</p>";
        return;
    }

    // Generate a random index and pick a name
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const name = availableNames.splice(randomIndex, 1)[0];

    // Display the drawn name
    resultDiv.innerHTML = `<p>Drawn Name: <strong>${name}</strong></p>`;
});
