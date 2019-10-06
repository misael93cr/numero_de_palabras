class Palabra {

    /**
     * El constructor de la clase Palabra.
     * 
     * contenido: Variable que contiene la cadena con la palabra.
     * ocurrenciaEnParrafos: Objeto en el cual las claves representan
     *   el numero del parrafo y los valores la cantidad de veces
     *   que esta palabra aparece en ese parrafo.
     * total: Numero de veces que la palabra se encuentra en el documento.
     * 
     * @param {string} palabra 
     * @param {Number} numeroDeParrafo 
     */
    constructor(palabra, numeroDeParrafo) {
        this.contenido = palabra;
        this.ocurrenciaEnParrafos = {};
        this.total = 1;

        this.incrementarFrecuenciaEnParrafo(numeroDeParrafo);
    }

    /**
     * Incrementar el numero de veces que esta palabra se encuentra en el documento.
     */
    incrementarFrecuenciaTotal() {
        this.total++;
    }

    /**
     * Incrementar el numero de veces que esta palabra se encuentra en el parrafo indicado
     * en el parametro.
     * 
     * @param {Number} numeroDeParrafo
     */
    incrementarFrecuenciaEnParrafo(numeroDeParrafo) {
        const parrafo = this.ocurrenciaEnParrafos[numeroDeParrafo];

        // Si el parrafo aun no existe en ocurrenciaEnParrafos, crear la nueva
        // clave e inicializar el valor en 1. En caso contrario, incrementar el valor.
        if (!parrafo) {
            this.ocurrenciaEnParrafos[numeroDeParrafo] = {
                numeroDeParrafo,
                total: 1,
            }
        } else {
            parrafo.total++;
        }
    }
}