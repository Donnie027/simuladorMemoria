import { Memoria } from "../models/memoria.js";

let memoriaGenerada = null; // Variable global para almacenar la memoria

export const crearInstanciaMemoria = () => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: 'Nueva Memoria',
            input: 'number',
            inputPlaceholder: 'Escriba el tamaño en MB',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            showLoaderOnConfirm: true,
            preConfirm: (result) => {
                if (!result) {
                    Swal.showValidationMessage('Por favor ingrese un valor válido');
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Tu memoria se ha creado con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });

                let tamanioMemoria = Number(result.value);

                memoriaGenerada = new Memoria(tamanioMemoria); // Guarda la memoria generada

                resolve(memoriaGenerada);
            } else {
                reject(new Error('Usuario canceló la creación de memoria'));
            }
        });
    });
};

export const obtenerMemoriaGenerada = () => {
    return memoriaGenerada;
};
