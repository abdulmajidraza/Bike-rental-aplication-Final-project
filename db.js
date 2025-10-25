const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data');

class Database {
  constructor(filename) {
    this.filePath = path.join(dbPath, filename);
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll() {
    return this.read();
  }

  findById(id) {
    const data = this.read();
    return data.find(item => item._id === id);
  }

  findOne(query) {
    const data = this.read();
    return data.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  find(query = {}) {
    const data = this.read();
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  create(item) {
    const data = this.read();
    const newItem = {
      _id: this.generateId(),
      ...item,
      createdAt: new Date().toISOString()
    };
    data.push(newItem);
    this.write(data);
    return newItem;
  }

  update(id, updates) {
    const data = this.read();
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    this.write(data);
    return data[index];
  }

  delete(id) {
    const data = this.read();
    const filtered = data.filter(item => item._id !== id);
    this.write(filtered);
    return filtered.length < data.length;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = {
  users: new Database('users.json'),
  bikes: new Database('bikes.json'),
  bookings: new Database('bookings.json'),
  payments: new Database('payments.json')
};
