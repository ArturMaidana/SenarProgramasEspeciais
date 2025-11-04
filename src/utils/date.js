export function dataAtual() {
    let hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth() + 1;
    let dia = hoje.getDate();
    let mesFormatado = mes.toString().padStart(2, '0');
    let diaFormatado = dia.toString().padStart(2, '0');
    let dataFormatada = `${ano}-${mesFormatado}-${diaFormatado}`;
    return dataFormatada;
}