const readline = require('readline-sync')
const robots = {
	text: require('./robots/text.js')
}
async function start() {

	const content = {} 

// Criando objetos que recebem o resutato das funções abaixo 
	content.searchTerm = askAndReturnSearchTerm()
	content.prefix = askAndReturnPrefix() 

	await robots.text(content)


//função que dirá ao sistema qual o termo de busca digitado pelo usuário
function start() {

	const content = {}

	content.searchTerm = askAndReturnSearchTerm()
	content.prefix = askAndReturnPrefix() 

//função de termo de busca
	function askAndReturnSearchTerm() {
		//Fará o input do usuário abrindo no SSH digitando: node index.js    ****Node deve estar instalado. Verificar a versão como o comando: node -v  
		return readline.question('Type a Wikipedia seargh term: ')
	}
//função que retornará o prefixo escolhido pelo usuário
	function askAndReturnPrefix() {
		//criando lista com os prefixos disponíveis ao usuário e atribuindo-a ao objeto "prefixes"
		const prefixes = ['Who is', 'What is', 'The history of']
		// criando objeto que receberá a leitura do prefixo escolhido pelo usuário
		const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
		// criando objeto que receberá o índice escolhido pelo usuário e identificará, pelo número, nome do prefixo escolhido
		const selectedPrefixText = prefixes[selectedPrefixIndex]
		// Retorna o valor do prefixo sendo o valor final dessa função
		return selectedPrefixText
	}
//Exibirá todas as constantes (content.searchTerm e content.pre=======
//função de prefixo
	function askAndReturnPrefix() {
		const prefixes = ['Who is', 'What is', 'The history of']
		const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
		const selectedPrefixText = prefixes[selectedPrefixIndex]

		return selectedPrefixText
	}
//Exibirá todas as constantes
	console.log(content)
}

start()