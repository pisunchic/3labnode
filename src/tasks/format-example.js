/**
 * Пример задачи, демонстрирующей работу с разными форматами входных данных
 * Задача принимает различные типы входных данных и возвращает их в обратном порядке
 */

// Обработка строковых параметров
function processStrings(...args) {
  return args.reverse().join(' ');
}

// Обработка массивов
function processArrays(...arrays) {
  return arrays.map(arr => [...arr].reverse());
}

// Обработка JSON
function processJson(data) {
  if (Array.isArray(data)) {
    return [...data].reverse();
  }
  if (typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data).reverse()) {
      result[key] = value;
    }
    return result;
  }
  return data;
}

export function process(...args) {
  // Определяем тип входных данных
  if (args.length === 1 && typeof args[0] === 'object') {
    return processJson(args[0]);
  }
  
  if (args.every(arg => Array.isArray(arg))) {
    return processArrays(...args);
  }
  
  return processStrings(...args);
} 