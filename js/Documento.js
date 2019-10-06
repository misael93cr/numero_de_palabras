class Documento {

    /**
     * El constructor de la clase Documento.
     * 
     * parrafos: Arreglo con las instancias de clase Parrafo para saber cuantas
     *   palabras tiene cada uno.
     * palabras: Arreglo con las palabras encontradas en el documento, esto con el objetivo de ordenar
     *   de forma mas sencilla siguiendo el total de veces que se encuentra una palabra.
     * instanciasDePalabras: Objeto en el cual las llaves son las palabras y los valores
     *   son las instancias de la clase Palabra.
     * totalDePalabras: Cantidad de palabras que tiene esta instancia del Documento.
     */
    constructor() {
        this.parrafos = [];
        this.palabras = [];
        this.instanciasDePalabras = {};
        this.ngram = {};
        this.totalDePalabras = 0;
    }

    /**
     * Funcion para agregar una nueva palabra a la instancia del Documento, o en
     * caso de ya estar creada, incrementar su total. Ademas llevar el control
     * de la cantidad de palabras que existe en cada parrafo del Documento.
     * 
     * @param {string} palabra La palabra a procesar.
     * @param {number} numeroDeParrafo El numero del parrafo en el que se encuentra la palabra.
     */
    procesarPalabra = (palabra, numeroDeParrafo) => {
        // Se convierte a minuscula la palabra recibida para usarla como llave en el objeto
        // instanciasDePalabras en caso de que la palabra aparezca multiples veces en el documento
        // sin importar mayusculas o minusculas
        const clavePalabra = palabra.toLowerCase();

        // Si ya existe una instancia de esta palabra
        if (this.palabras.includes(clavePalabra)) {
            const instancia = this.instanciasDePalabras[clavePalabra].instancia;
            instancia.incrementarFrecuenciaTotal();
            instancia.incrementarFrecuenciaEnParrafo(numeroDeParrafo);
        } else { // Crear una nueva instancia de Palabra y agregarla al objeto
            const p = new Palabra(palabra, numeroDeParrafo);
            this.palabras.push(clavePalabra);
            this.instanciasDePalabras[clavePalabra] = {
                instancia: p
            }
        }

        // Si el parrafo ya existe, incrementar su total de palabras
        if (this.parrafos[numeroDeParrafo]) {
            this.parrafos[numeroDeParrafo].incrementarTotal();
        } else { // Crear una nueva isntancia de parrafo si no existe y agregarla al arreglo
            const parrafo = new Parrafo(numeroDeParrafo);
            this.parrafos[numeroDeParrafo] = parrafo;
        }

        // Llevar el conteo total de las palabras en esta isntancia de Documento
        this.totalDePalabras++;
    }


    ordenar = () => {
        this.palabras = this.palabras.sort(this.mayorAMenorFrecuencia);
    }

    mayorAMenorFrecuencia = (palabraA, palabraB) => {
        const instanciaA = this.instanciasDePalabras[palabraA].instancia;
        const instanciaB = this.instanciasDePalabras[palabraB].instancia;

        return instanciaB.total - instanciaA.total;
    }
}