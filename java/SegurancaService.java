package br.com.egs.ss.siteSolution.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SegurancaService {

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    IntervencaoAtividadeService intervencaoAtividadeService;

    @Autowired
    InformacaoPerfilService informacaoPerfilService;

    @Autowired
    InformacaoAcessoDisponivelService informacaoAcessoDisponivelService;

    @Autowired
    ExemploService exemploService;

    public Set<InformacaoTipoAcessoModel> tiposAcessoLiberadosPorPerfisEInformacao(Long idInformacao,
            List<PerfilModel> perfis, Long idWarRoom) {
        if (warRoomPossuiWorkflow(idWarRoom)
                && informacaoExigeAtividade(idInformacao)
                && !usuarioPossuiAtividade(idWarRoom)) {
            return new HashSet<>();
        } else {
            Set<InformacaoPerfilModel> informacoesDosPerfis = informacoesDosPerfisDoUsuario(idInformacao, perfis);
            return tiposDeAcesso(informacoesDosPerfis);
        }
    }

    private Set<InformacaoPerfilModel> informacoesDosPerfisDoUsuario(Long idInformacao, List<PerfilModel> perfis) {
        Set<InformacaoPerfilModel> informacoesDosPerfis =
                informacaoPerfilService.findByPerfisAndInformacao(perfis, new InformacaoModel(idInformacao));
        if (informacoesDosPerfis == null || informacoesDosPerfis.isEmpty()) {
            throw new SSSecurityException("O usuário autenticado não possui permissão de acesso a esta área.");
        }
        return informacoesDosPerfis;
    }

    private boolean warRoomPossuiWorkflow(Long idWarRoom) {
        WarRoomModel warRoomModel = exemploService.findById(new WarRoomModel(idWarRoom));
        return (warRoomModel != null && warRoomModel.getIntervencao() != null);
    }

    private boolean informacaoExigeAtividade(Long idInformacao) {
        return informacaoAcessoDisponivelService.findOne(idInformacao, 1L)
                .getExigeAtividade().getBooleanValue();
    }

    private boolean usuarioPossuiAtividade(Long idWarRoom) {
        return intervencaoAtividadeService.usuarioPossuiAtividadeDesignadaNoWR(
                usuarioService.usuarioLogado().getLogin(), idWarRoom);
    }

    private Set<InformacaoTipoAcessoModel> tiposDeAcesso(Set<InformacaoPerfilModel> informacoesDosPerfis) {
        Set<InformacaoTipoAcessoModel> tiposAcessos = new HashSet<>();
        informacoesDosPerfis.iterator().next().getTiposAcesso().forEach(
                tamodel -> tiposAcessos.add(tamodel.getPk().getInformacaoTipoAcessoModel()));
        return tiposAcessos;
    }


	public boolean usuarioPossuiAcessoInformacao(String loginUsuario, Long idInformacao, EnumTipoAcesso tipoAcesso) {
    	switch (tipoAcesso) {
			case LEITURA:
				return usuarioService.possuiAcessoLeitura(loginUsuario, idInformacao);
			case ESCRITA:
				return usuarioService.possuiAcessoEscrita(loginUsuario, idInformacao);
			default:
				throw new RuntimeException("Tipo de acesso não suportado.");

		}
	}

}
