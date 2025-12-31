let listaMensajes = [];
let historialIndices = [];
let mostrandoHoja = false;
let musicaIniciada = false;

async function inicializarProyecto() {
    try {
        const respuesta = await fetch('textos/mensajes.txt');
        const texto = await respuesta.text();
        listaMensajes = texto.split('\n').map(l => l.trim()).filter(l => l !== "");
    } catch (e) {
        listaMensajes = ["¡Te amo mucho mi mochi bonita!"];
    }
    
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 1000);
        }
    }, 2000);
}

function interaccionUsuario() {
    if (!musicaIniciada) {
        const audio = document.getElementById('musica-fondo');
        if(audio) audio.play().catch(e => console.log("Audio waiting for interaction"));
        musicaIniciada = true;
    }
    mostrarHoja();
}

function establecerMensajeEspecial() {
    const ahora = new Date();
    const d = ahora.getDate(), m = ahora.getMonth() + 1;
    const el = document.getElementById('mensaje-especial');
    let msg = "TE AMO MUCHO MI MOCHI BONITA!!";

    if (d === 31 && m === 12) msg = "¡FELIZ AÑO NUEVO MI AMOR! 🎉 Gracias por un 2024 increíble.";
    else if (d === 1 && m === 1) msg = "¡FELIZ AÑO NUEVO MI AMOR! 🎉";
    else if (d === 14 && m === 2) msg = "¡Feliz San Valentín mi amor! ❤️";
    else if (d === 1 && m === 3) msg = "¡FELIZ ANIVERSARIO MI AMOR! 🌹";
    else if (d === 24 && m === 12) msg = "¡FELIZ NAVIDAD MI AMOR! 🎄";

    if (el) el.innerText = msg;
}

function actualizarContador() {
    const inicio = new Date('2024-03-01T00:00:00');
    const ahora = new Date();
    let yrs = ahora.getFullYear() - inicio.getFullYear();
    let mos = ahora.getMonth() - inicio.getMonth();
    let days = ahora.getDate() - inicio.getDate();

    if (days < 0) {
        mos--;
        days += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
    }
    if (mos < 0) { yrs--; mos += 12; }

    const el = document.getElementById('tiempo');
    if (el) el.innerText = `${yrs} AÑOS, ${mos} MESES y ${days} DÍAS`;
}

function mostrarHoja() {
    if (mostrandoHoja || listaMensajes.length === 0) return;
    const overlay = document.getElementById('overlay-hoja');
    const textoEl = document.getElementById('mensaje-romantico');
    let idx;
    const margen = Math.min(20, Math.floor(listaMensajes.length / 2));
    do { idx = Math.floor(Math.random() * listaMensajes.length); } while (historialIndices.includes(idx));
    historialIndices.push(idx);
    if (historialIndices.length > margen) historialIndices.shift();
    textoEl.innerText = listaMensajes[idx];
    mostrandoHoja = true;
    overlay.classList.remove('hidden');
    
    // REDUCIDO A 3 SEGUNDOS (3000ms)
    setTimeout(() => { overlay.classList.add('hidden'); mostrandoHoja = false; }, 3000);
}

function manejarSobre() {
    const imgSobre = document.getElementById('sobre-img');
    const modalCarta = document.getElementById('modal-carta');
    const textoDedi = document.getElementById('texto-dedicatoria');

    // Secuencia de apertura (1s por estado)
    setTimeout(() => {
        imgSobre.src = "images/sobremedio.png";
        setTimeout(() => {
            imgSobre.src = "images/sobreabierto.png";
            setTimeout(async () => {
                try {
                    const res = await fetch('textos/dedicatoria.txt');
                    const texto = await res.text();
                    textoDedi.innerText = texto;
                    modalCarta.classList.remove('hidden');
                } catch (e) {
                    textoDedi.innerText = "Te amo mucho Eunice.";
                    modalCarta.classList.remove('hidden');
                }
            }, 1000);
        }, 1000);
    }, 1000);
}

function crearPetalo() {
    const p = document.createElement('div');
    p.className = 'petalo';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-5vh';
    const s = Math.random() * 12 + 10;
    p.style.width = s + 'px'; p.style.height = s * 1.5 + 'px';
    p.style.animationDuration = Math.random() * 3 + 5 + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 8000);
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarProyecto();
    establecerMensajeEspecial();
    actualizarContador();
    setInterval(actualizarContador, 1000);
    setInterval(crearPetalo, 300);

    document.getElementById('sobre-contenedor').addEventListener('click', manejarSobre);

    document.getElementById('cerrar-carta').addEventListener('click', () => {
        document.getElementById('modal-carta').classList.add('hidden');
        document.getElementById('sobre-img').src = "images/sobrecerrado.png";
    });
});