let { append, cons, first, isEmpty, isList, length, rest } = functionalLight;

/**
 * En este archivos se almacenaran las funciones que puedan o seran usadas en el proyecto snake game.
 * Recordar documentar todas la funciones.
 */

const width = 20
const height = 20
const sizemapw = 800
const sizemaph = 560
const universe = { mysnake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], direction: { x: 1, y: 0 }, sentido: 'right',
food: newfood(), score: 0 , highScore: 0 }

/**
  * Retorna una copia de un objeto, puede tener nuevos atributos o dar un nuevo valor para los existentes
  * @param {Object} snake
  * @param {} attribute
  * @returns {Object}
*/
  
function make(data, attribute) {
    return Object.assign({}, data, attribute);
}


/**
 * Elimina una posicion de nuestra snake (cola).
 * @param {Array} snake
 * @returns {Array}
 * @example deleteLast([{ x: 3, y: 1 },{ x: 2, y: 1 },{ x: 1, y: 1 }]) / => [{ x: 3, y: 1 }, { x: 2, y: 1 }]
 */

function deleteLast (snake) {
    return snake.slice(0,length(snake)-1);
}

/**
 * Genera una nueva snake, toma como referencia la "cabeza" para generar una nueva posicion.
 * @param {Array} snake 
 * @param {object} direction 
 * @example snakeDirection(universe.mysnake,universe.direction) // => [ { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 } ]
 */
function snakeDirection(snake, direction) {
    const head = first(snake)
    return cons({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }, deleteLast(snake))
}

/**
 * Determinar si snake (lista de objectos) tuvo una colición contra ella misma, toma de referencia la 'cabeza' para hacer esta comparación.
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

/**
 * Determinar si snake (lista de objectos) tuvo una colicioón con algun muro, toma de referencia la 'cabeza' para hacer esta comparación.
 * @param {Array} snake
 * @returns {boolean}
 */

function crashWall (snake) {
    return (snake[0].x == sizemapw / width || snake[0].x < 0 || snake[0].y == sizemaph / height || snake[0].y < 0);
}

/**
 * De un lista de objetos(snake) y un objeto(direction) retorna una nueva lista de objetos , donde hay un nuevo objeto que ocupa la primer posición, respetando la dirreción original
 * @param {Array} snake 
 * @param {Object} direction 
 * @returns {Array}
 */

function growSnake (snake, direction) {
    return cons({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }, snake)
}

/**
 * retorna un objeto con dos atributos (x, y), ambos serán un número entero entre 1 y 30
 * @param {} "no param"
 * @returns {Object}
 */

function newfood() {
    return cons({x: Math.ceil(Math.random()*(sizemapw / width )), y: Math.ceil(Math.random()*(sizemaph / height))}, [])
}

/**
 * 
 * @param {Array} snake 
 * @param {} food 
 */
function eat(snake, food) {
    if ((first(snake)).y == ((first(food)).y - 1 ) && (first(snake)).x == ((first(food)).x - 1)){
      return true
    } else { 
      return false
    }  
}

//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/
// Importamos las librerias

function sketchProc(processing) {
/**
* Esto se llama antes de iniciar el juego
*/
processing.setup = function () {
processing.frameRate(10);
processing.size(sizemapw,sizemaph);
processing.background(171, 164, 164);
processing.state = universe;
window.onload=function(){Swal.fire({
    position: 'center',
    title: 'Disfruta el juego',
    text: "Intruciones: w/ up, s/ down, a/ left, d/ right",
    type: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Jugar &rarr;',
    imageUrl: 'C:/Users/Chris/Documents/Snake Game/web-lib/prueba.gif',
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: 'Custom image',
})}
};
// Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar

processing.drawGame = function (universe) {
processing.background(171, 164, 164);
processing.fill(254,65,31)
processing.fill(213, 20, 20);
(universe.food).forEach(part => {
processing.ellipse(part.x * width - width / 2, part.y * height - height / 2, width - 1, height - 1);
});
processing.fill(1, 1, 1);
(universe.mysnake).forEach(part =>  {
processing.rect(part.x * width, part.y * height, width, height);
});
processing.text("Score: " + universe.score, width, sizemaph - height)
}

// Esta es la función que pinta todo. Se ejecuta 60 veces por segundo. 
// No cambie esta función. Su código debe ir en drawGame

processing.draw = function () {
processing.drawGame(processing.state);
processing.state = processing.onTic(processing.state);
};

/**
* Actualiza el mundo en cada tic del reloj. Retorna el nuevo stado del mundo
*/
processing.onTic = function (universe) {
    if (crashWall(universe.mysnake) || crashesHer(universe.mysnake)){
        return   Swal.fire({
            title: 'GAME OVER',
            text: "Puntaje total: ",
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Salir",
            confirmButtonText: 'Jugar nuevamente'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            }
          })
          }

if (eat(universe.mysnake,universe.food)) {
        return make(universe, {mysnake: growSnake(universe.mysnake,universe.direction), food: newfood() , score: universe.score + 1 });
} return make(universe, {mysnake: snakeDirection(universe.mysnake,universe.direction)});
}
/**
* Actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo stado del mundo
*/
processing.onKeyEvent = function (universe, keyCode) {
if (crashWall(universe.mysnake) || crashesHer(universe.mysnake)) {
    return make (universe, {mysnake: [{x: isNaN , y: isNaN }]}) }
switch (keyCode) {
  case processing.UP:
      return make(universe, { direction: {x: 0, y: -1} });
      break;
  case processing.DOWN:
      return make(universe, { direction:{x: 0, y: 1} });
      break;
  case processing.LEFT:
      return make(universe, { direction: {x:-1, y: -0}  });
      break;
  case processing.RIGHT:
      return make(universe, { direction: {x: 1, y: 0} });
      break;
  case 107:
      return make(universe, { });
      break;
  case 109:
      return make(universe, { });
      break;
  default:
     console.log(keyCode);
     return make(universe, {}); 
}
}

// Esta función se ejecuta cada vez que presionamos una tecla. 
// No cambie esta función. Su código debe ir en onKeyEvent
processing.keyPressed = function () {
processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
}

}
var canvas = document.getElementById("canvas");
// Adjuntamos nuestro sketch al framework de processing
var processingInstance = new Processing(canvas, sketchProc);
