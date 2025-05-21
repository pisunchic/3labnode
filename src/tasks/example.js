/**
 * Пример задачи для демонстрации работы CLI
 * Эта задача просто переворачивает входную строку
 */

const process = (input) => {
  return input.split('').reverse().join('') + '\n';
};

export { process }; 