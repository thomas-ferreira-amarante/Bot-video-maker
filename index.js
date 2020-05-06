const readline = require('readline-sync')
function start() {

	const content = {}

	content.searchTerm = askAndReturnSearchTerm()
	content.prefix = askAndReturnPrefix() 

//função de termo de busca
	function askAndReturnSearchTerm() {
		//Fará o input do usuário abrindo no SSH digitando: node index.js    ****Node deve estar instalado. Verificar a versão como o comando: node -v  
		return readline.question('Type a Wikipedia seargh term: ')
	}
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