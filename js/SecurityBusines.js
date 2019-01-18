/**
 * JS Business para as regras de segurança.
 */
class SecurityBusiness {
	
	constructor(errorMessage) {
		this._errorMessage = errorMessage;
	}
	
	findTiposAcessoByPerfisAndInformacao(idInformacao) {
		let url = '/seguranca?' + $.param({idInformacao : idInformacao, idWarRoom : getIdWarRoom()});
		return $.ajax({url:url, type:"GET"});
	}
	
}