
//Importando módulos de pesquisa do google e a classe "State"
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const state = require('./state.js')

//Importando as credenciais do google
const googleSearchCredentials = require('../credentials/google-search.json')


async function robot() {
	const content = state.load()

	await fetchImagesOfAllSentences(content)

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

}

module.exports = robot