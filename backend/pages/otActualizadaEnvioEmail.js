
 const fechaLegible = (dia) => {
   const diaX = new Date(dia).getDay()
   const mes = new Date(dia).getMonth()
   const ano = new Date(dia).getFullYear()
   var monthNames = [
     "Ene", "Feb", "Mar",
     "Abr", "May", "Jun", "Jul",
     "Ago", "Sep", "Oct",
     "Nov", "Dec"
   ];
 const fecha = diaX + "-" + monthNames[mes] + "-" + ano; 
   return (fecha);
}

let procesos = [
   {_id:"p1", titulo:'Solicitudes Nuevas', codigo:'ini', paso:0},
   {_id:"p2",titulo:'Revision con Cliente y Programación', codigo:'rev', paso:1},
   {_id:"p3",titulo:'En Ejecución', codigo:'ejec', paso:2},
   {_id:"p4",titulo:'Revisión de Calidad', codigo:'qa', paso:3},
   {_id:"p5",titulo:'Finalizado Entregado', codigo:'entregado', paso:4},
   {_id:"p6",titulo:'Aprobado por Cliente', codigo:'aprobado', paso:5},
];
 
 const otActualizadaEmail = (info) => {
     console.log('info', info)
     let html = 
     `<!DOCTYPE html>
     <html> 
     <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Notificación</title>
     <style>
     html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}
     .container{padding:10px;width:100%}
     .justify-content-center{justify-content:center;align-items:center}
     .row{display:flex;flex-flow:column wrap;flex-wrap:wrap;flex-direction:column;-ms-flex-direction:column;flex-grow:1;margin-top:20px;width:100%}
     .col-12{width:100%;flex:inherit}
     .col-6{width:70%;flex:inherit;max-width:60%}
     .mx-auto{margin-left:auto;margin-right:auto}
     .jumbotron{padding:20px;border-radius:5px}
     .text-center{text-align:center}
     h3{margin:0}
     .btn{padding:10px;border-radius:15px;max-width:100%}
     .text-blueish{color:#0d47a1  }
     .bg-blueish{background-color:#e0e0e0}
     .text-light{color:#e0e0e0}.text-shadow{text-shadow:1px 1px 1px #0d47a1 }
     .link,.link:active,.link:focus,.link:link{color:#0d47a1 ;text-decoration:none}
     .link:hover{text-decoration-line:underline;text-decoration-style:solid;text-decoration-color:#412819;color:#412819}
     .bg-confirm{background-color:#e0e0e0;margin:0}.btn-confirm{color:#ffff;background-color:#0d47a1;border-color:#4b4d49}
     .btn-confirm:hover{color:#ffff;background-color:#0d47a1;border-color:#94af58}
     .btn-confirm.focus,.btn-confirm:focus{color:white;background-color:#0d47a1;border-color:#0d47a1;box-shadow:0 0 0 .2rem rgba(59,28,13,.5)}
     @media screen and (max-width:400px) {
     .text-center{font-size: 1.2rem;max-width:100%;
     
     }
     h3 {font-size:1.1rem}
     .col-6{width:100%;flex:inherit;max-width:90%}
     }
     </style>
     </head> 
     <body class="white">
     <div class="container">
     
     <div class="row justify-content-center">
        <div class="col-12 jumbotron bg-blueish text-blueish mx-auto">
        <!-- <img width="70" src="./icon-48x48.png" alt="logo"/>  -->
        <h1 class="col-12 text-center">OT # '${info.ot_number} Actualizada</h1>
        </div>
     </div> 
     <div class="row justify-content-center">
        <div class="col-12 jumbotron bg-blueish text-blueish mx-auto">
        <p class="col-12 text-center text-blueish">Cliente:${info.cliente} </p>
        <p class="col-12 text-center text-blueish">Proyecto:${info.proyecto} </p>   
        <p class="col-12 text-center text-blueish">Estatus:${procesos.filter( proc => proc.codigo === info.estado)[0].titulo} </p>
        <p class="col-12 text-center text-blueish">Prioridad:${info.prioridad} </p>
        <p class="col-12 text-center text-blueish">Fecha SLA:${fechaLegible(info.fecha_sla)} </p>
        <p class="col-12 text-center text-blueish">Fecha Requerida: ${fechaLegible(info.fecha_requerida)} </p>
        <p class="col-12 text-center text-blueish">Sitio:${info.sitio_codigo} - ${info.sitio_nombre} </p>
        <p class="col-12 text-center text-blueish">Requerimiento:${info.requerimiento} </p>
        <p class="col-12 text-center text-blueish">Detalle:${info.detalle_requerimiento} </p>
        <p class="col-12 text-center text-blueish">Comentario de Ingenieria:${info.comentarios_responsable_ot?info.comentarios_responsable_ot:"" } </p>
        
        </div>
     </div>
     <div class="row justify-content-center"> 
     <a href="https://easyordertracking.herokuapp.com/detalleOT/?codigo=${info.sitio_codigo}&ot_number=${info.ot_number}" class="col-6 mx-auto"> 
     <button class="col-12 btn btn-confirm center text-center mx-auto">
     <h3>Ir a sistema de OTs</h3> 
     </button> 
     </a>
     </div>
     </body>
     </html>`


return html;
};
export {otActualizadaEmail};