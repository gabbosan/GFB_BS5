README — Deploy e comandos úteis

Este arquivo lista comandos básicos para versionamento, teste local e deploy no Vercel.

1) Configurar Git (uma vez por máquina)
- git config --global user.name "Seu Nome"
- git config --global user.email "seu@email.com"

2) Inicializar repositório e primeiro commit
- git init
- git add .
- git commit -m "Inicial commit — site GFB"
- git branch -M main

3) Adicionar remoto (GitHub)
- git remote add origin https://github.com/gabbosan/GFB_BS5.git
- git push -u origin main

4) Fluxo diário (alterações)
- git add .
- git commit -m "Descrição curta"
- git push

5) Instalar ferramentas úteis (opcional)
- npm i -g vercel
- npm i -g live-server
- npm i -g http-server

6) Testar localmente
- live-server
ou
- http-server . -c-1

7) Deploy no Vercel
- vercel login
- vercel         # deploy interativo
- vercel --prod  # deploy produção
- vercel --confirm --prod  # deploy não interativo

8) Logs Vercel
- vercel logs NOME_PROJETO --prod

9) Hard-refresh (navegador)
- Windows: Ctrl+Shift+R ou Ctrl+F5
- Mac: Cmd+Shift+R

10) Arquivos recomendados
- .vercelignore  (listar o que não deve subir)
- README-deploy.md (este arquivo)

Exemplo mínimo de .vercelignore
node_modules
.DS_Store
.vscode

Comandos prontos para este projeto (`GFB_BS5`):

1) Criar .vercelignore, README e enviar ao GitHub via `gh`:
```
echo node_modules>.vercelignore
echo .vscode>>.vercelignore
echo .DS_Store>>.vercelignore
echo "# GFB_BS5" > README.md
git add .
git commit -m "Inicial commit — GFB_BS5"
git branch -M main
gh repo create gabbosan/GFB_BS5 --public --source=. --remote=origin --push
```

2) Deploy via Vercel (painel web recomendado se `npm` bloqueado):
```
vercel login
vercel --prod
```

Se preferir que eu faça o commit `.vercelignore` e o primeiro push localmente, me autorize que eu adicione e commite os arquivos por você.

Se quiser, eu:
- renomeio para README.md e adiciono ao repositório;
- crio um `.vercelignore` com padrões;
- faço o primeiro commit e te mostro os comandos exatos com o nome do repositório.

Quer que eu crie também o `.vercelignore` e commite os arquivos?