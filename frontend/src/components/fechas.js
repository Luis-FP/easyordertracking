const fechaUnica = (d) => {
  let d1 = new Date(d);
  // let d1 = fechaActual(d)
  let day = d1.getUTCDate();
  let monthIndex = d1.getUTCMonth() + 1;
  let year = d1.getUTCFullYear();
  const fecha = year + '-' + monthIndex + '-' + day;

  return (fecha);
};

const fechaUnicaVariable = (sf, d) => {
  // console.log("date ", d.toISOString())
  let d1 = new Date(d);
  let shift = sf;
  // console.log("sf", sf)
  if (sf === -1) {
    shift = 6
  }

  let time = d1.getTime()
  let shiftMilli = shift * 60 * 60 * 1000 * 24
  let newTime = time + shiftMilli
  let d2 = new Date(new Date(newTime) - new Date(newTime).getTimezoneOffset() * 60 * 1000)
  // let d1 = fechaActual(d)
  // //console.log"time", time, "shiftMilli",shiftMilli, "shiftMilli","d1",d1,"d2",d2)

  let day = d2.getUTCDate()
  let monthIndex = d2.getUTCMonth() + 1;
  let year = d2.getUTCFullYear();
  const fecha = year + '-' + monthIndex + '-' + day;
  // console.log('fecha', fecha)
  return (fecha);
};

const fechaRegional = (offset) => {
  var offsetDaylight = new Date(new Date().getTime() + ((offset) ? offset : -6) * 60 * 60000).getTimezoneOffset()
  console.log("offsetDaylightRegional", offsetDaylight, 'offset', offset)
  return new Date(new Date().getTime() + ((offset) ? offset : -6) * 60 * 60000);
}


const queFecha = (d) => {
  var d1 = new Date(d)
  //  //console.log'd1', d1)
  var monthNames = [
    "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct",
    "Nov", "Dec"
  ];
  var day = d1.getUTCDate();

  var monthIndex = d1.getUTCMonth();
  var year = d1.getUTCFullYear();
  var hour = d1.getUTCHours();
  var min = d1.getUTCMinutes();
  var fecha = year + '-' + monthNames[monthIndex] + '-' + day;

  return (fecha);
};

const queMesAno = (d) => {
  var d1 = fechaActual(d);

  var monthNames = [
    "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct",
    "Nov", "Dec"
  ];
  var ano = d1.getFullYear()

  var monthIndex = d1.getMonth();

  var mes_ano = monthNames[monthIndex] + '-' + ano;
  // //console.log'd', d);
  // //console.log'd1', d1);
  // //console.log'ano', ano);
  // //console.log'monthI', monthIndex);
  // //console.log'mes_ano', mes_ano);

  return (mes_ano);

};
const queMesAnoEficiencia = (mes, ano) => {

  var monthNames = [
    "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct",
    "Nov", "Dec"
  ];


  var mes_ano = monthNames[mes - 1] + '-' + ano;


  return (mes_ano);

};

const queMesEficiencia = (mes) => {

  var monthNames = [
    "Ene", "Feb", "Mar",
    "Abr", "May", "Jun", "Jul",
    "Ago", "Sep", "Oct",
    "Nov", "Dec"
  ];

  return (monthNames[mes - 1]);

};

// function getWeekNumber(d) {
//   // Copy date so don't modify original
//   d = new Date(+d);
//   d.setHours(0, 0, 0, 0);
//   // Set to nearest Thursday: current date + 4 - current day number
//   // Make Sunday's day number 7
//   d.setDate(d.getDate() + 4 - (d.getDay() || 7));
//   // Get first day of year
//   var yearStart = new Date(d.getFullYear(), 0, 1);
//   // Calculate full weeks to nearest Thursday
//   var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
//   // Return  week number
//   console.log('week', weekNo)
//   return weekNo;
// }



