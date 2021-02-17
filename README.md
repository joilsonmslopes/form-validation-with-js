# Formulário de cadastro com validações

Este é um formulario para cadastro com validações do frontend.
Neste exemplo faço uma requisição do CEP consumindo a API do ViaCep,
onde quando um CEP é válido, os campos de rua, número, complemento, uf
e cidade aparecem, porem, se o CEP é inválido, os campos voltam ao estado inicial, ocultos.

![](/imgs/screenshot_website.png)

### Tipos de validação

- Campo obrigatório
- Número mínimo de caracteres
- Número máximo de caracteres
- Campos que não aceitam números e nem caracteres especiais
- Validação de CPF (onde só aceitam CPFs realmente válidos) 
- Validação de CEP (onde só aceitam CEPs realmente válidos)
- E-mails precisam ser do tipo: Ex "joao@email.com" ou "joao@email.com.br"
- E-mails precisam ser iguais

### Tecnologias utilizadas

- Framework Bootstraps 4
- SASS
- jQuery (apenas paras as máscaras dos campos CPF, CEP e Celular)
- Javascript

Utilizei o Javascript para fazer todas as validações
e o plugin jQuery Mask Plugin do Igor Escobar

**Aqui está o github dele:**
- [igorescobar](https://github.com/igorescobar/jQuery-Mask-Plugin)

### API utilizada

- [Viacep](https://viacep.com.br/)

### Desenvolvido por

- [joilsonmslopes](https://www.linkedin.com/in/joilsonmslopes/)