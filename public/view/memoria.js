import { crearInstanciaMemoria, obtenerMemoriaGenerada } from "../controllers/memoria.js";

export const vistaCrearMemoria = () => {
    let memoriaGenerada;
    let infoMemoria = document.querySelector('.memoriaCapacidad');
    let btnsAcciones = document.querySelectorAll('.cajaBotones > button');

    let btnCrearMemoria = document.querySelector('#crearMemoria');
    let memoriaGraficaGenerada = document.querySelector('.memoriaGenerada');

    btnCrearMemoria.addEventListener('click', () => {
        crearInstanciaMemoria()
        .then(memoria => {
            memoriaGenerada = obtenerMemoriaGenerada(); // Obtén la memoria generada

            infoMemoria.innerText = memoriaGenerada.almacenamiento;
            memoriaGraficaGenerada.style = 'width:100%;';

            if (memoriaGenerada.almacenamiento > 0) {
                btnsAcciones.forEach(btn => {
                    btn.removeAttribute('disabled');
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
};
