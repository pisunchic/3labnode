/**
 * Задача вычисления Манхэттенского расстояния между двумя точками
 * Принимает массив из двух точек (массивов с координатами x,y) и возвращает расстояние
 * Примеры:
 * manhattanDistance([[1, 1], [1, 1]]) => 0
 * manhattanDistance([[5, 4], [3, 2]]) => 4
 * manhattanDistance([[1, 1], [0, 3]]) => 3
 */

export function process(points) {
    // Проверяем, что входные данные - это массив из двух точек
    if (!Array.isArray(points) || points.length !== 2 || 
        !Array.isArray(points[0]) || !Array.isArray(points[1]) ||
        points[0].length !== 2 || points[1].length !== 2) {
        throw new Error('Входные данные должны быть двумя точками (массивами с координатами x,y)');
    }

    const [point1, point2] = points;

    // Проверяем, что координаты - числа
    if (!point1.every(coord => typeof coord === 'number') || 
        !point2.every(coord => typeof coord === 'number')) {
        throw new Error('Координаты должны быть числами');
    }

    // Вычисляем Манхэттенское расстояние
    // |x1 - x2| + |y1 - y2|
    return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
} 