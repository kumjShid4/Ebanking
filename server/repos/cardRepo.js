var db = require('../db/db');
var cardGenerator = require('creditcard-generator');

exports.addCard = userId => {
    var cc = cardGenerator.GenCC("VISA");
    var sql = `insert into cards(Id, Money, UserId) values('${cc[0]}', '0', '${userId}')`;
    return db.insert(sql);
};

exports.updateMoney = (cardId, money) => {
    var sql = `update cards set Money = '${money}' where Id = '${cardId}'`;
    return db.insert(sql);
};

exports.closeCard = cardId => {
    var sql = `update cards set isClosed = 1 where Id = '${cardId}'`;
    return db.insert(sql);
};

exports.load = id => {
    var sql = `select * from cards where Id = '${id}'`;
    return db.load(sql);
};

exports.cardByUser = userId => {
    var sql = `select * from cards where UserId = '${userId}'`;
    return db.load(sql);
};

exports.countOpenCardByUser = userId => {
    var sql = `select count(*) as countOpen from cards where UserId = '${userId}' and IsClosed = 0`;
    return db.load(sql);
}

exports.openCardByUser = userId => {
    var sql = `select * from cards where UserId = '${userId}' and IsClosed = 0`;
    return db.load(sql);
};

exports.loadCardUser = id => {
    var sql = `select c.*, u.Name from cards c join users u on c.UserId = u.Id where c.Id = '${id}'`;
    return db.load(sql);
}

exports.loadAllUser = () => {
    var sql = `select c.Id, c.Money, u.Username, u.Name, c.IsClosed from cards c, users u where c.UserId = u.Id`;
    return db.load(sql);
};

exports.loadUser = cardId => {
    var sql = `select c.Id, c.Money, u.Username, u.Name, c.IsClosed from cards c, users u where c.UserId = u.Id and c.Id = ${cardId}`;
    return db.load(sql);
};