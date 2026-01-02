const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const openDb = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize DB
(async () => {
    try {
        const db = await openDb();
        // Create Tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                price REAL,
                author TEXT,
                category TEXT,
                img TEXT
            );
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT,
                name TEXT,
                role TEXT
            );
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT,
                total REAL,
                status TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                text TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database initialized');

        // Seed Products if empty
        const count = await db.get('SELECT count(*) as count FROM products');
        if (count.count === 0) {
            console.log('Seeding products...');
            const products = [
                { title: 'غاتسبي العظيم', price: 45, author: 'ف. سكوت', category: 'روايات', img: '/images/great-gatsby.jpg' },
                { title: 'العادات الذرية', price: 55, author: 'جيمس كلير', category: 'تطوير الذات', img: '/images/atomic-habits.jpg' },
                { title: '1984', price: 38, author: 'جورج أورويل', category: 'روايات', img: '/images/1984.jpg' },
                { title: 'الخيميائي', price: 42, author: 'باولو كويلو', category: 'روايات', img: '/images/alchemist.jpg' },
                { title: 'تاريخ موجز للزمن', price: 65, author: 'ستيفن هوكينج', category: 'علوم', img: '/images/brief-history-time.jpg' },
                { title: 'بداية اللانهاية', price: 70, author: 'ديفيد دويت', category: 'علوم', img: '/images/beginning-infinity.jpg' },
                { title: 'مقدمة ابن خلدون', price: 80, author: 'ابن خلدون', category: 'تاريخ', img: '/images/ibn-khaldun.jpg' },
                { title: 'البؤساء', price: 70, author: 'فيكتور هوجو', category: 'روايات', img: '/images/les_miserables.jpg' }
            ];

            for (const p of products) {
                await db.run('INSERT INTO products (title, price, author, category, img) VALUES (?, ?, ?, ?, ?)', [p.title, p.price, p.author, p.category, p.img]);
            }
            console.log('Products seeded');
        }

        // Seed Admin User
        const admin = await db.get('SELECT * FROM users WHERE email = ?', 'admin@bookstore.com');
        if (!admin) {
            await db.run('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', ['admin@bookstore.com', 'admin', 'المدير', 'admin']);
            console.log('Admin user created');
        }

    } catch (e) {
        console.error('Error initializing DB', e);
    }
})();

app.get('/', (req, res) => {
    res.send('Bookstore API Running');
});

// Routes
app.get('/api/products', async (req, res) => {
    const db = await openDb();
    const products = await db.all('SELECT * FROM products');
    res.json(products);
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await openDb();
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (user) {
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Basic Order endpoints
app.post('/api/orders', async (req, res) => {
    const { customer_name, total, items } = req.body;
    const db = await openDb();
    const result = await db.run('INSERT INTO orders (customer_name, total, status) VALUES (?, ?, ?)', [customer_name, total, 'قيد الانتظار']);
    res.json({ success: true, orderId: result.lastID });
});

app.get('/api/orders', async (req, res) => {
    const db = await openDb();
    const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
});

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const db = await openDb();

    // Check if user exists
    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    try {
        const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, 'user']);
        const user = { id: result.lastID, name, email, role: 'user' };
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    const { status } = req.body;
    const db = await openDb();
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
});

app.get('/api/messages', async (req, res) => {
    const db = await openDb();
    const messages = await db.all('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
});

app.post('/api/messages', async (req, res) => {
    const { name, text } = req.body;
    const db = await openDb();
    await db.run('INSERT INTO messages (name, text) VALUES (?, ?)', [name, text]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
