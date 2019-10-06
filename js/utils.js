/**
 * Funcion para devolver el numero de ocurrencias de una palabra como porcentaje.
 * 
 * @param {Number} n
 * @param {Number} total
 */
obtenerPorcentaje = (n, total) => {
    return n / total * 100;
}

/**
 * Funcion para devolver un arreglo de las palabras que se encuentran en el texto proporcionado
 * como un arreglo.
 * 
 * En caso de no contener palabras, devolver un arreglo vacio.
 * 
 * La expresión regular es para los siguientes escenarios:
 * Palabras que tienen apóstrofe: isn't
 * Palabras sin caso especial
 * 
 * @param {string} texto
 */
obtenerPalabras = (texto) => {
    return texto.match(/(\w'|\w)+/gi) || [];
}

obtenerRandomEnArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}