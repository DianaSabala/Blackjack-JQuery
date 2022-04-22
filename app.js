//--variables y constantes--
let baraja = [];
let carta = '';
let puntosJugador = 0;
let puntosComputadora = 0;
const numeros = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const letras = ['J', 'Q', 'K', 'A'];
const palo = ['C', 'D', 'H', 'S'];


//Funciones
function crearBaraja() {
    baraja = [];

    for(const n of numeros) {
        for(const p of palo) {
            baraja.push(n + p);
        }
    }
    
    letras.forEach((l) => {
        palo.forEach((p) => {
            baraja.push(l + p);
        });
    });
    
    baraja = _.shuffle(baraja);
    return baraja;
}

function pedirCarta() {
    carta = baraja.shift();
    const cartaHtml = $('#cartasJugador').html() + '<img src="./assets/' + carta + '.png" />';
    $('#cartasJugador').html(cartaHtml);
    return carta;
}

function sumarPuntos(carta) {
    let puntos = 0;
    let valorCarta = carta.slice(0, -1);

    if(letras.includes(valorCarta)) {
        puntos = valorCarta === 'A' ? 11 : 10;
    }
    else {
        puntos = valorCarta * 1;
    }

    return puntos;
}

function turnoJugador() {
    let carta = pedirCarta();
    let puntos = sumarPuntos(carta);

    puntosJugador += puntos;
    $('#puntosJugador').text(puntosJugador);

    if(puntosJugador >= 21) {
        turnoComputadora();
    }    
}

function cartaComputadora() {
    let carta = baraja.shift();
    const cartaHtml = $('#cartasComputadora').html() + '<img src="./assets/' + carta + '.png" />';

    puntosComputadora += sumarPuntos(carta);

    $('#cartasComputadora').html(cartaHtml);
    $('#puntosComputadora').text(puntosComputadora);

    return puntosComputadora;
}

function turnoComputadora() {
    console.log("Turno de la computadora");
    $('#btn-card').addClass('disabled');
    $('#btn-stop').addClass('disabled');

    const ciclo = setInterval(() => {
        cartaComputadora();
        if (puntosJugador > 21) {
            clearInterval(ciclo);
            finTurnoComputadora();
        }
        if (puntosComputadora > 21 || puntosComputadora > puntosJugador) {
            clearInterval(ciclo);
            finTurnoComputadora();
        }
    }, 500)

    console.log("Fin del turno de la computadora");
    return;
}

function finTurnoComputadora() {
    setTimeout(() => {
        mensajeGanador(puntosComputadora <= 21 && puntosComputadora >= puntosJugador || puntosJugador > 21
            ? (ganador = {
                nombre: 'La computadora gana',
                color: 'bg-danger'
            })
            : (ganador = {
                nombre: 'El jugador gana',
                color: 'bg-success'
            })
        );
    }, 500)
}

function mensajeGanador({nombre, color}) {
    $('#mensajeGanador').removeAttr('hidden');
    $('#mensajeGanador').html('<h2> ' + nombre + ' </h2>');
    $('#mensajeGanador').addClass(color);
}

function nuevoJuego() {
    $('#cartasJugador').html('');
    $('#cartasComputadora').html('');
    puntosJugador = 0;
    puntosComputadora = 0;
    $('#puntosJugador').text(puntosJugador);
    $('#puntosComputadora').text(puntosComputadora);

    $('#mensajeGanador').attr('hidden', 'true');
    $('#mensajeGanador').removeClass('bg-danger');
    $('#mensajeGanador').removeClass('bg-success');
    $('#btn-card').removeClass('disabled');
    $('#btn-stop').removeClass('disabled');

    console.clear();
    crearBaraja();
}

//--Eventos de los botones--
$('#btn-new').click(function() {
    nuevoJuego();
});

$('#btn-card').click(function() {
    turnoJugador();
});

$('#btn-stop').click(function() {
    turnoComputadora();
});

//--Inicia el juego--
crearBaraja();