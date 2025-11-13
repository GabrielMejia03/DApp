import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, Eip1193Provider, parseEther } from "ethers";
import './App.css';

// 1. EL ABI DE MI CONTRATO 
const ABI_DEL_CONTRATO = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "idTitulo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nombreAlumno",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "carrera",
        "type": "string"
      }
    ],
    "name": "TituloRegistrado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "nuevaDireccion",
        "type": "address"
      }
    ],
    "name": "UniversidadActualizada",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "contadorTitulos",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "direccionUniversidad",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_idTitulo",
        "type": "uint256"
      }
    ],
    "name": "getTitulo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "idTitulo",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "nombreAlumno",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "carrera",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "registradoPor",
            "type": "address"
          }
        ],
        "internalType": "struct RegistroTitulos.Titulo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_nombreAlumno",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_carrera",
        "type": "string"
      }
    ],
    "name": "registrarTitulo",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nuevaDireccion",
        "type": "address"
      }
    ],
    "name": "setDireccionUniversidad",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tarifaRegistro",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "titulos",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "idTitulo",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "nombreAlumno",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "carrera",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "registradoPor",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 2. LA DIRECCIÓN DE MI CONTRATO (De mi terminal)
const DIRECCION_DEL_CONTRATO = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// --- Variables Globales ---
let provider: BrowserProvider | null = null;
let contrato: Contract | null = null;


// 3. MI APLICACIÓN DE REACT
function App() {
  // --- Estados ---
  const [cuenta, setCuenta] = useState<string | null>(null);
  
  const [direccionUni, setDireccionUni] = useState<string>(""); 
  const [nombreAlumno, setNombreAlumno] = useState<string>(""); 
  const [carrera, setCarrera] = useState<string>(""); 

  
  // --- Función para (re)inicializar el contrato ---
  const reinicializarContrato = async (cuentaActual: string) => {
    try {
      if ((window as any).ethereum) {
        provider = new BrowserProvider((window as any).ethereum as Eip1193Provider);
        const signer = await provider.getSigner(cuentaActual);
        contrato = new Contract(DIRECCION_DEL_CONTRATO, ABI_DEL_CONTRATO, signer);
        console.log("Contrato reinicializado con la cuenta:", cuentaActual);
      }
    } catch (error) {
      console.error("Error reinicializando el contrato:", error);
    }
  };

  // --- Efecto para manejar cambios de mi cuenta ---
  useEffect(() => {
    if ((window as any).ethereum) {
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          const nuevaCuenta = accounts[0];
          console.log("Cuenta cambiada a:", nuevaCuenta);
          setCuenta(nuevaCuenta);
          reinicializarContrato(nuevaCuenta);
        } else {
          console.log("Cuentas desconectadas");
          setCuenta(null);
          contrato = null;
        }
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);


  // --- Funciones ---
  const conectarWallet = async () => {
    if ((window as any).ethereum) {
      try {
        provider = new BrowserProvider((window as any).ethereum as Eip1193Provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          const cuentaActual = accounts[0];
          setCuenta(cuentaActual);
          await reinicializarContrato(cuentaActual);
        }
      } catch (error) {
        console.error("Error al conectar MetaMask:", error);
        alert("Hubo un error al conectar MetaMask. Revisa la consola.");
      }
    } else {
      alert("MetaMask no está instalado. Por favor, instálalo para usar esta DApp.");
    }
  };

  // --- Funciones del Contrato ---

  const asignarRolUniversidad = async () => {
    if (!contrato) {
      alert("Conecta tu wallet primero");
      return;
    }
    try {
      console.log(`Asignando rol de Universidad a: ${direccionUni}`);
      const tx = await contrato.setDireccionUniversidad(direccionUni);
      await tx.wait();
      
      alert(`¡Éxito! Dirección ${direccionUni} es ahora la Universidad.`);
      setDireccionUni(""); 
    } catch (error) {
      console.error("Error al asignar rol:", error);
      alert("Error al asignar rol. ¿Eres el Dueño?");
    }
  };

  const enviarRegistroTitulo = async () => {
    if (!contrato) {
      alert("Conecta tu wallet primero");
      return;
    }
    try {
      console.log(`Registrando a: ${nombreAlumno}, Carrera: ${carrera}`);
      
      const tarifa = parseEther("0.01");
      const tx = await contrato.registrarTitulo(nombreAlumno, carrera, {
        value: tarifa
      });

      await tx.wait();

      alert(`¡Éxito! Título para ${nombreAlumno} registrado.`);
      setNombreAlumno(""); 
      setCarrera("");
    } catch (error) {
      console.error("Error al registrar título:", error);
      alert("Error al registrar. ¿Tienes el rol de Universidad? ¿Fondos suficientes?");
    }
  };


  // --- Renderizado ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>Registro de Títulos Universitarios</h1>
        
        {!cuenta && (
          <button onClick={conectarWallet}>
            Conectar MetaMask
          </button>
        )}
        
        {cuenta && (
          <div>
            <p>Conectado como:</p>
            <p><strong>{cuenta}</strong></p>
            
            <hr /> 

            <div className="form-section">
              <h3>Panel de Administrador (Dueño)</h3>
              <input 
                type="text" 
                placeholder="Dirección de la Universidad"
                value={direccionUni}
                onChange={(e) => setDireccionUni(e.target.value)}
              />
              <button onClick={asignarRolUniversidad}>Asignar Rol</button>
            </div>

            <hr />

            <div className="form-section">
              <h3>Panel de Universidad</h3>
              <input 
                type="text" 
                placeholder="Nombre del Alumno"
                value={nombreAlumno}
                onChange={(e) => setNombreAlumno(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Nombre de la Carrera"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
              />
              <button onClick={enviarRegistroTitulo}>Registrar Título (Pagar 0.01 ETH)</button>
            </div>

          </div>
        )}

      </header>
    </div>
  );
}

export default App;