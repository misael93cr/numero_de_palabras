class Ngram {

    /**
     * Constructor de la clase Ngram.
     * 
     * clavesPalabras: Arreglo con las palabras que pueden ser usadas en el objeto palabras.
     * palabras: Objeto en el cual las claves son las palabras y los valores son variables que contienen
     *   un arreglo con las palabras que le siguen.
     */
    constructor() {
        this.clavesPalabras = [];
        this.palabras = {};
    }

    /**
     * Funcion para crear la clave y el valor dentro del objeto palabras si aun no existe.
     * Asimismo ir llenando el array de clavesPalabras.
     * 
     * @param {string} palabra Palabra a usar como clave
     * @param {string} siguiente Palabra que le sigue a la palabra que es clave
     * @param {Boolean} esPalabraInicial Variable para indicar si la palabra clave
     *   es el inicio de un parrafo
     */
    procesarPalabra = (palabra, siguiente, esPalabraInicial) => {
        palabra = palabra.toLowerCase();
        siguiente = siguiente && siguiente.toLowerCase();

        const valorEnObjeto = this.palabras[palabra];

        // Si el objeto ya existe y tiene una palabra consecutiva, agregarla a su arreglo.
        // Ademas actualizar la variable esPalabraInicial en caso de que esta vez la palabra
        // sea el inicio de un parrafo.
        if (valorEnObjeto) {
            if (siguiente) {
                valorEnObjeto.palabrasContiguas.push(siguiente)
                valorEnObjeto.esPalabraInicial = valorEnObjeto.esPalabraInicial || esPalabraInicial;
            };
        } else {
            this.clavesPalabras.push(palabra);
            this.palabras[palabra] = {
                contenido: palabra,
                esPalabraInicial,
                palabrasContiguas: [siguiente],
            };
        }
    }

    /**
     * Funcion para eliminar del arreglo de palabras consecutivas de cada palabra, aquellas que no deben
     * ser aceptadas.
     * 
     * @param {array} palabrasAceptadas
     */
    limpiarNgram = (palabrasAceptadas) => {
        for(const [_, valor] of Object.entries(this.palabras)) {
            valor.palabrasContiguas = valor.palabrasContiguas.filter(p => palabrasAceptadas.includes(p));
        }
    }

    /**
     * Funcion para generar un texto de forma automatica eligiendo de forma aleatoria alguna palabra
     * del arreglo de palabras consecutivas.
     * 
     * @param {Number} n Cantidad de palabras en el texto.
     * @param {palabrasAceptadas} palabrasAceptadas Palabras que podran ser usadas para generar el texto.
     */
    generarTexto = (n, palabrasAceptadas = []) => {
        if (n < 1) return '';

        // Usar cualquier palabra
        let palabrasAUsar = this.clavesPalabras;

        // Restringir las palabras que se pueden usar
        if (palabrasAUsar.length) {
            palabrasAUsar = palabrasAceptadas;
        }

        if (!palabrasAUsar.length) return '';

        let palabraActual = this.obtenerPalabraInicial(palabrasAUsar);

        let texto = palabraActual;
        for (let i = 1; i < n; i++) {
            let palabraElegida;

            const valorEnObjeto = this.palabras[palabraActual];

            // Si existe la clave de la palabra elegida, buscar de forma aleatoria una palabra consecutiva
            if (valorEnObjeto) {
                const palabras = valorEnObjeto.palabrasContiguas;
                palabraElegida = obtenerRandomEnArray(palabras);
            }

            // Si no se pudo obtener una palabra consecutiva. Obtener una nueva palabra inicial e iniciar una nueva sentencia
            if (!palabraElegida) {
                palabraElegida = this.obtenerPalabraInicial(palabrasAUsar);
                texto += '.';
            }

            texto += ' ' + palabraElegida;

            palabraActual = palabraElegida;
        }

        return texto;
    }

    /**
     * Obtener una palabra inicial, en caso de no haber, devolver la ultima del arreglo.
     */
    obtenerPalabraInicial = (palabrasAUsar) => {
        for (let i = 0; i < palabrasAUsar.length; i++) {
            const valorEnObjeto = this.palabras[palabrasAUsar[i]];
            if (valorEnObjeto && valorEnObjeto.esPalabraInicial) {
                return valorEnObjeto.contenido;
            }

            if (i === palabrasAUsar.length - 1) {
                return valorEnObjeto.contenido;
            }
        }
    }
}