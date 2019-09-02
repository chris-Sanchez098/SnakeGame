const { cons, first, rest, isEmpty, isList, length, append, filter, map } = require('functional-light');

/**
 * En este archivos se almacenaran las funciones que puedan o seran usadas en el proyecto snake game.
 * Recordar documentar todas la funciones.
 */

universe = { mysnake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], direction: { x: 1, y: 0 }, sentido: 'right',
food: 0, score: 0 , highScore: 0 }

/**
 * Elimina una posicion de nuestra snake (cola).
 * @param {Array} snake
 * @returns {Array}
 * @example delUltimate([{ x: 3, y: 1 },{ x: 2, y: 1 },{ x: 1, y: 1 }]) / => [{ x: 3, y: 1 }, { x: 2, y: 1 }]
 */

function delUltimate (snake) {
    if (length(snake) == 1) {
        return [];
    } return cons(first(snake), delUltimate(rest(snake)));
}

/**
 * Genera una nueva snake, toma como referencia la "cabeza" para generar una nueva posicion.
 * @param {Array} snake 
 * @param {object} direction 
 * @example snakeDirection(universe.mysnake,universe.direction) // => [ { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 } ]
 */
function snakeDirection(snake, direction) {
    const head = first(snake)
    return cons ({x: head.x + direction.x, y: head.y + direction.y},delUltimate(snake))
}

/**
 * Determina si la snake se choco consigo mismo, toma de referencia la 'cabeza' para hacer esta comparación.
 * @param {Array} snake
 * @returns {Boolean}
 * @example crashesHer(universe.mysnake) // => false
 */
function crashesHer (snake) {
    if (length(snake) == 1) {
        return false; 
    } if (snake[0].x == snake[1].x && snake[0].y == snake[1].y) {
        return true;
    } else {
        return crashesHer(cons(snake[0],rest(rest(snake))));
    }
}