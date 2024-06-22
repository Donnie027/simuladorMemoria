import { generarUUID } from "../helpers/uuid.js";
import { Proceso, listaArreglos } from "../models/Procesos.js";
import { obtenerMemoriaGenerada } from "./memoria.js";

export const crearInstanciaProcesos = () => {
    let uuid = generarUUID();
    let inputNombre = document.querySelector('#inputNombreProceso').value;
    let inputTamanio = document.querySelector('#inputTamanioProceso').value;
    let inputColor = document.querySelector('#inputColorProceso').value;

    try {
        if (inputNombre.trim() === '') {
            Swal.fire({
                icon: "info",
                title: "Nombre Incorrecto",
                text: "Ingresa un valor válido"
            });
            throw new Error();
        }
        if (inputTamanio.trim() === '' || inputTamanio.trim() === 0) {
            Swal.fire({
                icon: "info",
                title: "Número Incorrecto",
                text: "Ingresa un valor válido"
            });
            throw new Error();
        }
        if (inputColor.trim() === '') {
            Swal.fire({
                icon: "info",
                title: "Color Incorrecto",
                text: "Ingresa un valor válido"
            });
            throw new Error();
        }

        if (listaArreglos.some(proceso => proceso.nombre === inputNombre)) {
            Swal.fire({
                icon: "info",
                title: "Nombre repetido",
                text: "Ingrese un nombre diferente"
            });
            throw new Error();
        }
        if (listaArreglos.some(proceso => proceso.color === inputColor)) {
            Swal.fire({
                icon: "info",
                title: "Color repetido",
                text: "Ingrese un color diferente"
            });
            throw new Error();
        }

        let tiempoProceso = (inputTamanio * 100) / 2;

        let nuevaProceso = new Proceso(uuid, inputColor, inputNombre, Number(inputTamanio), tiempoProceso, 'inactivo');
        listaArreglos.push(nuevaProceso);
        getProcesos();

    } catch (error) {
        console.error('Error al crear instancia de proceso:', error);
    }
}

const eliminarProceso = () => {
    let btnEliminar = document.querySelectorAll('.btn-eliminarProceso');

    btnEliminar.forEach(btnE => {
        btnE.addEventListener('click', () => {
            let procesoId = btnE.id;

            // Cambiar el estado del proceso a 'finalizado' en listaArreglos
            listaArreglos.forEach(proceso => {
                if (proceso.uuid === procesoId) {
                    proceso.estatus = 'finalizado';
                }
            });

            // Actualizar la visualización de procesos en la tabla y en el DOM
            getProcesos();

            // Eliminar el elemento del DOM
            const elementoProceso = document.querySelector(`.comparticionMemoria1[uuid="${procesoId}"]`);
            if (elementoProceso) {
                elementoProceso.remove();
            }
        });
    });
};


const getProcesos = () => {
    const filaProcesosInactivos = document.querySelector('.procesosEspera');
    const filaProcesosActivos = document.querySelector('.procesosActivos');
    filaProcesosActivos.innerHTML = ''; 
    filaProcesosInactivos.innerHTML = '';

    listaArreglos.forEach(proceso => {
        const { 
            uuid,
            nombre,
            tamanio,
            color,
            estatus,
            tiempo,
        } = proceso;

        switch (estatus) {
            case 'activo':
                // Calcular el tiempo restante
                const tiempoTranscurrido = Date.now() - proceso.inicioTiempo;
                const tiempoRestante = proceso.tiempo - tiempoTranscurrido;

                filaProcesosActivos.innerHTML += `
                    <tr>
                        <td title="Color" class="td-color"><div class="color-proceso" style="background: ${color};"></div></td>
                        <td title="ID"><span class="id-proceso">${uuid}</span></td>
                        <td title="Nombre"><span class="nombre-proceso">${nombre}</span></td>
                        <td title="Tamaño"><span class="tamanio-proceso">${tamanio}</span> MB</td>
                        <td title="Tiempo Restante"><span class="tiempo-restante" id="tiempo-restante-${uuid}">${tiempoRestante}</span> ms</td>
                    </tr>`;
                break;

            case 'inactivo':
                filaProcesosInactivos.innerHTML += `
                    <tr>
                        <td title="Color" class="td-color"><div class="color-proceso" style="background: ${color};"></div></td>
                        <td title="ID"><span class="id-proceso">${uuid}</span></td>
                        <td title="Nombre"><span class="nombre-proceso">${nombre}</span></td>
                        <td title="Tamaño"><span class="tamanio-proceso">${tamanio}</span> MB</td>
                        <td title="Tiempo"><span class="tiempo-proceso">${tiempo}</span> ms</td>
                        <td title="Eliminar Proceso"><button id="${uuid}" class="btn-quinario btn-eliminarProceso"><ion-icon name="trash"></ion-icon></button></td>
                    </tr>`;
                break;

            default:
                break;
        }
    });

    eliminarProceso();
};



