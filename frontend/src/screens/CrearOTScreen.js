import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { userPermiso } from "../actions/userActions";
// import { Link } from "react-router-dom";
import "w3-css/w3.css";
import Papa from "papaparse";
import { fechaActual } from '../components/fechas';
import { crearUsuarios } from "../actions/userActions";
import { autoLogout } from '../actions/userActions';

function CrearOTScreen(props) {
  // const [permisoActivo, setPermisoActivo] = useState('');

  // const userEntrada = useSelector((state) => state.userEntrada);
  // const { userKpiEntrada } = userEntrada;

  // const userPermisoInfo = useSelector((state) => state.userPermisoInfo);
  // const { userKpiPermisos } = userPermisoInfo;

  const userEntrada = useSelector(state => state.userEntrada);
  const { userKpiEntrada } = userEntrada;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;


  const { loading, createUser, error } = useSelector((state) => state.userCreateInfo)
  // const [incapacidad, setIncapacidad] = useState(0);
  // const [permiso, setPermiso] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("userEffect")
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy en ms", fechaActual(userKpiEntrada.data.fecha).getDate(),  new Date().getDate())
    // console.log("Fecha en userEffect fechaActualKPI, fechaActualHoy, hoy", userKpiEntrada.data.fecha,fechaActual(userKpiEntrada.data.fecha).getDate() , new Date().getDate() )
    if (!userInfo) {
      props.history.push('/login');
    // } else if(userKpiEntrada && (new Date(userKpiEntrada.data.fecha).getUTCDate()!==fechaActual(Date.now()).getDate() ||  
  } 
  }, []);
  ////console.log(fileList);
  const onChange = (event) => {
    setUsuarios([]);//informacion de usuarios
    setLoadingFiles(true);//visual nada mas
    const fileList = event.target.files;
    //console.log("archivos a analizar:", fileList);

    let titulos = [];
    let usuarios = [];

    const usuariosId = document.getElementById("usuarios");//visual
    const titulosId = document.getElementById("titulos");//visual
    usuariosId.innerHTML = "";
    titulosId.innerHTML = "";
    let readTitle = false;//para agregar el titulo nada mas.
    let maxCol = 28+1;
    Papa.parse(fileList[0], {
      worker: true,
      step: (results) => {
        if (!(results.data.length <= 1)) {
          if (!readTitle) {
            let title = "";
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;

              title += `<th>${results.data[i]}</th>`;
              titulos.push(results.data[i]);
            }
            titulosId.innerHTML += "<tr>" + title + "</tr>";
            readTitle = true;
          } else {
            let users = "";
            let dict = {};
            for (let i = 0; i < results.data.length; i++) {
              if (i == maxCol) break;// despues de la columna maxCol no hay datos importantes
              //limitador:
              users += `<td>${results.data[i]}</td>`;

              if (titulos[i] !== "")
                dict[titulos[i]] = results.data[i];
            }

            if (usuarios.length <= 10) {//maximo 10 users mostrados en pantalla.
              usuariosId.innerHTML += "<tr>" + users + "</tr>";
            }
            usuarios.push(dict);
          }
        }
      },
      complete: () => {
        // let btnUsers= document.getElementById("crearUsuarios");
        //console.log("usuarios final", usuarios);
        setUsuarios(usuarios);
        setLoadingFiles(false);
        setDisabled(false);
        //console.log("All done!");
      },
    });
  };
  const onLoad = (event) => {
    event.preventDefault();
    //console.log("Loading Usuarios", usuarios);

    dispatch(crearUsuarios(usuarios));
    // //console.log("archivos", archivos);
    // //console.log("Usuarios", Usuarios);
  };
  return (
    <div className="w3-row w3-center  w3-margin-bottom">
      <h1 className="w3-xxlarge w3-text-dark-grey">Subir Datos de OTs</h1>
      <form className="w3-col s12 w3-padding w3-section">
        <div className="w3-row">
          <div className="w3-col m3 l4 w3-container"></div>
          <input
            className="w3-col s12 m6 l4 w3-padding"
            type="file"
            id="file-selector"
            onChange={(e) => {
              onChange(e);
            }}
            multiple
          />
          <div className="w3-col m3 l4 w3-container"></div>
        </div>

        {loadingFiles || loading ? <i className="material-icons w3-jumbo w3-text-blue w3-spin w3-section w3-center" >autorenew</i> : <div></div>}
        {createUser ? <div className="w3-section w3-center w3-green w3-round">{createUser.message}</div> : <div></div>}
        {error ? <div className="w3-section w3-center w3-red w3-round">{error.message}</div> : <div></div>}

        <div className="w3-col s12 w3-section">
          <div className="w3-col m3 l4 w3-container"></div>
          <button
            id="crearUsuarios"
            disabled={disabled || loading}
            className="w3-col s12 m6 l4 w3-btn w3-button w3-hover-blue w3-blue w3-round"
            onClick={(e) => {
              onLoad(e);
            }}
          >
            Crear OTs
          </button>
          <div className="w3-col m3 l4 w3-container"></div>
        </div>
      </form>
      <div className="w3-row w3-margin-bottom">
        <div className="w3-col m2 l1 w3-container"></div>
        <table className="w3-col s12 m8 l10 w3-responsive w3-table-all w3-hoverable w3-centered w3-round w3-border w3-margin-bottom">
          <thead id="titulos"></thead>
          <tbody id="usuarios"></tbody>
        </table>
        <div className="w3-col m2 l1 w3-container"></div>
      </div>
    </div>
  );
}
export default CrearOTScreen;
