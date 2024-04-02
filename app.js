// Імпортуємо необхідні модулі
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
// Створюємо екземпляр Express
const app = express();
// Парсер для JSON
const jsonParser = express.json();
// Створюємо новий екземпляр MongoClient з URL-адресою MongoDB
const mongoClient = new MongoClient("mongodb://localhost:27017/cinema", { useUnifiedTopology: true });
// Змінна для зберігання підключення до MongoDB
let dbClient;
// Налаштовуємо директорію для статичних файлів
app.use(express.static(__dirname + "/public"));
// Підключаємось до MongoDB
mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    // Отримуємо колекцію "films" з бази даних "cinema"
    app.locals.collection = client.db("cinema").collection("films");
    // Запускаємо сервер на порту 3000
    app.listen(3000, function () {
        console.log("Waiting for connection...");
    });
});
// Обробник для GET-запиту на /api/films
app.get("/api/films", function (req, res) {
    const collection = req.app.locals.collection;
    // Отримуємо всі документи з колекції "films"
    collection.find({}).toArray(function (err, films) {
        if (err) return console.log(err);
        res.send(films)
    });
});
// Обробник для GET-запиту на /api/films/:id
app.get("/api/films/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    // Отримуємо документ з колекції "films" за його id
    collection.findOne({ _id: id }, function (err, film) {
        if (err) return console.log(err);
        res.send(film);
    });
});
// Обробник для POST-запиту на /api/films
app.post("/api/films", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const filmName = req.body.name;
    const hallNumber = req.body.hall;
    const film = { name: filmName, hall: hallNumber };
    const collection = req.app.locals.collection;
    // Додаємо новий документ в колекцію "films"
    collection.insertOne(film, function (err, result) {
        if (err) return console.log(err);
        res.send(film);
    });
});
// Обробник для DELETE-запиту на /api/films/:id
app.delete("/api/films/:id", function (req, res) {
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    // Видаляємо документ з колекції "films" за його id
    collection.findOneAndDelete({ _id: id }, function (err, result) {
        if (err) return console.log(err);
        let film = result.value;
        res.send(film);
    });
});
// Обробник для PUT-запиту на /api/films/:id
app.put("/api/films/:id", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const id = new objectId(req.params.id); // получаем id из URL
    const filmName = req.body.name;
    const hallNumber = req.body.hall;
    const collection = req.app.locals.collection;
    // Оновлюємо документ в колекції "films" за його id
    collection.findOneAndUpdate(
        { _id: id },
        { $set: { hall: hallNumber, name: filmName } },
        { returnDocument: "after" },
        function (err, result) {
            if (err) return console.log(err);
            const film = result.value;
            res.send(film);
        }
    );
});
// Обробник для закриття з'єднання з MongoDB при виході
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
