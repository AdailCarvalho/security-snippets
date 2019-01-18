/**
 * JS Controller para as regras de segurança.
 */
class SecurityController {
	
	constructor(errorMessage) {
		this._business = new SecurityBusiness(errorMessage);
	}
	
	applySecurityConstraintsOnInformation(idsGrids, idInformation, idsExcludeFields) {
		
		let self = this;
		
		let securitySections = null;
		if (idInformation) {
			securitySections = $('section[sssecurity-information="' + idInformation + '"]');
		}
		else {
			securitySections = $("section[sssecurity-information]");
		}
		
		let divsGrids = null;
		
		if (idsGrids && idsGrids.length > 0) {
			divsGrids = idsGrids.map(idGrid => $('#' + idGrid));
		}
		
		if (securitySections && securitySections.length > 0) {
			
			for (let i = 0; i < securitySections.length; i++) {
				let section = securitySections[i];
				let idInformation = section.attributes['sssecurity-information'].nodeValue;

				$.when(self._business.findTiposAcessoByPerfisAndInformacao(idInformation))
				.done(function(serverData) {
					if (!(serverData && serverData.length > 0)) {
						self._disableAllFieldsClickRuled(section, divsGrids, idsExcludeFields);
					}
				})
				.fail((xhr, textStatus, errorThrown) => {
					if (section.attributes['sssecurity-dontredirect']) {
						self._disableAllFields(section, divsGrids);						
					}
					else {
						MessageView.showFailMessage(self._errorMessage,
								'Erro ao obter os tipos de acesso.', xhr, textStatus)
					}
				});
			}
		}
	}

	applyEstagioSecurityConstraints(idsGrids, idInformation, idsExcludeFields) {
		let self = this;
		let securitySections = null;
		if (idInformation) {
			securitySections = $('section[sssecurity-information="' + idInformation + '"]');
		} else {
			securitySections = $("section[sssecurity-information]");
		}
		
		let divsGrids = null;
		
		if (idsGrids && idsGrids.length > 0) {
			divsGrids = idsGrids.map(idGrid => $('#' + idGrid));
		}
		
		if (securitySections && securitySections.length > 0) {
			
			for (let i = 0; i < securitySections.length; i++) {
				let section = securitySections[i];
				self._disableAllFieldsClickRuled(section, divsGrids, idsExcludeFields);
			}
		}
	}
	
	applySecurityConstraintsOn(idInformation, idsElements, isEstagioDisabled, hideElement) {
		let self = this;
		$.when(self._business.findTiposAcessoByPerfisAndInformacao(idInformation))
		.done(function(serverData) {
			if(!(serverData && serverData.length > 0)) {
				self._disableElements(idsElements, true);
			} else if (isEstagioDisabled && isEstagioDisabled == true) {
				self._disableElements(idsElements, true);
			} else {
				self._disableElements(idsElements, false);
			}
		})
		.fail((xhr, textStatus, errorThrown) => {
			if (xhr.status == 401 && hideElement == true) {
				self._hideButtons(idsElements);
			} else {
				self._disableElements(idsElements, true);
			}
			
		});
	}
	
	applyDisablingRulesOnElements(idElements) {
		let self = this;
		if (idElements && idElements.length > 0) {
			self._disableElements(idElements, true);
		}
	}
	
	_disableAllFieldsExcept(section, idsExcludeFields) {
		let self = this;
		$(section).find('*')
			.not(idsExcludeFields.join() + ',[sssecurity-information]').prop('disabled', true);
		
		for (let i = 0; i < idsExcludeFields.length; i ++) {
			let exceptElement = $(idsExcludeFields[i]);
			if (exceptElement.is(':disabled')) {
				exceptElement.removeProp('disabled');
			}
			exceptElement.find('*').removeProp('disabled');
		}
	}
	
	_disableAllFields(section, divsGrids) {
		this._disableAllFieldsLessLinksAndClicks(section, divsGrids);
		this._disableLinks(section);
		this._disableClicks(section);
	}
	
	_disableAllFieldsClickRuled(section, divsGrids, idsExcludeFields) {
		if (idsExcludeFields && idsExcludeFields.length > 0) {
			this._disableAllFieldsExcept(section, idsExcludeFields);
		} else {
			this._disableAllFieldsLessLinksAndClicks(section, divsGrids);
			this._disableClickRuled(section);
		}
	}
	
	_disableAllFieldsLessLinksAndClicks(section, divsGrids) {
		$(section).find('*')
			.not('[sssecurity-notevaluate], [sssecurity-information]')
			.attr('disabled', 'disabled');
		
		this._disableIframes(section);
		
		if (divsGrids && divsGrids.length > 0) {
			this._configureReadOnlyGrids(section, divsGrids);
		}
	}
	
	_disableClicks(section) {
		$(section).find('*').removeAttr("onclick");
	}
	
	_disableLinks(section) {
		let links = $(section).find('a');
		if (links && links.length > 0) {
			links.addClass("disable-link");
		}
	}
	
	_disableClickRuled(section) {
		let disableElements = $(section).find('*')
			.not('[sssecurity-dontdisableclick],[sssecurity-notevaluate]');
		if (disableElements && disableElements.length > 0) {
			disableElements.removeAttr("onclick");
		}
	}
	
	_disableIframes(section) {
		let iframes = $(section).find('iframe');
		if (iframes && iframes.length > 0) {
			iframes.addClass("disable-link");
		}
	}
	
	_configureReadOnlyGrids(section, divsGrids) {
		setTimeout(() =>
			divsGrids.forEach(divGrid => 
				divGrid.find('*')
				.attr("disabled", true).off('click')), 3500);
	}
	
	_hideButtons(idsButtons) {
		if (idsButtons) {
			for (let i = 0; i < idsButtons.length; i ++) {
				$(idsButtons[i]).hide('fast');
			}
		}
	}
	
	_disableElements(idsElements, isDisabled) {
		if (idsElements) {
			for (let i = 0; i < idsElements.length; i ++) {
				$(idsElements[i]).attr('disabled', isDisabled).off('click');
				$(idsElements[i]).children().attr('disabled', isDisabled);
			}
		}
	}

}