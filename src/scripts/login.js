function login() {
    let usuario = document.getElementById('txtUsuario').value;
    let senha = document.getElementById('txtSenha').value;
    let mensagem = document.getElementById('mensagem');

    if (usuario == 'user' && senha == '123') {
        mensagem.style.color = 'green';
        mensagem.innerText = 'Usuario Correto';

        setTimeout(() => {
            window.location.href = '../../../index.html';
        }, 500);
    }

    else if (usuario == 'admin' && senha =='123'){
        mensagem.style.color = 'green';
        mensagem.innerText = 'Usuario Correto';

        setTimeout(() => {
            window.location.href = '../../../src/components/tela-cadastro/cadastro.html';
        }, 500);
    }

    else {
        mensagem.style.color = 'red';
        mensagem.innerText = 'Usuario/senha invalida';
    }
} 