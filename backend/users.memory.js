//es un almacen temporal para probar antes de la bd
const users = [];
exports.findByEmail = (email) => users.find(u => u.email === email) || null;
exports.create = (u) => (users.push(u), u);
