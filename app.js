const chavesList = document.querySelector('[data-js="chaves-list"]')
const db = firebase.firestore()
const botaoEnviar = document.getElementById('botaoEnviar')
let imobiliaria, vistoriador, endereço, tipo, observacao

getFormData = () => {
    //imobiliaria = document.getElementById('imobiliaria').value
    imobiliaria = document.getElementsByName('imobiliaria')[0].value
    vistoriador = document.getElementById('vistoriador').value
    endereço = document.getElementById('endereco').value
    tipo = document.querySelector('input[name="tipodevistoria"]:checked').value
    observacao = document.getElementById('observacao').value
}

resetData = () => {
    document.getElementById('imobiliaria').value = ''
    document.getElementById('vistoriador').value = ''
    document.getElementById('endereco').value = ''
    document.querySelector('input[name="tipodevistoria"]:checked').value = ''
    document.getElementById('observacao').value = ''
    document.getElementById('chaveFoto').value = ''
}

db.collection('chaves').get()
	.then( snapshot => {
		const chavesli = snapshot.docs.reduce((acc, doc) => {
			acc += `
				<li>${doc.data().Imobiliária}</li>
				<li>${doc.data().Endereço}</li>
				<li>${doc.data().Vistoriador}</li>
				<li>${doc.data().Tipo}</li>
				<li>${doc.data().Observação}</li>
				<li><img src="${doc.data().Foto}"></li>
				`
			return acc
		}, '')

		chavesList.innerHTML = chavesli

	})
	.catch(err => {
		console.log(err.message)
	})


botaoEnviar.addEventListener('click', e => { //enviar dados
	getFormData()
	converterImagem()
	db.collection('chaves').add({
		Imobiliária: imobiliaria,
		Vistoriador: vistoriador,
		Endereço: endereço,
		Tipo: tipo,
		Observação: observacao,
		Foto: foto
	}).then(successSignal).catch(filedSignal)

})




function converterImagem() {
	const canvas = document.getElementById('imagemReduzida');
    const imagemReduzida = canvas.toDataURL();
    foto = imagemReduzida
	console.log(foto)
}


/*
function converterImagem() {

	var receberArquivo = document.getElementById('chaveFoto').files

	if(receberArquivo.length > 0) {
		var carregarImagem = receberArquivo[0]

		var lerArquivo = new FileReader()
		
		lerArquivo.onload = function(arquivoCarregado) {
			var imagemBase64 = arquivoCarregado.target.result
			foto = imagemBase64
			console.log(foto)
		}

		lerArquivo.readAsDataURL(carregarImagem)
		
	}
}
*/
const successSignal = () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
    })
}

const filedSignal = () => {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Your work has not been saved',
        showConfirmButton: false,
        timer: 1500
    })
}