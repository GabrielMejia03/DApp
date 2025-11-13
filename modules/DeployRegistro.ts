import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// El nombre del módulo ("RegistroTitulosModule") es como un ID para el despliegue.
const RegistroTitulosModule = buildModule("RegistroTitulosModule", (m) => {
  
  // m.contract() es la función para desplegar.
  // "RegistroTitulos" es el nombre del contrato (debe coincidir con el .sol).
  const registro = m.contract("RegistroTitulos", []); // El array vacío [] es para los argumentos del constructor. El nuestro no tiene.

  // Retornamos el contrato desplegado
  return { registro };
});

export default RegistroTitulosModule;