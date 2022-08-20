/*------------------------------------------Get Keys--------------------------------------------------------*/
const getDocs = () => {
    docArray = []
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
	            timeStamp: doc.data().FotoID
	        }
        docArray.push(docData)
		}, '')
	
	docArray.sort((a, b) => b.Datadeentrega.split('/').reverse().join('') - a.Datadeentrega.split('/').reverse().join(''))

	console.log(docArray)

	getImages()
	})
}
/*----------------------------------------------------------------------------------------------------------*/





/*-----------------------------------------Get Images-------------------------------------------------------*/
const getImages = () => {
    picArray = []
    db.collection("fotos").get().then(snapshot => {
        const fotosli = snapshot.docs.reduce((acc, doc) => {
            let picData = {
                Foto: doc.data().Foto,
                TimeStamp: doc.data().timeStamp
            }
            picArray.push(picData)
        }, '')
	
		console.log(picArray)

	    if(docArray === [] || picArray === []) return
	    
	    printBackup(docArray, picArray)
    })
}
/*----------------------------------------------------------------------------------------------------------*/





/*--------------------------------------------The BackUP trigger--------------------------------------------*/
const backup = () => {
	document.body.innerHTML = '<div id="loading" style="display: none;"><div id="loadingIcon" class="firstLoadingIcon"><div class="secondLoadingIcon"><div class="thirdLoadingIcon"></div></div></div></div>'
	document.getElementById('loading').style.display = "block";

    getDocs()
}
/*----------------------------------------------------------------------------------------------------------*/





/*-------------------------------------------To print the BackUP--------------------------------------------*/
const printBackup = (docArray, picArray) => {
    docArray.forEach((item, index) => {
        for (let i = 0; i < docArray.length; i++) {
            if(docArray[index].timeStamp === picArray[i].timeStamp) temp = picArray[i].Foto
        }
        document.body.innerHTML += `
								<br><div class='resultadoPesquisa input'>
									<p><li>Imobiliária:
									${docArray[index].Imobiliária}</p></li>
									<p><li>Endereço:
									${docArray[index].Endereço}</p></li>
									<p><li>Entregue por:
									${docArray[index].Vistoriador}</p></li>
									<p><li>Tipo da vistoria:
									${docArray[index].Tipodavistoria}</p></li>
									<p><li>Observação:
									${docArray[index].Observação}</p></li>
									<p><li>Data de entrega:
									${docArray[index].Datadeentrega}</p></li>
									<br>
                                    <img class='fotoDeResultado' src="${temp}">
								</div><br>
								`
    })
}
/*----------------------------------------------------------------------------------------------------------*/