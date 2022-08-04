/*-------------------------------------------Variable declaration-------------------------------------------*/
const chavesList = document.querySelector('[data-js="chaves-list"]')
const db = firebase.firestore()
const botaoEnviar = document.getElementById('botaoEnviar')
const divCadastro = document.getElementById('divCadastro')
const divPesquisarChave = document.getElementById('divPesquisarChave')
const firstLabel = document.getElementById('firstLabel')
const secondLabel = document.getElementById('secondLabel')
const searchButton = document.getElementById('searchButton')
let imobiliaria, vistoriador, endereço, tipo, observacao
/*----------------------------------------------------------------------------------------------------------*/





/*------------------------------------Write Form data to Variables------------------------------------------*/
getFormData = () => {
    imobiliaria = document.getElementsByName('imobiliaria')[0].value
    vistoriador = document.getElementsByName('vistoriador')[0].value
    endereço = document.getElementById('endereco').value
    tipo = document.querySelector('input[name="tipodevistoria"]:checked').value
    observacao = document.getElementById('observacao').value
}
/*-----------------------------------Reset Form input information-------------------------------------------*/





/*----------------------------------------------------------------------------------------------------------*/
resetData = () => {
    document.getElementById('imobiliaria').value = ''
    document.getElementById('vistoriador').value = ''
    document.getElementById('endereco').value = ''
    document.querySelector('input[name="tipodevistoria"]:checked').value = ''
    document.getElementById('observacao').value = ''
    document.getElementById('chaveFoto').value = ''
}
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------------Send data to firebase-----------------------------------------------*/
const getDataFromFirebase = () => {
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
		}
	)
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Watch for Send Button event----------------------------------------*/
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
/*----------------------------------------------------------------------------------------------------------*/





/*------------------------------------Convert Canvas image to Base64----------------------------------------*/
const converterImagem = () => {
	const canvas = document.getElementById('imagemReduzida');
    const imagemReduzida = canvas.toDataURL();
    foto = imagemReduzida
	console.log(foto)
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------Print Success of Fail Signal to screen-----------------------------------*/
const successSignal = () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Chave cadastrada com sucesso!',
        showConfirmButton: false,
        timer: 1500
    })
}
const filedSignal = () => {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao tentar cadastrar a chave!',
        showConfirmButton: false,
        timer: 1500
    })
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------Watch for Buttom click to hide and show site sections--------------------------*/
firstLabel.addEventListener('click', e => {
    divCadastro.hidden = false
    divPesquisarChave.hidden = true
})

secondLabel.addEventListener('click', e => {
    divCadastro.hidden = true
    divPesquisarChave.hidden = false
})
/*----------------------------------------------------------------------------------------------------------*/





/*----------------------------------Get search string and what search button--------------------------------*/
const getSearchString = e => {
	const searchString = document.getElementById('searchBar').value
	console.log(searchString)
    
    generateKeyList(searchString)
}



searchButton.addEventListener('click',  getSearchString)
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Generate Key List HTML---------------------------------------------*/
const generateKeyList = searchString => {
	alert(searchString)
}
/*----------------------------------------------------------------------------------------------------------*/