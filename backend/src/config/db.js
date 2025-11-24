 import mongoose from 'mongoose';


export async function connectDB(uri) {
try {
mongoose.set('strictQuery', true);
await mongoose.connect(uri);
console.log('✅ MongoDB conectado');
} catch (err) {
console.error('❌ Erro ao conectar no MongoDB:', err.message);
process.exit(1);
}
}
