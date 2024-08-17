// CJS because of require instead of import
const fs = require('fs');
const readline = require('readline');

async function processWords(inputFile, outputFile) {
    const fileStream = fs.createReadStream(inputFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const output = fs.createWriteStream(outputFile);

    for await (const line of rl) {
        const trimmedLine = line.trim();
        if (trimmedLine && !/^[A-Z]/.test(trimmedLine)) {
            output.write(trimmedLine + '\n');
        }
    }

    output.close();
    console.log(`Processing complete. Filtered words saved to ${outputFile}`);
}

// Usage: Process words.txt and save the result to filtered_words.txt
processWords('words.txt', 'filtered_words.txt');
