// Music credits Music: Eric Skiff - Song Name - Resistor Anthems - Available at http://EricSkiff.com/music
// Effect sound: http://www.sonidosmp3gratis.com -https://www.youtube.com/audiolibrary/soundeffects?ar=1567560015087&nv=1
//Vamos a usar http://processingjs.org/
// o https://p5js.org/reference/
// Importamos las librerias


let { append, cons, first, isEmpty, isList, length, rest } = functionalLight;


//window.alert('Hi');
//Swal.fire('Any fool can use a computer')


let Arpanauts = new Howl({
  src: ['Audio/Arpanauts.mp3'],
  autoplay: false, // autoreproducción
  loop: true, // se repita
  volume: 0.2, //volumen
  rate: 1, // velocidad de reproducción
  // que pueda reproduccir en el navegador
  onplayerror: function () {
    Arpanauts.once('unlock', function () {
      Arpanauts.play();
    }); // que pueda reproduccir en el navegador
  }
});

let Nip = new Howl({
  src: ['Audio/Nip.mp3'],
  volume: 1,
  rate: 2.5,
  onplayerror: function () {
    Nip.once('unlock', function () {
      Nip.play();
    });
  }
});

let Pop = new Howl({
  src: ['Audio/Pop.mp3'],
  volume: 1,
  rate: 4.0,
  onplayerror: function () {
    Pop.once('unlock', function () {
      Pop.play();
    });
  }
});

const height = 20
const width = 20
const frame = 8
const sizemapx = 800
const sizemapy = 560
const universe = {
  mysnake: [{ x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }], direccion: { x: 1, y: 0 },
  food: newfood(), score: 0, mode: 0, highscore: 0 + JSON.parse(window.localStorage.getItem('high'))
}
//
/**
* Elimina una posicion de nuestra snake (cola).
* @param {Array} snake
* @returns {Array}
* @example deleteLast([{ x: 3, y: 1 },{ x: 2, y: 1 },{ x: 1, y: 1 }]) / => [{ x: 3, y: 1 }, { x: 2, y: 1 }]
*/



function deleteLast(snake) {
  return snake.slice(0, length(snake) - 1);
}

/**
* Genera una nueva snake, toma como referencia la "cabeza" para generar una nueva posicion.
* @param {Array} snake 
* @param {object} direction 
* @example snakeDirection(universe.mysnake,universe.direction) // => [ { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 } ]
*/

function snakeDirection(snake, direction) {
  return cons({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }, deleteLast(snake))
}

/**
* De un lista de objetos(snake) y un objeto(direction) retorna una nueva lista de objetos , donde hay un nuevo objeto que ocupa la primer posición, respetando la dirreción original
* @param {Array} snake 
* @param {Object} direction 
* @returns {Array}
*/

function growSnake(snake, direction) {
  return cons({ x: snake[0].x + direction.x, y: snake[0].y + direction.y }, snake)
}


/**
* Determinar si snake (lista de objectos) tuvo una colición contra ella misma, toma de referencia la 'cabeza' para hacer esta comparación.
* @param {Array} snake
* @returns {Boolean}
* @example crashesHer(universe.mysnake) // => false
*/

function crashesHer(snake) {
  if (length(snake) == 1) {
    return false;
  } if (snake[0].x == snake[1].x && snake[0].y == snake[1].y) {
    return true;
  } else {
    return crashesHer(cons(snake[0], rest(rest(snake))));
  }
}

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
* Determinar si snake (lista de objectos) tuvo una colicioón con algun muro, toma de referencia la 'cabeza' para hacer esta comparación.
* @param {Array} snake
* @returns {boolean}
*/
function crashWall(snake) {
  return (snake[0].x == sizemapx / width || snake[0].x < 0 || snake[0].y == sizemapy / height || snake[0].y < 0);
}


/**
* Retornar si un primer objeto de una lista(snake) pertence a otra listas de objetos(food), objetos con atributos (x,y)
* @param {Array} snake 
* @param {Array} food 
* @returns
*/