function getWeekNumber(dt) {
  var tdt = new Date(dt.valueOf());
  var dayn = (dt.getUTCDay() + 6) % 7;
  tdt.setUTCDate(tdt.getUTCDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setUTCMonth(0, 1);
  if (tdt.getUTCDay() !== 4) {
    tdt.setUTCMonth(0, 1 + ((4 - tdt.getUTCDay()) + 7) % 7);
  }
  var semana = 1 + Math.ceil((firstThursday - tdt) / 604800000);
  // console.log('week', semana)
  return semana
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




function getYear(date) {
  let w = getWeekNumber(date);
  let d = new Date(new Date().setUTCHours(0, 0, 0, 0));
  d = new Date(d.setDate(d.getDate() + 4 - (d.getDay() || 7)));
  return new Date(d - 86400000 * ((w - 1) * 7 - 1)).getFullYear()
}

function weeksInYear(year) {
  let month = 11,
    day = 31,
    week,
    d;

  // Find week that 31 Dec is in. If is first week, reduce date until
  // get previous week.
  do {
    d = new Date(year, month, day--);
    week = getWeekNumber(d);
  } while (week == 1);

  return week;
}
function utcDateToLocal(d) {
  return new Date(new Date(d).getTime() + new Date(d).getTimezoneOffset() * 60 * 1000)
}

function horaLocal(d, config) {
  if (!config) {
    config = {
      second: 'numeric', minute: 'numeric', hour: 'numeric',
      //day: "numeric", month: "numeric", year: "numeric",
      hour12: true, timeZone: "UTC"
    };
  }
  // let hora = date.toLocaleString('es-MX',{day:"2-digit", month:"short", year:"numeric", weekday:'short',
  // let hora = date.toLocaleString('es-MX',{hour12:true, hour:"2-digit", minute:"2-digit"})
  //console.log"hora interna", d)

  return (new Date(d)).toLocaleString(navigator.language, config);
}

// const fechaMX = (f) => {
//   return new Date(f).toLocaleString('es-MX', {
//     day: 'numeric', month: 'numeric', year: 'numeric',
//     second: 'numeric', minute: 'numeric', hour: 'numeric', hour12: false, timeZone: 'America/Mexico_City'
//   });
// };

//no se si se usara.
const fechaActual = (fecha) => {
  let offset = -6;
  let currLoc = (fecha) ? new Date(fecha) : (new Date());
  let utc = currLoc.getTime() + (currLoc.getTimezoneOffset() * 60000);
  // return new Date(utc + (3600000 * offset));
  return new Date(utc);

}
// const fechaActualString = (fecha) => {
//   let offset = -6;
//   let currLoc = (fecha) ? new Date(fecha) : (new Date());
//   let utc = currLoc.getTime() + (currLoc.getTimezoneOffset() * 60000);
//   return new Date(utc + (3600000 * offset)).toLocaleString('es-MX', {
//   day: 'numeric', month: 'numeric', year: 'numeric',
//   second: 'numeric', minute: 'numeric', hour: 'numeric', weekday: 'long',
//   hour12: true, timeZone: 'America/Mexico_City'
// });
// }


function Dia_horaLocal(d) {

  const config = {
    minute: '2-digit', hour: '2-digit', weekday: 'short',
    day: "2-digit", month: "short", year: "numeric",
    hour12: true, timeZone: "UTC"
  };
  //     let hora = d1.toLocaleString('es-MX',{day:"2-digit", month:"short", year:"numeric", weekday:'short',
  //   hour12:true, hour:"2-digit", minute:"2-digit", timeZone:'America/Mexico_City'})
  //   console.log('hora',hora);
  // console.log(d)
  return horaLocal(d, config)
}

function date_diff_indays(date1, date2) {
  const dt1 = new Date(date1)
  const dt2 = new Date(date2)


  const ms1 = dt1.getTime();
  const ms2 = dt2.getTime();

  const diff2 = ms2 - ms1;
  let hora = 0;
  // const diff = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours(), dt2.getMinutes()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours(), dt1.getMinutes()) )/(1000 * 60) );
  // const diff2 = (Date(dt2.getFullYear(), dt2.getMonth(), dt2.getDate(), dt2.getHours(), dt2.getMinutes()) - Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate(), dt1.getHours(), dt1.getMinutes()));
  const horagross = diff2 / (1000 * 60 * 60);
  if (horagross < 1) {
    hora = 0
  } else {
    hora = parseInt(horagross);
  }

  // //console.log'horagross', horagross, "hora ", hora )
  const min = ((horagross - hora) * (60)).toFixed(0)
  // //console.log'horagross', hora, 'min', min);
  const tiempo = hora + 'h ' + min + 'min';
  return tiempo
}


function numTrimestre(d) {

  let q = [1, 2, 3, 4];
  return q[Math.floor(d.getMonth() / 3)]
}


function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  //console.log"w", ISOweekStart)
  //console.log"w", w, y)
  return ISOweekStart;
}

// function getMondayDate(w, year) {
//   let month = 11,
//     day = 31,
//     week,
//     d;

//   // Find week that 31 Dec is in. If is first week, reduce date until
//   // get previous week.
//   do {
//     d = new Date(year, month, day--);
//     week = getWeekNumber(d);
//     //console.logyear, month, day, d.toISOString())
//     if (day == -366) break;
//   } while (week != w - 1);
//   d = new Date(year, month, day + 2)
//   return d;
// }

function getMondayDate(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}




export {
  getWeekNumber,
  getWeekNumber2,
  fechaUnica,
  queFecha,
  queMesAno,
  horaLocal,
  Dia_horaLocal,
  date_diff_indays,
  numTrimestre, fechaActual,//, fechaActualString,
  getDateOfISOWeek,
  fechaUnicaVariable,
  queMesAnoEficiencia,
  queMesEficiencia,
  weeksInYear,
  getMondayDate,
  getYear,
  utcDateToLocal,
  fechaRegional,
  
  
};