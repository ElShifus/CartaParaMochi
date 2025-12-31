let listaMensajes = [];
let historialIndices = [];
let mostrandoHoja = false;
let musicaIniciada = false;
let intervaloDiapositivas;

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
        if(audio) audio.play().catch(e => console.log("Audio ready"));
        musicaIniciada = true;
    }
    mostrarHoja();
}

function establecerMensajeEspecial() {
    const ahora = new Date();
    const d = ahora.getDate();
    const m = ahora.getMonth() + 1;
    const y = ahora.getFullYear();
    const el = document.getElementById('mensaje-especial');
    let msg = "TE AMO MUCHO MI MOCHI BONITA!!";

    if (d === 31 && m === 12) msg = `¡FELIZ AÑO NUEVO MI AMOR! 🎉 Gracias por un ${y} increíble.`;
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
    if (days < 0) { mos--; days += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate(); }
    if (mos < 0) { yrs--; mos += 12; }
    const el = document.getElementById('tiempo');
    if (el) el.innerText = `${yrs} AÑOS, ${mos} MESES y ${days} DÍAS`;
}

function mostrarHoja() {
    if (mostrandoHoja || listaMensajes.length === 0) return;
    const overlay = document.getElementById('overlay-hoja');
    const textoEl = document.getElementById('mensaje-romantico');
    let idx;
    do { idx = Math.floor(Math.random() * listaMensajes.length); } while (historialIndices.includes(idx));
    historialIndices.push(idx);
    if (historialIndices.length > 10) historialIndices.shift();
    textoEl.innerText = listaMensajes[idx];
    mostrandoHoja = true;
    overlay.classList.remove('hidden');
    setTimeout(() => { overlay.classList.add('hidden'); mostrandoHoja = false; }, 3000);
}

function iniciarDiapositivas() {
    const izq = document.getElementById('foto-izq');
    const der = document.getElementById('foto-der');
    
    // Si estamos en celular, no ejecutamos la lógica de fotos para ahorrar recursos
    if (window.innerWidth <= 600) return;

    const cambiarFotos = () => {
        let n1 = Math.floor(Math.random() * 5) + 1;
        let n2;
        do { n2 = Math.floor(Math.random() * 5) + 1; } while (n1 === n2);

        izq.classList.remove('mostrar-foto');
        der.classList.remove('mostrar-foto');

        setTimeout(() => {
            izq.style.backgroundImage = `url('images/diapositivas/${n1}.jpeg')`;
            der.style.backgroundImage = `url('images/diapositivas/${n2}.jpeg')`;
            izq.classList.add('mostrar-foto');
            der.classList.add('mostrar-foto');
        }, 800);
    };

    cambiarFotos();
    if (intervaloDiapositivas) clearInterval(intervaloDiapositivas);
    intervaloDiapositivas = setInterval(cambiarFotos, 5000);
}

function manejarSobre() {
    const imgSobre = document.getElementById('sobre-img');
    const modalCarta = document.getElementById('modal-carta');
    const textoDedi = document.getElementById('texto-dedicatoria');

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
                    iniciarDiapositivas();
                } catch (e) {
                    textoDedi.innerText = "Te amo mucho Eunice.";
                    modalCarta.classList.remove('hidden');
                    iniciarDiapositivas();
                }
            }, 300);
        }, 300);
    }, 300);
}

function crearPetalo() {
    const p = document.createElement('div');
    p.className = 'petalo';
    p.style.left = Math.random() * 100 + 'vw';
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
        clearInterval(intervaloDiapositivas);
    });
});