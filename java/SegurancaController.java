package br.com.egs.ss.siteSolution.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/seguranca")
public class SegurancaController extends BaseController {

    @Autowired
    private SegurancaService service;

    @GetMapping
    public ResponseEntity<List<SimpleObjectDTO>> tiposAcessoLiberadosPorPerfisEInformacao(
            @RequestParam(value = "idInformacao") Long idInformacao,
            @RequestParam(value = "idWarRoom") Long idWarRoom) {

        List<PerfilModel> perfis =
                BaseController.obterPerfisUsuarioFromRequest();

        if (perfis == null || perfis.isEmpty()) {
            throw new SSSecurityException("Usuário sem perfil de acesso.");
        }

        Set<InformacaoTipoAcessoModel> informacaoTipoAcessoModels =
                service.tiposAcessoLiberadosPorPerfisEInformacao(idInformacao, perfis, idWarRoom);

        List<SimpleObjectDTO> listaDTO = informacaoTipoAcessoModels.stream().
                map(m -> new SimpleObjectDTO(m.getId(), m.getNome())).collect(Collectors.toList());

        return new ResponseEntity<>(listaDTO, HttpStatus.OK);
    }

}
