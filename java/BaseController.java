public abstract BaseController {

//...

public static List<PerfilModel> obterPerfisUsuarioFromRequest() {

		SecurityContext securityContext = SecurityContextHolder.getContext();
		
    	List<PerfilModel> perfis = null;
		
		if (securityContext!=null && securityContext.getAuthentication() != null
				&& securityContext.getAuthentication().getAuthorities()!=null) 
		{
			perfis = new ArrayList<>();
			
			for (GrantedAuthority authority : securityContext.getAuthentication().getAuthorities()) {
				if (authority instanceof PerfilUsuarioModel &&
						EnumSituacao.ATIVO.equals(
								((PerfilUsuarioModel) authority).getSituacao())) {
					perfis.add(((PerfilUsuarioModel) authority)
							.getPk().getPerfilModel());
				}
			}
		}
		return perfis;
    }

 //..
}