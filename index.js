const fs = require('fs');
const path = require('path');
const readline = require('readline');
const yargs = require('yargs');
const chalk = require('chalk');



const data_file = path.join(__dirname, 'data', 'notes.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load notes from the JSON file
const loadNotes = () => {
  try {
    const data = fs.readFileSync(data_file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save notes to the JSON file
const saveNotes = (notes) => {
  fs.writeFileSync(data_file, JSON.stringify(notes, null, 2));
};

// Create a new note
const createNote = () => {
  rl.question(chalk.green('Enter the title: '), (title) => {
    rl.question(chalk.green('Enter the content: '), (content) => {
      const notes = loadNotes();
      const newNote = { title, content };
      notes.push(newNote);
      saveNotes(notes);
      console.log(chalk.blue('Note added successfully!'));
      rl.close();
    });
  });
};

// Clear all notes
const clearNotes = () => {
  saveNotes([]);
  console.log(chalk.red('All notes cleared!'));
  rl.close();
};

// Read and display all notes
const readNotes = () => {
  const notes = loadNotes();
  if (notes.length === 0) {
    console.log(chalk.yellow('No notes found.'));
  } else {
    console.log(chalk.green('Your Notes:'));
    notes.forEach((note, index) => {
      console.log(`${chalk.blue(index + 1)}. ${chalk.bold(note.title)}: ${note.content}`);
    }); 
  }
  rl.close()
};

// Main function to handle user commands
const main = () => {
  yargs.command({
    command: 'create',
    describe: 'Create a new note',
    handler: () => createNote()
  })
  .command({
    command: 'clear',
    describe: 'Clear all notes',
    handler: () => clearNotes()
  })
  .command({
    command: 'read',
    describe: 'Read all notes',
    handler: () => readNotes()
  })
  .demandCommand(1, chalk.yellow('Please provide a valid command'))
  .help()
  .argv;
};

main();
