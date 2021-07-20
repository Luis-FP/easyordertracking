
 const otActualizadaEmail = (info) => {
     console.log('info', info)
     let html = 
     `<!DOCTYPE html>
     <html> 
     <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Notificación.</title>
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
     .text-blueish{color:white  }
     .bg-blueish{background-color:#002d74}
     .text-light{color:#374fd8}.text-shadow{text-shadow:1px 1px 1px #80bc00 }
     .link,.link:active,.link:focus,.link:link{color:#80bc00 ;text-decoration:none}
     .link:hover{text-decoration-line:underline;text-decoration-style:solid;text-decoration-color:#412819;color:#412819}
     .bg-confirm{background-color:#80bc00;margin:0}.btn-confirm{color:#ffff;background-color:#80bc00;border-color:#80bc00}
     .btn-confirm:hover{color:#ffff;background-color:#94af58;border-color:#94af58}
     .btn-confirm.focus,.btn-confirm:focus{color:white;background-color:#80bc00;border-color:#94af58;box-shadow:0 0 0 .2rem rgba(59,28,13,.5)}
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
     <div class="row justify-content-center">
     <div class="col-12 mx-auto">
     <p class="col-12 text-center">Cliente:${info.cliente} </p>
     <p class="col-12 text-center">Proyecto:${info.proyecto} </p>
     <p class="col-12 text-center">Prioridad:${info.prioridad} </p>
     <p class="col-12 text-center">Sitio:${info.sitio_codigo} - ${info.sitio_nombre} </p>
     <p class="col-12 text-center">Requerimiento:${info.requerimiento} </p>
     <p class="col-12 text-center">Detalle:${info.detalle_requerimiento} </p>
     </div>
     </div>
     </div>
     <div class="row justify-content-center"> 
     <a href="#" class="col-6 mx-auto"> 
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