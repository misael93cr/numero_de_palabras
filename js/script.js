/**
 * Function para limpiar los resultados desplegados.
 */
resetear = () => {
    document.getElementById('palabras').innerHTML = ''
    document.getElementById('parrafo').innerHTML = '';
    document.getElementById('error-forma').innerHTML = '';
};

/**
 * Funcion para leer el archivo y desplegar los resultados.
 */
leerArchivo = () => {
    const errorHtml = document.getElementById('error-forma');
    errorHtml.innerHTML = '';
    const archivo = document.getElementById('archivo').files[0];

    // Si no se cargo algun archivo, mostrar mensaje de error
    if (!archivo) {
        errorHtml.innerHTML = 'Por favor selecciona un archivo';
        return false;
    }

    // Llevar control del numero del parrafo
    let numeroDeParrafo = 1;
    // Saber si la linea leida anteriormente esta vacia para indicar el inicio de un nuevo parrafo
    // Se inicia en true para el primer parrafo.
    let lineaAnteriorVacia = true;

    // Crear una nueva instancia de Documento para ir guardando las palabras y los parrafos
    const documento = new Documento();

    // Crear una nueva instancia de la clase Ngram para guardar las palabras y sus consecutivas
    const ngram = new Ngram();

    let ultimaPalabra = undefined;

    // Llamar a la funcion que se encargara de leer por partes el archivo cargado
    leerArchivoPorPartes(
        archivo,
        (linea) => {
            if (/\w/.test(linea)) { // La línea contiene caracteres alfanuméricos

                // False dado que esta linea contiene caracteres que nos interesan
                lineaAnteriorVacia = false;

                const palabras = obtenerPalabras(linea);

                for (let i = 0; i < palabras.length; i++) {
                    documento.procesarPalabra(palabras[i], numeroDeParrafo);

                    // Si es la primera palabra de la linea, checar si existia una palabra de la linea anterior
                    if (i === 0 && ultimaPalabra) {
                        ngram.procesarPalabra(ultimaPalabra, palabras[i], false);
                    }

                    // La ultima palabra del array no tendra una palabra adelante de ella
                    if (i !== palabras.length - 1) {
                        ngram.procesarPalabra(palabras[i], palabras[i + 1], i === 0 && !ultimaPalabra);
                    } else {
                        ultimaPalabra = palabras[i];
                    }
                }
                
            } else {
                // Si la liena actual no contiene caracteres alfanumericos pero la anterior si,
                // incrementar el numero del parrafo
                // Tambien limpiar la variable ultimaPalabra para que al leer una nueva linea no se consideren
                // esas palabras como consecutivas
                if (!lineaAnteriorVacia) {
                    numeroDeParrafo++;
                    ultimaPalabra = undefined;
                }
                lineaAnteriorVacia = true;
            }
        },
        (error) => {
            if (error) {
                console.error(error);
                errorHtml.innerHTML = 'Se ha detectado un error';
                return;
            }

            if (!documento.palabras.length) {
                errorHtml.innerHTML = 'No hay resultados para mostrar';
                return;
            }

            // Ordenar las palabras de mayor a menor segun su total
            documento.ordenar();
            
            const div = document.getElementById('palabras');
            
            // Limpiar valores antiguos
            resetear();

            // El porcentaje minimo indicado por el usuario de las palabras que se deberan mostrar
            const porcentajeLimite = document.getElementById('porcentaje-limite').value;

            const palabrasEnPorcentaje = [];

            // El texto libre proporcionado por el usuario se pasa a minusculas para hacerlo conicidir con las claves
            // que se tienen en la instancia de Documento
            const palabrasUsuario = obtenerPalabras(document.getElementById('texto-libre').value.toLowerCase());

            // Iterar sobre las palabras que se tienen en el documento
            for (let i = 0; i < documento.palabras.length; i++) {
                const palabra = documento.palabras[i];

                // Obtener la instancia de la clase Palabra
                const instancia = documento.instanciasDePalabras[palabra].instancia;
                
                const porcentaje = obtenerPorcentaje(instancia.total, documento.totalDePalabras);
    
                // Si el porcentaje es menor al indicado por el usuario, salir del ciclo
                if (porcentaje < porcentajeLimite) {
                    break;
                }

                // Agregar al arreglo las palabras que entran en el porcentaje aceptado
                palabrasEnPorcentaje.push(palabra);
                
                const contenedorDePalabra = document.createElement('div');
                const p = document.createElement('p');

                const palabraExisteEnTextoLibre = palabrasUsuario.includes(palabra);

                const nodoConPalabra = document.createTextNode(`Palabra ${i + 1}: ${instancia.contenido}${palabraExisteEnTextoLibre ? '*' : ''}`);
                p.appendChild(nodoConPalabra);
    
                const ul = document.createElement('ul');
                
                const liDocument = document.createElement('li');
                const liDocumentText = document.createTextNode(`Documento: ${instancia.total} / ${porcentaje.toFixed(2)}%`);
                liDocument.appendChild(liDocumentText);
                ul.appendChild(liDocument);

                // Iterar sobre las ocurrencias de la palabra en cada parrafo donde esta presente
                for(const [_, ocurrencia] of Object.entries(instancia.ocurrenciaEnParrafos)) {
                    const porcentajeEnParrafo = obtenerPorcentaje(ocurrencia.total, documento.parrafos[ocurrencia.numeroDeParrafo].cantidadDePalabras);
                    const liParrafo = document.createElement('li');
                    const liParrafoTexto = document.createTextNode(`Parrafo ${ocurrencia.numeroDeParrafo}: ${ocurrencia.total} / ${porcentajeEnParrafo.toFixed(2)}%`);
                    liParrafo.appendChild(liParrafoTexto);
                    ul.appendChild(liParrafo);
                }
    
                contenedorDePalabra.appendChild(p);
                contenedorDePalabra.appendChild(ul);
                
                div.appendChild(contenedorDePalabra);
            }

            // Si ninguna palabra cumple con el porcentaje esperado, mostrar mensaje y salir
            if (!palabrasEnPorcentaje.length) {
                const error = document.createTextNode('No hay resultados para mostrar');
                div.appendChild(error);
                div.classList.add('error');
                
                return;
            }

            // Llamar funcion para eliminar las palabras consecutivas que no deberian de aparecer en el texto generado
            // dado que no entran en el porcentaje aceptado
            ngram.limpiarNgram(palabrasEnPorcentaje);

            const numeroDePalabras = document.getElementById('n-palabras').value;
            const parrafo = document.getElementById('parrafo');

            let texto = ngram.generarTexto(numeroDePalabras, palabrasEnPorcentaje);
            const textoParrafo = document.createTextNode(texto);

            parrafo.appendChild(textoParrafo);
        }
    );

    return false; // No ejecutar el submit de form
};