function eat(snake, food) {
  if (length(food) == 1) {
    if (snake[0].y == food[0].y - 1 && snake[0].x == food[0].x - 1) {
      return true;
    } return false;
  } return eat(snake, (rest(food)));
}


/**
* retorna un objeto con dos atributos (x, y), ambos serán un número entero entre 1 y 30
* @param {} "no param"
* @returns {Object}
*/

function newfood() {
  return [{ x: Math.floor(Math.random() * (sizemapx / width)) + 1, y: Math.floor(Math.random() * (sizemapy / height)) + 1 }]
}

// Esta funcion pinta el snake de forma aleatoria.
/*
Esta configurada para pintar colores claros dentro del rango (87-255) y la entrada
es un Math.random entre 1 y 2. Cuando la entrada es 1 pinta colores aletorios y 
cuando la entrada es 2 pinta blanco (255). Esto para los colores no varíen tan rápido.
*/
function colorrgb(n) {
  if (n == 1) {
    return (Math.floor(Math.random() * (255 - 87)) + 87);
  } {
    return 255;
  }
}

function sketchProc(processing) {
  open();
  processing.setup = function () {
    Arpanauts.play()
    processing.frameRate(frame);
    processing.size(sizemapx, sizemapy);
    processing.background(80, 80, 100);
    img = processing.loadImage("Image/image.jpg");
    mode0 = processing.loadImage("Image/play.png");
    // processing.img = processing.loadImage("image.jpg")
    processing.state = universe;
    //processing.println("hello web!");


  }


  // Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
  processing.drawGame = function (world) {
    processing.background(80, 80, 100);
    processing.fill(240, 0, 0);
    processing.noStroke();
    switch (world.mode) {
      case 1:
        processing.image(img, 0, 0);
        (world.food).forEach(part => {
          processing.ellipse(part.x * width - width / 2, part.y * height - height / 2, width - 1, height - 1);
        });
        processing.fill(colorrgb(Math.floor(Math.random() * 2)),
          colorrgb(Math.floor(Math.random() * 2)),
          colorrgb(Math.floor(Math.random() * 2)));
        (world.mysnake).forEach(part => {
          processing.rect(part.x * width, part.y * height, width, height);
        });
        processing.fill(240, 240, 240)
        processing.textFont(processing.PFont, 18);
        processing.text("Username: " + JSON.parse(window.localStorage.getItem('Name')), width, sizemapy - height * 3);
        processing.text("Score: " + world.score, width, sizemapy - height);
        processing.text("Highscore: " + ((world.score > universe.highscore) ? world.score : universe.highscore), width, sizemapy - height * 2);
        break;
      default:
        processing.image(mode0, 0, 0);
        //processing.text("CLICK TO PLAY", 400, 280, 1000);
        break;
    }

  }


  processing.onTic = function (world) {
    switch (world.mode) {
      case 1:
        if (crashWall(world.mysnake) || crashesHer(world.mysnake)) {
          if (world.score > universe.highscore) {
            window.localStorage.setItem('high', JSON.stringify(world.score))
          }
          processing.setSpeed(8)
          end(world);
          Pop.play();
          Arpanauts.stop();
          return make(world, { mysnake: [{ x: isNaN, y: isNaN }], food: [{ x: 0, y: 0 }], score: 0, mode: 0 });
        } else if (eat(world.mysnake, world.food)) {
          Nip.play();
          return make(world, { mysnake: growSnake(world.mysnake, world.direccion), food: newfood(), score: world.score + 1 });
        }
        if (world.score == frame){
          processing.setSpeed(frame * 2)
          return make(world, { mysnake: snakeDirection(world.mysnake, world.direccion) });
        }
        return make(world, { mysnake: snakeDirection(world.mysnake, world.direccion) });
        break;
      default:
        return make(universe, { food: newfood() });
        break;
    }
  }




  processing.onKeyEvent = function (world, keyCode) {
    switch (world.mode) {
      case 1:
        if (crashWall(world.mysnake) || crashesHer(world.mysnake)) {
          Pop.play();
          Arpanauts.stop();
          processing.setSpeed(frame);
          return make(world, { mysnake: [{ x: isNaN, y: isNaN }], food: [{ x: 0, y: 0 }], score: 0, mode: 0 });
        } switch (keyCode) {
          case processing.UP:
            if (world.direccion.y === 1) {
              return make(world, {});
            } else {
              return make(world, { direccion: { x: 0, y: -1 } });
            }
            break;
          case processing.DOWN:
            if (world.direccion.y === -1) {
              return make(world, {});
            } else {
              return make(world, { direccion: { x: 0, y: 1 } });
            }
            break;
          case processing.LEFT:
            if (world.direccion.x === 1) {
              return make(world, {});
            } else {
              return make(world, { direccion: { x: -1, y: -0 } });
            }
            break;
          case processing.RIGHT:
            if (world.direccion.x === -1) {
              return make(world, {});
            } else {
              return make(world, { direccion: { x: 1, y: 0 } });
            }
            break;
          case 32:
            return make(world, { mysnake: growSnake(world.mysnake, world.direccion) });
            break;
          case 78:
            processing.setSpeed(frame);
            Arpanauts.play();
            return make(universe, { food: newfood() });
            break;
          case 17:
            processing.setSpeed(30);
            return make(world, {});
            break;
          default:
            console.log(keyCode);
            return make(world, {});
            break;
        }
      case 2:
        break;
      default:
        console.log(keyCode);
        return make(world, {});
        break;
    }
  }

  processing.onMouseEvent = function (world, event) {
    if (event.action === 'click') {
      return make(world, { mode: 1 })
    }
    return make(world, {});
  }

  // Esta es la función que pinta todo. Se ejecuta 60 veces por segundo. 
  // No cambie esta función. Su código debe ir en drawGame
  processing.draw = function () {
    processing.drawGame(processing.state);
    processing.state = processing.onTic(processing.state);
  };

  // Esta función se ejecuta cada vez que presionamos una tecla. 
  // No cambie esta función. Su código debe ir en onKeyEvent
  processing.keyPressed = function () {
    processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
  }
  // llama un alert al cargar la pagina, pedirá un nombre de usuario o lo hará por defecto
  function open() {
    (async () => {

      const { value: name } = await Swal.fire({
        position: 'center',
        title: 'Disfruta el juego',
        text: "Ingresa un nombre de usuario",
        type: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Jugar',
        input: 'text',
        inputPlaceholder: 'Username',
        inputValidator: (value) => {
          if (!value) {
            value = 'Unnamed'
            window.localStorage.setItem('Name', JSON.stringify(value))
          } window.localStorage.setItem('Name', JSON.stringify(value))
  
        }
      })  
    })()
      //imageUrl: 'C:/Users/Chris/Documents/Snake Game/web-lib/prueba.gif',
      //imageWidth: 200,
      //imageHeight: 200,
      //imageAlt: 'Custom image',
    
  };


// alert cuando el juego termina, "reinicia el juego" 
  function end(world) {
    Swal.fire({
      title: 'GAME OVER',
      text: "Puntaje total: " + world.score,
      type: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Jugar nuevamente'
    }).then((result) => {
      if (result.value) {
        Arpanauts.play()
        console.log(world);
      }
    })
  };

  processing.mouseMoved = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "move", mouseX: processing.mouseX, mouseY: processing.mouseY });
  }

  // Estas funciones controlan los eventos del mouse. 
  // No cambie estas funciones. Su código debe ir en OnMouseEvent
  processing.mouseClicked = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "click", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mouseDragged = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "drag", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mousePressed = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "press", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.mouseReleased = function () {
    processing.state = processing.onMouseEvent(processing.state,
      { action: "release", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
  }

  processing.setSpeed = function(value) {
    processing.frameRate(value);
  }
  
}



var canvas = document.getElementById("canvas");

// Adjuntamos nuestro sketch al framework de processing
var processingInstance = new Processing(canvas, sketchProc);
