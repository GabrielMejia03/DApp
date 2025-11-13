// SPDX-License-Identifier: MIT
// Especifica la licencia y la versión del compilador
pragma solidity ^0.8.20;

// Importamos "Ownable" de OpenZeppelin para manejar el rol de Administrador (Dueño)
import "@openzeppelin/contracts/access/Ownable.sol";

// Este es mi contrato principal, que hereda de Ownable
contract RegistroTitulos is Ownable {

    // --- Variables de Estado ---

    // Esta dirección será la única autorizada para registrar títulos (el rol "Universidad")
    address public direccionUniversidad;

    // Esta es la tarifa (pago) requerida para registrar un título.
    // La fijamos en 0.01 Ether
    uint256 public tarifaRegistro = 0.01 ether;

    // Un contador para generar IDs únicos para cada título
    uint public contadorTitulos;

    // Definimos la estructura de datos para un "Titulo"
    struct Titulo {
        uint idTitulo;
        string nombreAlumno;
        string carrera;
        uint timestamp;       // Fecha en que se registró
        address registradoPor; // Quién lo registró (la U)
    }

    // Un "mapping" es base de datos.
    // Mapea un ID (un número) a un objeto de tipo Titulo.
    mapping(uint => Titulo) public titulos;

    // --- Eventos ---
    // Los eventos son "logs" que la blockchain emite y para frontend.
    event TituloRegistrado(uint idTitulo, string nombreAlumno, string carrera);
    event UniversidadActualizada(address nuevaDireccion);

    // --- Modificadores (Validación de Roles) ---

    // "soloUniversidad" cumple el requisito de "Validación de roles/permisos con require".
    // Este revisa si la persona que llama a la función es la "Universidad" autorizada.
    modifier soloUniversidad() {
        require(msg.sender == direccionUniversidad, "Error: No tienes permiso de universidad");
        _; // Si tiene permiso, continúa ejecutando la función
    }

    // (El modificador "onlyOwner" para el Admin ya viene incluido en "Ownable")

    // --- Constructor ---
    // Esta función se ejecuta 1 sola vez cuando el contrato se despliega.
    // "initialOwner" será la dirección de tu wallet (MetaMask) que despliega el contrato.
    // Usamos el 'msg.sender' que Hardhat 3 nos da por defecto.
    constructor() Ownable(msg.sender) {
        // Al heredar de Ownable, le pasamos el dueño inicial.
        // Ahora tú eres el "Owner" o Administrador.
    }

    // --- Funciones de Administración (Solo Admin) ---

    // Función para que el Admin (yo) asigne qué dirección es la "Universidad"
    function setDireccionUniversidad(address _nuevaDireccion) public onlyOwner {
        direccionUniversidad = _nuevaDireccion;
        emit UniversidadActualizada(_nuevaDireccion);
    }

    // --- Función Principal (Universidad) ---

    // Esta función cumple los requisitos:
    // 1. "Validación de roles" (usa 'soloUniversidad')
    // 2. "reciba un pago en criptomonedas" (es 'payable')
    function registrarTitulo(string memory _nombreAlumno, string memory _carrera) public payable soloUniversidad {
        
        // 1. Requisito de Pago:
        // Revisa si el valor (msg.value) enviado en la transacción es IGUAL a la tarifa.
        require(msg.value == tarifaRegistro, "Error: El pago enviado no es igual a la tarifa");

        // 2. Lógica para guardar datos:
        contadorTitulos++;
        uint nuevoId = contadorTitulos;

        // 3. Se crea y guarda el nuevo título en el mapping
        titulos[nuevoId] = Titulo(
            nuevoId,
            _nombreAlumno,
            _carrera,
            block.timestamp, // La fecha/hora actual de la blockchain
            msg.sender       // La dirección de la Universidad
        );

        // 4. SE emite el evento para notificar al frontend
        emit TituloRegistrado(nuevoId, _nombreAlumno, _carrera);
    }

    // --- Funciones de Vista (Lectura) ---

    // Función pública para que cualquiera pueda leer los datos de un título
    // No gasta dinero porque es solo lectura
    function getTitulo(uint _idTitulo) public view returns (Titulo memory) {
        return titulos[_idTitulo];
    }
}