/**
 * Funcion para leer por partes el archivo, en caso de que sea muy grande no llevar todo el texto a la memoria.
 * 
 * https://stackoverflow.com/questions/39479090/read-n-lines-of-a-big-text-file
 * 
 * @param {File} archivo El archivo a leer.
 * @param {Function} procesarLinea Funcion a ejecutar cuando se lee una linea del archivo.
 * @param {Function} finalizarProceso Funcion a ejecutar cuando se termina de leer el archivo completo.
 */
const leerArchivoPorPartes = (archivo, procesarLinea, finalizarProceso) => {
    const bytesAProcesar = 10000; // 10 kb
    let byteInicial = 0;

    const fileReader = new FileReader();
    fileReader.onload = () => {
        const texto = fileReader.result; // Obtener el texto del archivo leido
        const lineas = texto.split(/\n/); // Array de strings divididas por el salto de linea

        for (let i = 0; i < lineas.length; i++) {
            procesarLinea(lineas[i]);
        }

        // Indicar el inicio de la siguiente parte a evaluar
        byteInicial += bytesAProcesar;

        // Siguiente iteracion
        evaluarArchivo();
    };
        
    fileReader.onerror = () => {
        finalizarProceso(fileReader.error);
    };

    // Esta funcion sirve para saber si ya se evaluo todo el archivo o si se debe
    // continuar con la siguiente parte del archivo
    const evaluarArchivo = () => {
        if (byteInicial !== 0 && byteInicial >= archivo.size) {
            finalizarProceso();
            return;
        }

        const parteDeArchivo = archivo.slice(byteInicial, byteInicial + bytesAProcesar);
        fileReader.readAsText(parteDeArchivo);
    }

    // Iniciar procesamiento del archivo
    evaluarArchivo();
}