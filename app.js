const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Створення екземпляра додатку Express
const app = express();
// Middleware для роботи з JSON
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

// Визначення схеми
const sessionschema = new Schema({
    film: String, // Назва фільму
    hall: Number, // Номер залу
    date: Date, // Дата сеансу
    time: String // Час сеансу
}, { versionKey: false });
// Створення моделі для колекції сеансів на основі схеми
const Session = mongoose.model('Session', sessionschema);
// Встановлення статичного каталогу для публічних ресурсів
app.use(express.static(__dirname + '/public'));
// Підключення до бази даних MongoDB
mongoose.connect(url, options).then(() => {
    // Запуск сервера на порті 3000 після успішного підключення до бази даних
    app.listen(3000, function () {
        // Виведення повідомлення про очікування підключення
        console.log('Waiting for connection...');
    });
});
app.use(express.json());
// Маршрутизація для отримання всіх сеансів
app.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await Session.find({});
        res.send(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Маршрутизація для отримання одного сеансу за ідентифікатором
app.get('/api/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).send('Session not found');
        }
        res.send(session);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Маршрутизація для створення нового сеансу
app.post('/api/sessions', async (req, res) => {
    try {
        const { film, hall, date, time } = req.body;
        // Валідація даних
        if (!film || !hall || !date || !time) {
            return res.status(400).send('Missing required fields');
        }
        // Створення нового сеансу
        const session = new Session({ film, hall, date, time });
        // Створення нового сеансу в базі даних
        const savedSession = await session.save();
        res.send(savedSession);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Маршрутизація для видалення сеансу за ідентифікатором
app.delete('/api/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).send('Session not found');
        }
        res.send(session);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Маршрутизація для оновлення інформації про сеанс за ідентифікатором
app.put('/api/sessions/:id', async (req, res) => {
    try {
        const { film, hall, date, time } = req.body;
        // Валідація даних
        if (!film || !hall || !date || !time) {
            return res.status(400).send('Missing required fields');
        }
        // Оновлення сеансу в БД
        const updatedSession = await Session.findByIdAndUpdate(
            req.params.id,
            { film, hall, date, time },
            { new: true }
        );
        if (!updatedSession) {
            return res.status(404).send('Session not found');
        }
        res.send(updatedSession);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Обробка сигналу SIGINT для закриття підключення до бази даних
process.on('SIGINT', async () => {
    try {
        // Закриття підключення до БД
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (err) {
        console.error(err);
    } finally {
        // Закриваємо процесс
        process.exit();
    }
});