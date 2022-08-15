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
let searchString = ''

//mensagens
const errorMessageOne = 'Erro ao tentar cadastrar a chave!'
const errorMessageTwo = 'Chave não encontrada!'

//dados
let imobiliaria, vistoriador, endereço, tipo, observacao, dataEnvio
let newArray = []
let docArray = []
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




/*----------------------------------------------------------------------------------------------------------*/
/*--------------------------------------Get data from firebase----------------------------------------------*/
const getDataFromFirebase = () => {
if(newArray.length === 0){
	db.collection('chaves').get()

	.then( snapshot => {
    	const chavesli = snapshot.docs.reduce((acc, doc) => {
	        let docData = {
	            Imobiliária: doc.data().Imobiliária,
	            Endereço: doc.data().Endereço,
	            Vistoriador: doc.data().Vistoriador,
	            Tipodavistoria: doc.data().Tipo,
	            Observação: doc.data().Observação,
	            Datadeentrega: doc.data().Data,
	            Imagem: doc.data().Foto
	        }
        docArray.push(docData)
		}, '')
	
	docArray.sort((a, b) => b.Datadeentrega.split('/').reverse().join('') - a.Datadeentrega.split('/').reverse().join(''))
	
	console.log(docArray)

	filterKeys()
	})
} else {
	filterKeys()
}
}
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------------Search key on firebase array----------------------------------------*/
const filterKeys = () => {
	newArray = []

	docArray.forEach((item, index) => {
    	if(docArray[index].Endereço.toLowerCase().includes(document.getElementById('searchBar').value.toLowerCase())) newArray.push(docArray[index])
	})
	console.log(newArray)
	printSearchKeys()
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Print Search Filtered Keys-----------------------------------------*/
const printSearchKeys = () => {
	chavesList.innerHTML = ''

	newArray.forEach((item, index) => {
		chavesList.innerHTML += `
								<br><div class='resultadoPesquisa input'>
									<p><li>Imobiliária:
									${newArray[index].Imobiliária}</p></li>
									<p><li>Endereço:
									${newArray[index].Endereço}</p></li>
									<p><li>Vistoriador:
									${newArray[index].Vistoriador}</p></li>
									<p><li>Tipo da vistoria:
									${newArray[index].Tipodavistoria}</p></li>
									<p><li>Observação:
									${newArray[index].Observação}</p></li>
									<p><li>Data de entrega:
									${newArray[index].Datadeentrega}</p></li>
									<br>
									<img class='fotoDeResultado' src="${newArray[index].Imagem}">
								</div><br>
								`
	})
	document.getElementById('loading').style.display = "none";
	if(newArray.length === 0) failedSignal(errorMessageTwo)
}
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------------Send data to firebase-----------------------------------------------*/
const sendDataToFirebase = () => {
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
		document.getElementById('loading').style.display = "none";
		successSignal()
		resetData()
	})
	.catch(err => {
		failedSignal(errorMessageOne)
	})
}
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Watch for Send Button event----------------------------------------*/
botaoEnviar.addEventListener('click', e => { //enviar dados
	getFormData()

	converterImagem()
	
	document.getElementById('loading').style.display = "block";

	sendDataToFirebase()

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





/*-----------------------------------------Get search string------------------------------------------------*/
const getSearchString = () => searchString = document.getElementById('searchBar').value
/*----------------------------------------------------------------------------------------------------------*/





/*------------------------------------------------Whatch search button--------------------------------------*/
searchButton.addEventListener('click',  e => {
	document.getElementById('loading').style.display = "block";
	getSearchString()
	generateKeyList(searchString)
})
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Watch for Enter on Search Bar--------------------------------------*/
searchBar.addEventListener('keypress', e => {
	if (e.key === 'Enter')searchButton.click()
})
/*----------------------------------------------------------------------------------------------------------*/





/*---------------------------------------Generate Key List HTML---------------------------------------------*/
const generateKeyList = searchString => getDataFromFirebase(searchString)
/*----------------------------------------------------------------------------------------------------------*/

alert("Quando em rede móvel, evite fazer muitas pesquisas para economizar dados móveis!")