export const iniciarAsignacion = () => {
    let memoriaReferencia = obtenerMemoriaGenerada().almacenamiento;

    try {
        let memoriaGenerada = obtenerMemoriaGenerada();
        let memoriaGraficaGenerada = document.querySelector('.memoriaGenerada');
        let infoMemoria = document.querySelector('.memoriaCapacidad');

        if (!memoriaGraficaGenerada) {
            throw new Error('No se encontró el elemento con clase "memoriaGenerada"');
        }

        if (listaArreglos.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No hay procesos",
                text: "No puedes iniciar la asignación sin procesos"
            });
            throw new Error('No hay procesos para asignar');
        }

        // Función para iniciar un proceso si hay suficiente espacio en memoria
        const iniciarProceso = (proceso) => {
            if (proceso.estatus !== 'inactivo') {
                return; // Salir si el proceso ya está en estado activo o finalizado
            }

            if (proceso.tamanio <= memoriaGenerada.almacenamiento) {
                proceso.estatus = 'activo';
                proceso.inicioTiempo = Date.now();
                getProcesos();

                let nuevoDiv = document.createElement('div');
                nuevoDiv.classList.add('comparticionMemoria1');
                nuevoDiv.setAttribute('uuid', proceso.uuid); // Agregar atributo uuid para identificación
                nuevoDiv.style.background = proceso.color;
                let tamanioGrafica = (proceso.tamanio / memoriaReferencia) * 100;
                nuevoDiv.style.width = `${tamanioGrafica}%`;
                nuevoDiv.title = `${proceso.nombre}`;
                memoriaGraficaGenerada.appendChild(nuevoDiv);

                const intervalId = setInterval(() => {
                    const tiempoTranscurrido = Date.now() - proceso.inicioTiempo;
                    const tiempoRestante = proceso.tiempo - tiempoTranscurrido;
                    const tiempoRestanteElement = document.getElementById(`tiempo-restante-${proceso.uuid}`);
                    if (tiempoRestanteElement) {
                        tiempoRestanteElement.textContent = tiempoRestante;
                    }

                    if (tiempoRestante <= 0) {
                        clearInterval(intervalId);
                        proceso.estatus = 'finalizado';
                        nuevoDiv.remove(); // Eliminar el elemento del DOM
                        liberarMemoria(proceso); // Liberar la memoria al finalizar el proceso
                    }
                    infoMemoria.innerText = memoriaGenerada.almacenamiento;
                }, 100); // Actualizar cada 100ms

                memoriaGenerada.almacenamiento -= proceso.tamanio;
            } else {
                setTimeout(() => {
                    iniciarProceso(proceso); // Intentar nuevamente si no hay suficiente espacio
                }, 1000);
            }
            infoMemoria.innerText = memoriaGenerada.almacenamiento;
        };

        // Función para liberar memoria y activar el siguiente proceso si está disponible
        const liberarMemoria = (procesoFinalizado) => {
            if (procesoFinalizado) {
                procesoFinalizado.estatus = 'finalizado';

                // Actualizar almacenamiento de memoria
                memoriaGenerada.almacenamiento += procesoFinalizado.tamanio;

                // Eliminar elemento del DOM
                const elementoProceso = memoriaGraficaGenerada.querySelector(`.comparticionMemoria1[uuid="${procesoFinalizado.uuid}"]`);
                if (elementoProceso) {
                    elementoProceso.remove();
                }

                getProcesos(); // Actualizar la visualización de los procesos en la tabla

                // Intentar iniciar el siguiente proceso inactivo si hay espacio suficiente
                const siguienteProceso = listaArreglos.find(proceso => proceso.estatus === 'inactivo');
                if (siguienteProceso && siguienteProceso.tamanio <= memoriaGenerada.almacenamiento) {
                    iniciarProceso(siguienteProceso);
                }
            }
        };

        // Iterar para iniciar procesos inactivos
        listaArreglos.forEach(proceso => {
            if (proceso.estatus === 'inactivo') {
                iniciarProceso(proceso);
            }
        });

    } catch (error) {
        console.error('Error al iniciar la asignación:', error);
    }
};












