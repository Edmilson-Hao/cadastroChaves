/*-------------------------------------------Variable declaration-------------------------------------------*/
const db = firebase.firestore()

const chavesList = document.getElementById('chavesList')
const botaoEnviar = document.getElementById('botaoEnviar')
const divCadastro = document.getElementById('divCadastro')
const divPesquisarChave = document.getElementById('divPesquisarChave')
const firstLabel = document.getElementById('firstLabel')
const secondLabel = document.getElementById('secondLabel')
const searchBar = document.getElementById('searchBar')
const searchButton = document.getElementById('searchButton')

//mensagens
const errorMessageOne = 'Erro ao tentar cadastrar a chave!'
const errorMessageTwo = 'Chave não encontrada!'

//dados
let imobiliaria, vistoriador, endereço, tipo, observacao, dataEnvio
/*----------------------------------------------------------------------------------------------------------*/





/*------------------------------------Write Form data to Variables------------------------------------------*/
const getFormData = () => {
    imobiliaria = document.getElementsByName('imobiliaria')[0].value
    vistoriador = document.getElementsByName('vistoriador')[0].value
    endereço = document.getElementById('endereco').value
    tipo = document.querySelector('input[name="tipodevistoria"]:checked').value
    observacao = document.getElementById('observacao').value
    dataEnvio = new Date().toLocaleDateString("pt-BR")
}
/*----------------------------------------------------------------------------------------------------------*/



/*-----------------------------------Reset Form input information-------------------------------------------*/
const resetData = () => {
    document.getElementsByName('imobiliaria')[0].value = ''
    document.getElementsByName('vistoriador')[0].value = ''
    document.getElementById('endereco').value = ''
    document.getElementById('observacao').value = ''
}
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------------Get data from firebase-----------------------------------------------*/
const getDataFromFirebase = searchString => {
	chavesList.innerHTML = ''
	db.collection('chaves').get()
		.then( snapshot => {
			const chavesli = snapshot.docs.reduce((acc, doc) => {
				//if (searchString === doc.data().Endereço) {
				if (doc.data().Endereço.toLowerCase().includes(searchString.toLowerCase())) {
					acc += `
					<br>
						<div class='resultadoPesquisa input'>
						<p><li>Imobiliária:
						${doc.data().Imobiliária}</p></li>
						<p><li>Endereço:
						${doc.data().Endereço}</p></li>
						<p><li>Vistoriador:
						${doc.data().Vistoriador}</p></li>
						<p><li>Tipo da vistoria:
						${doc.data().Tipo}</p></li>
						<p><li>Observação:
						${doc.data().Observação}</p></li>
						<p><li>Data de entrega:
						${doc.data().Data}</p></li>
						<br>
						<img class='fotoDeResultado' src="${doc.data().Foto}">
						</div>
						<br>
						`
				}
				return acc
			}, '')

			if(chavesli === '') failedSignal(errorMessageTwo)
			else chavesList.innerHTML = chavesli

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
		Foto: foto,
		Data: dataEnvio
	})
	.then(() => {
		successSignal()
		resetData()
	})
	.catch(err => {
		failedSignal(errorMessageOne)
	})

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





/*---------------------------------Print Success or Fail Signal to screen-----------------------------------*/
const successSignal = () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Chave cadastrada com sucesso!',
        showConfirmButton: false,
        timer: 1500
    })
}
const failedSignal = message => {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------Watch for Buttom click to hide and show site sections--------------------------*/
firstLabel.addEventListener('click', e => {
    divCadastro.hidden = false
    divPesquisarChave.hidden = true
    document.getElementById('pageTitle').innerHTML = 'Cadastrar Chave'
})

secondLabel.addEventListener('click', e => {
	document.getElementById('pageTitle').innerHTML = 'Pesquisar Chave'
    divCadastro.hidden = true
    divPesquisarChave.hidden = false
})
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------Get search string and whatch search button--------------------------------*/
const getSearchString = e => {
	const searchString = document.getElementById('searchBar').value
	console.log(searchString)
    
    generateKeyList(searchString)
}



searchButton.addEventListener('click',  getSearchString)
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Generate Key List HTML---------------------------------------------*/
const generateKeyList = searchString => {
	getDataFromFirebase(searchString)
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Watch for Enter on Search Bar--------------------------------------*/
searchBar.addEventListener('keypress', e => {
	if (e.key === 'Enter')searchButton.click()
})
/*----------------------------------------------------------------------------------------------------------*/