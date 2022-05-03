export function getFecha(fecha) {
    let date = new Date(fecha);
    let diaSemana = getDiaSemana(date.getDay());
    let dia = date.getDate();
    let mes = getMes(date.getMonth());
    let anio = date.getFullYear();
    return `${diaSemana}, ${dia} de ${mes} de ${anio}`;
}

function getDiaSemana(dia) {
    let diaSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return diaSemana[dia];
}

function getMes(mes) {
    let arrMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return arrMes[mes];
}