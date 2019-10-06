class Parrafo {

    /**
     * Un nuevo parrafo siempre tendra al menos una palabra.
     * 
     * @param {Number} numero El numero del parrafo
     */
    constructor(numero) {
        this.numero = numero;
        this.cantidadDePalabras = 1;
    }

    incrementarTotal = () => {
        this.cantidadDePalabras++;
    }
}