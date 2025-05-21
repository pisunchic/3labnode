/**
 * Задача сортировки массива строк без учета регистра
 * Принимает массив строк и возвращает отсортированный массив
 * Пример:
 * sortme(["Hello", "there", "I'm", "fine"]) -> ["fine", "Hello", "I'm", "there"]
 * sortme(["C", "d", "a", "B"]) -> ["a", "B", "C", "d"]
 */

export function process(input) {
    // Проверяем, что входные данные - это массив
    if (!Array.isArray(input)) {
        throw new Error('Входные данные должны быть массивом строк');
    }

    // Проверяем, что все элементы массива - строки
    if (!input.every(item => typeof item === 'string')) {
        throw new Error('Все элементы массива должны быть строками');
    }

    // Сортируем массив без учета регистра
    return input.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
} 