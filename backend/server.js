// my-backend/server.js
const express = require('express');
const multer = require('multer'); // Middleware for handling multipart/form-data (file uploads)
const sqlite3 = require('sqlite3').verbose(); // SQLite database driver
const path = require('path'); // Node.js path module for working with file paths
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing

const app = express();
const PORT = 3000; // The port your backend server will listen on

// --- Middleware Setup ---
// Enable CORS for all origins (for development purposes).
// In production, you should restrict this to your Angular app's origin (e.g., origin: 'http://localhost:4200').
app.use(cors());

// Body parser for JSON and URL-encoded data.
// Multer will handle multipart/form-data, so these are for other types of requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- File Storage Setup with Multer ---
// Configure Multer to specify where to store files and how to name them.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); // Files will be saved in a 'uploads' folder relative to server.js
        // Ensure the 'uploads' directory exists. If not, create it.
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath); // Callback function: null for no error, then the destination path.
    },
    filename: (req, file, cb) => {
        // Generate a unique filename to prevent collisions.
        // Appends current timestamp to the original filename.
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- SQLite Database Setup ---
// Connect to the SQLite database. If 'data.db' doesn't exist, it will be created.
const db = new sqlite3.Database(path.join(__dirname, 'data.db'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    }
    console.log('Connected to the SQLite database.');
    // Create the 'contacts' table if it doesn't already exist.
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            numero TEXT NOT NULL,
            type TEXT NOT NULL,
            email TEXT NOT NULL,
            image_path TEXT -- This column will store the path to the uploaded image
        )
    `, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err.message);
        } else {
            console.log('Contacts table ensured to exist.');
        }
    });
});

// --- API Endpoints ---

// POST endpoint for creating a contact with an image.
// 'upload.single('image')' tells Multer to expect a single file field named 'image'
// from the incoming form data.
app.post('/api/contacts', upload.single('image'), (req, res) => {
    const { prenom, nom, numero, type, email } = req.body;
    // Get the path of the uploaded file if one was provided.
    // req.file contains information about the uploaded file from Multer.
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Store a relative path that your frontend can use to access the image

    // Basic validation for text fields
    if (!prenom || !nom || !numero || !type || !email) {
        // If essential text fields are missing, respond with an error.
        // You might want more robust validation here.
        return res.status(400).json({ error: 'All essential text fields are required.' });
    }

    // Insert data into the SQLite database.
    const stmt = db.prepare(
        'INSERT INTO contacts (prenom, nom, numero, type, email, image_path) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(prenom, nom, numero, type, email, imagePath, function(err) {
        if (err) {
            // If an error occurs during insertion, log it and send a 500 response.
            console.error('Error inserting contact into DB:', err.message);
            return res.status(500).json({ error: err.message });
        }
        // Respond with success message and the ID of the new contact.
        // 'this.lastID' is available in the callback of db.run for INSERT statements.
        res.status(201).json({
            message: 'Contact created successfully with image',
            id: this.lastID, // The ID of the newly inserted row
            imagePath: imagePath // The path where the image can be accessed
        });
    });
    // Finalize the statement (releases resources).
    stmt.finalize();
});

// Optional: POST endpoint for creating a contact without an image.
// This is useful if the image is not always required.
app.post('/api/contacts-no-image', (req, res) => {
    const { prenom, nom, numero, type, email } = req.body;

    if (!prenom || !nom || !numero || !type || !email) {
        return res.status(400).json({ error: 'All essential text fields are required.' });
    }

    const stmt = db.prepare(
        'INSERT INTO contacts (prenom, nom, numero, type, email, image_path) VALUES (?, ?, ?, ?, ?, NULL)'
    );
    stmt.run(prenom, nom, numero, type, email, function(err) {
        if (err) {
            console.error('Error inserting contact (no image) into DB:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Contact created successfully without image',
            id: this.lastID
        });
    });
    stmt.finalize();
});

// Serve static files from the 'uploads' directory.
// This allows your Angular app to request images from e.g., http://localhost:3000/uploads/your-image.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open your Angular app (usually http://localhost:4200) and submit the form.`);
});

// Handle graceful shutdown of the database connection
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the SQLite database connection.');
        process.exit(0);
    });
});