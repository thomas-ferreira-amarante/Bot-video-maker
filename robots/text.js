const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
	await fecthContentFromWikipedia(content)
	sanitizeContent(content) 
	breakContentIntoSentences(content)

	async function fecthContentFromWikipedia(content) {
		
		const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
		const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
		const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
		const wikipediaContent = wikipediaResponde.get()
		
		content.sourceContentOriginal = wikipediaContent.content
	}

	function sanitizeContent(content) {
		const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
		const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
		
		content.souceContentSanitized = withoutDatesInParentheses

		function removeBlankLinesAndMarkdown(text) {
			const allLines = text.split('\n')
			// Criando um filtro em todas as linhas 
			const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
				//identficando o tamanho das linhas e identificando linhas com o tamanho = 0
				if (line.trim().length === 0 || line.trim().startsWith('=')) {
					// caso seja 0, a linha é excluída
					return false
				}
				// caso seja maior que 1, ou seja, a linha não esteja vazia, mantém-se no resultado
				return true
			})
			// Exibe o texto com o resultado do filtro aplicado
			return withoutBlankLinesAndMarkdown.join(' ')	
		}

	}

	function removeDatesInParentheses(text) {
		return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
	}   

	function breakContentIntoSentences(content) {
		content.sentences = []

		const sentences = sentenceBoundaryDetection.sentences(content.souceContentSanitized)
		sentences.forEach((sentence) => {
			content.sentences.push({
				text: sentence,
				keywords: [],
				images: []
			})
		})
	}
}

module.exports = robot