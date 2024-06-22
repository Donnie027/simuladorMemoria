import { crearInstanciaProcesos, iniciarAsignacion } from "../controllers/procesos.js"

export const vistaCrearProceso = () => {

    let btnEnviar = document.querySelector('#btnAgregarProceso');

    let btnIniciarAsignacion = document.getElementById('iniciarMemoria');

    btnEnviar.addEventListener('click', (event) => {
        event.preventDefault();
        crearInstanciaProcesos();
    })

    btnIniciarAsignacion.addEventListener('click', (eve) => {
        eve.preventDefault();
        iniciarAsignacion();
    })

}