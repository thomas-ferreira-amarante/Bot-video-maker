
//Importando módulos de pesquisa do google e a classe "State"
const imageDownloader = require('image-downloader')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

//Importando as credenciais do google
const googleSearchCredentials = require('../credentials/google-search.json')


async function robot() {
	const content = state.load()

	await fetchImagesOfAllSentences(content)

	await downloadAllImages(content)

	state.save(content)

	async function fetchImagesOfAllSentences(content) {
		for (const sentence of content.sentences) {
			const query = `${content.searchTerm} ${sentence.keywords[0]}`
			sentence.images = await fetchGoogleAndReturnImagesLinks(query)

			sentence.googleSearchQuery = query
		}
	}


	async function fetchGoogleAndReturnImagesLinks (query) {
		// objetos que necessitam ser passados para a pesquisa (auth (dados de autenticação), cx(contexto), q(query, ou seja, o que o usuário deseja procurar), searchType(com o images selecionado, retornará apenas imagens) e num(número de resultados para retorno))
		const response = await customSearch.cse.list({
			auth: googleSearchCredentials.apiKey,
			cx: googleSearchCredentials.searchEngineId,
			q: query,
			searchType: 'image',
			//imgSize: 'huge', // qualidade da imagem
			num: 2
		})

		const imagesUrl = response.data.items.map((item) => {
			return item.link
		})

		return imagesUrl
	}

	async function downloadAllImages(content) {
		// criando um array de imagens baixadas
		content.downloadedImages = []

			for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
			const images = content.sentences[sentenceIndex].images

			for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
				const imageUrl = images[imageIndex]

				try {
					// Verificando se a imagem que está sendo baixada já existe para acusar erro de imagem duplicada!
					if (content.downloadedImages.includes(imageUrl)) {
						throw new Error('Imagem já foi baixada!')
					}

					await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
					content.downloadedImages.push(imageUrl)
					console.log(`> [${sentenceIndex}][${imageIndex}] A Imagem foi baixada com sucesso!: ${imageUrl}`)
					break
				} catch(error) {
					console.log(`> [${sentenceIndex}][${imageIndex}] Erro ao baixar a imagem (${imageUrl}): ${error}`)
				}
				
			}
		}

	}
	//salva a imagem no local
	async function downloadAndSave(url, fileName) {
		return imageDownloader.image({
			url, url,
			dest: `./content/${fileName}`
		})
	}
}

module.exports = robot