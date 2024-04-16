const express = require('express');
const mongoose = require('mongoose');
const objectId = require('mongoose').Types.ObjectId;
// Створення екземпляра додатку Express
const app = express();
// Middleware для роботи з JSON
const jsonParser = express.json();

// Визначення схеми
const sessionschema = new mongoose.Schema({
    film: String, // Назва фільму
    hall: Number, // Номер залу
    date: Date, // Дата сеансу
    time: String // Час сеансу
});
// Створення моделі для колекції сеансів на основі схеми
const Session = mongoose.model('Session', sessionschema);
// Встановлення статичного каталогу для публічних ресурсів
app.use(express.static(__dirname + '/public'));
// Підключення до бази даних MongoDB
mongoose.connect('mongodb://localhost:27017/cinema', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        // Запуск сервера на порті 3000 після успішного підключення до бази даних
        app.listen(3000, function () {
            // Виведення повідомлення про очікування підключення
            console.log('Waiting for connection...');
        });
    })
    .catch(err => {
        // Виведення повідомлення про очікування підключення
        console.error('Failed to connect to MongoDB', err);
    });
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
app.post('/api/sessions', jsonParser, async (req, res) => {
    if (!req.body || !req.body.film) {
        return res.status(400).send('Film name is required');
    }
    // Отримання параметрів з тіла запиту
    const filmName = req.body.film;
    const hallNumber = req.body.hall;
    const sessionDate = req.body.date;
    const sessionTime = req.body.time;
    // Створення нового об'єкта сеансу
    const session = new Session({
        film: filmName,
        hall: hallNumber,
        date: sessionDate,
        time: sessionTime
    });

    try {
        // Збереження нового сеансу у базі даних
        const savedSession = await session.save();
        res.send(savedSession);
    } catch (err) {
        // Виведення помилки, якщо вона виникла
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
app.put('/api/sessions/:id', jsonParser, async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    // Отримання параметрів з тіла запиту
    const filmName = req.body.film;
    const hallNumber = req.body.hall;
    const sessionDate = req.body.date;
    const sessionTime = req.body.time;

    try {
        const updatedSession = await Session.findByIdAndUpdate(
            req.params.id,
            { $set: { hall: hallNumber, film: filmName, date: sessionDate, time: sessionTime } },
            { new: true }
        );
        if (!updatedSession) {
            return res.status(404).send('Session not found');
        }
        res.send(updatedSession);
    } catch (err) {
        // Виведення помилки, якщо вона виникла
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Обробка сигналу SIGINT для закриття підключення до бази даних
process.on('SIGINT', () => {
    // Закриття підключення до бази даних MongoDB
    mongoose.connection.close();
    // Вихід з процесу
    process.exit();
});