// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    toggleLoading(true);

    const title = document.getElementById('documentTitle').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const file = document.getElementById('documentFile').files[0];

    if (!title || !file) {
        alert('Title and document file are required!');
        toggleLoading(false);
        return;
    }

    // Prepare the document data
    const documentData = {
        title,
        tags,
        file: file.name, // Store file name for simplicity (can store file URL if needed)
        uploadDate: new Date().toLocaleString(),
    };

    try {
        // Retrieve existing documents from localStorage, or initialize an empty array if none exist
        const storedDocuments = JSON.parse(localStorage.getItem('documents')) || [];
        
        // Append the new document
        storedDocuments.push(documentData);
        
        // Store the updated list of documents
        localStorage.setItem('documents', JSON.stringify(storedDocuments));

        // Simulate a successful response immediately (no need to wait for an actual server response for now)
        alert('Document uploaded successfully!');
        searchDocuments(); // Refresh document list after upload
        document.getElementById('uploadForm').reset(); // Clear form inputs
    } catch (error) {
        console.error('Error uploading document:', error);
        alert('Failed to upload document!');
    } finally {
        toggleLoading(false); // Hide loading indicator
    }
});