import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const taskPath = join(__dirname, 'tasks', 'example.js');
console.log('Путь к файлу задачи:', taskPath);
console.log('Файл существует:', existsSync(taskPath));

try {
    const taskModule = await import(taskPath);
    console.log('Модуль успешно импортирован:', taskModule);
} catch (error) {
    console.error('Ошибка импорта:', error);
} 