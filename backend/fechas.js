//struct meses
const Meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
]
const Semana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado"
]
const fechaUnica = (d) => {
  // let d1 = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  //  let fecha= d1.toLocaleString('es-MX',{dateStyle: 'short'}); 
  let day = d.getDate();
  let monthIndex = d.getMonth() + 1;
  let year = d.getFullYear();
  const fecha = year + '-' + monthIndex + '-' + day;
  return (fecha);
};

const fechaString = (d) => {
  // console.log(d);
  let fecha = d.toISOString().split("T")[0].split("-");
  return `${fecha[2]}-${fecha[1]}-${fecha[0]}`
}

const horaString = (d) => {
  return `${d.toISOString().split("T")[1].substr(0, 8)}`
}


const fechaRegional = (offset) => {
  // var offsetDaylight = new Date(new Date().getTime() + ((offset) ? offset : -6) * 60 * 60000).getTimezoneOffset()
  // console.log("offsetDaylightRegional", offsetDaylight, 'offset', offset)
  return new Date(new Date().getTime() + ((offset) ? offset : -6) * 60 * 60000);
}

const fechaRegionalUnica = (offset) => {

  let date = new Date(new Date().getTime() + ((offset) ? offset : -6) * 60 * 60000);
  // var offsetDaylight = date.getTimezoneOffset()
  // console.log("offsetDaylightUnica", offsetDaylight, 'offset', offset)
  let day = date.getUTCDate();
  let monthIndex = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  const fecha = year + '-' + monthIndex + '-' + day;
  return (fecha);
}

const fechaRegionalUnicaInput = (d, offset) => {
  let date = new Date(new Date(d).getTime() + ((offset) ? offset : -6) * 60 * 60000);
  let day = date.getUTCDate();
  let monthIndex = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear();
  const fecha = year + '-' + monthIndex + '-' + day;
  return (fecha);
}

const fechaRegionalInput = (d, offset) => {
  return new Date(new Date(d).getTime() + ((offset || offset == 0) ? offset : -6) * 60 * 60000);
}


Date.prototype.getWeek = function () {
  var target = new Date(this.valueOf());
  var dayNr = (this.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  var firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() != 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

function getWeekNumber(d1) {
  console.log("GETTING WEEK", d1, d1.getWeek())
  return d1.getWeek();
}

function getWeekNumber2(dt) {
  var tdt = new Date(dt.valueOf());
  var dayn = (dt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  var semana = 1 + Math.ceil((firstThursday - tdt) / 604800000);
  // console.log('week', semana)
  return semana
}

function numTrimestre(d) {
  const d1 = new Date(d);
  let q = [1, 2, 3, 4];
  return q[Math.floor(d.getMonth() / 3)]
}

const getQuincena = (date) => {
  let dia = date.getUTCDate();
  if (dia <= 15)
    return 1;
  else
    return 2;
}

const getMonthText = (date) => {
  return Meses[date.getUTCMonth()];
}

const getDayOfWeekText = (value) => {
  return Semana[value];
}

const queMes = (mes) => {

  var monthNames = [
    "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct",
    "Nov", "Dec"
  ];

  return (monthNames[mes]);

};

export {
  getWeekNumber,
  getWeekNumber2,
  fechaUnica,
  numTrimestre,
  fechaRegionalInput,
  fechaRegional,
  fechaRegionalUnica,
  fechaRegionalUnicaInput,
  fechaString,
  horaString,
  getQuincena,
  getMonthText,
  getDayOfWeekText,
  queMes
};