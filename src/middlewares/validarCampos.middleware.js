// Middleware para validar campos obrigatórios no body da requisição.
// Ele recebe uma lista de campos e devolve uma função middleware.
export default function validarCampos(camposObrigatorios) {
  // Esta função será executada pelo Express antes do controller.
  return (req, res, next) => {
    // Filtra os campos que não vieram ou vieram vazios.
    const camposAusentes = camposObrigatorios.filter((campo) => {
      // req.body?.[campo] acessa o campo com segurança, mesmo se body não existir.
      const valor = req.body?.[campo];

      // Consideramos ausente: undefined, null, string vazia ou string só com espaços.
      return valor === undefined || valor === null || valor === "" || (typeof valor === "string" && valor.trim() === "");
    });

    // Se algum campo obrigatório estiver faltando, encerramos a requisição com status 400.
    if (camposAusentes.length > 0) {
      return res.status(400).json({
        message: `Campos obrigatórios ausentes: ${camposAusentes.join(", ")}.`,
      });
    }

    // Se está tudo certo, deixamos a requisição continuar para o controller.
    return next();
  };
}
