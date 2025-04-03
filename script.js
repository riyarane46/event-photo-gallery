async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file to upload!");
        return;
    }

    const file = fileInput.files[0];

    try {
        // **Step 1: Request SAS URL from Backend**
        const response = await fetch(`http://localhost:5000/generate-sas?filename=${file.name}`);
        const data = await response.json();
        const { uploadUrl, blobUrl } = data;

        // **Step 2: Upload File to Azure Blob Storage**
        await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "x-ms-blob-type": "BlockBlob" }
        });

        // **Step 3: Add Image URL to Queue for Processing**
        await fetch("http://localhost:5000/queue", {
            method: "POST",
            body: JSON.stringify({ blobUrl }),
            headers: { "Content-Type": "application/json" }
        });

        alert("File uploaded successfully!");

        // **Step 4: Display Uploaded Image**
        displayImage(blobUrl);
    } catch (error) {
        console.error("Upload failed:", error);
        alert("Upload failed, please try again.");
    }
}

function displayImage(url) {
    const gallery = document.getElementById("gallery");
    const img = document.createElement("img");
    img.src = url;
    gallery.appendChild(img);
}
