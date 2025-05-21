#!/usr/bin/env node

import { Command } from 'commander';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Transform } from 'stream';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { access } from 'fs/promises';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// Настройка CLI с значениями по умолчанию
program
  .name('cli-tasks')
  .description('CLI инструмент для решения задач с поддержкой потоковой обработки данных')
  .option('-i, --input <path>', 'путь к входному файлу')
  .option('-o, --output <path>', 'путь к выходному файлу')
  .option('-t, --task <name>', 'название задачи', 'sortme')  // по умолчанию sortme
  .option('-f, --format <format>', 'формат входных данных (string, array, json)', 'string')
  .option('-d, --delimiter <char>', 'разделитель для множественных параметров', ':')
  .parse(process.argv);

const options = program.opts();

// Проверка существования и доступности файлов
async function validateFiles() {
  if (options.input) {
    try {
      await access(options.input);
    } catch (error) {
      console.error(`Ошибка: Входной файл '${options.input}' не существует или недоступен`);
      process.exit(1);
    }
  }

  if (options.output) {
    try {
      await access(options.output);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Ошибка: Выходной файл '${options.output}' недоступен`);
        process.exit(1);
      }
    }
  }
}

// Парсинг входных данных
function parseInput(input) {
  try {
    // Если строка начинается с [, парсим как JSON-массив
    if (input.trim().startsWith('[')) {
      return JSON.parse(input);
    }
    // Иначе разбиваем по разделителю и возвращаем массив
    return input.split(options.delimiter).map(s => s.trim()).filter(s => s);
  } catch (error) {
    throw new Error(`Ошибка парсинга входных данных: ${error.message}`);
  }
}

// Создание потока для задачи
async function createTaskStream(taskName) {
  try {
    const taskPath = join(__dirname, 'tasks', `${taskName}.js`);
    const taskUrl = 'file://' + taskPath.replace(/\\/g, '/');
    console.log(`Задача: ${taskName}`);
    
    const taskModule = await import(taskUrl);
    return new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          const input = chunk.toString().trim();
          if (!input) {
            callback(null, ''); // Пропускаем пустые строки
            return;
          }

          const parsedInput = parseInput(input);
          const result = taskModule.process(parsedInput);
          
          // Преобразуем результат в строку, если это не строка
          const output = typeof result === 'string' ? result : JSON.stringify(result);
          callback(null, output + '\n');
        } catch (error) {
          callback(error);
        }
      }
    });
  } catch (error) {
    console.error(`Ошибка: Задача '${taskName}' не найдена`);
    process.exit(1);
  }
}

// Чтение из stdin с поддержкой многострочного ввода
async function* readStdin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  console.log('Введите массив строк в формате JSON (например: ["Hello", "there", "I\'m", "fine"])');
  console.log('или строки, разделенные двоеточием (например: Hello:there:I\'m:fine)');
  console.log('Для выхода нажмите Ctrl+C\n');

  for await (const line of rl) {
    if (line.trim()) {
      yield line;
      console.log('\nВведите следующую строку или Ctrl+C для выхода:');
    }
  }
}

// Основная функция
async function main() {
  await validateFiles();

  const inputStream = options.input 
    ? createReadStream(options.input)
    : readStdin();

  const outputStream = options.output
    ? createWriteStream(options.output)
    : process.stdout;

  const taskStream = await createTaskStream(options.task);

  try {
    await pipeline(
      inputStream,
      taskStream,
      outputStream
    );

    // Если читаем из файла, завершаем процесс
    if (options.input) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Ошибка при обработке данных:', error.message);
    process.exit(1);
  }
}

// Обработка Ctrl+C
process.on('SIGINT', () => {
  console.log('\nПрограмма завершена');
  process.exit(0);
});

main().catch(error => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
}); 