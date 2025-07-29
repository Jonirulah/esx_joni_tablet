document.addEventListener('DOMContentLoaded', (event) => {
    const note = document.getElementById('note');
    // Load the saved note from localStorage
    const savedNote = localStorage.getItem('noteContent');
    if (savedNote) {
        note.innerHTML = savedNote;
    }
    
    // Add event listener to save content on input
    setInterval(() => {
        notes = document.getElementById('note');
        savedNotes = localStorage.getItem('noteContent');
        if (notes.innerHTML != savedNotes) {
            localStorage.setItem('noteContent', notes.innerHTML);
        }
    }, 5000);
})