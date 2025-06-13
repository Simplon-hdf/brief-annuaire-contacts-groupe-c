const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); 
const cors = require('cors'); 

const app = express();
const PORT = 3000; 

// --- Middleware Setup ---
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- File Storage Setup with Multer ---

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads'); 
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- SQLite Database Setup ---
const db = new sqlite3.Database(path.join(__dirname, 'data.db'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    }
    console.log('Connected to the SQLite database.');

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

app.get('/api/contacts', (req, res) => {
    const sql = `SELECT id, prenom, nom, numero, type, email, image_path FROM contacts`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error on GET /api/contacts:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
        console.log(`Successfully retrieved ${rows.length} contacts.`);
    });
});

app.post('/api/contacts', upload.single('image'), (req, res) => {
    const { prenom, nom, numero, type, email } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null; 

    if (!prenom || !nom || !numero || !type || !email) {
        return res.status(400).json({ error: 'All essential text fields are required.' });
    }

    const stmt = db.prepare(
        'INSERT INTO contacts (prenom, nom, numero, type, email, image_path) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(prenom, nom, numero, type, email, imagePath, function(err) {
        if (err) {
            console.error('Error inserting contact into DB:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Contact created successfully with image',
            id: this.lastID, 
            imagePath: imagePath 
        });
    });
    stmt.finalize();
});

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open your Angular app (usually http://localhost:4200) and submit the form.`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the SQLite database connection.');
        process.exit(0);
    });
});