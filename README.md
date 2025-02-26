# MapFindMe

Um aplicativo web simples que mostra a localização atual do usuário em um mapa e registra um histórico das últimas localizações verificadas.

## Características

- Exibição da localização atual do usuário em um mapa interativo
- Armazenamento local do histórico de localizações (até 10 locais)
- Interface responsiva que funciona em dispositivos móveis e desktop
- Informações detalhadas sobre cada localização registrada
- Capacidade de visualizar localizações anteriores no mapa

## Tecnologias Utilizadas

- HTML5 Geolocation API para obter a localização do usuário
- Leaflet.js como biblioteca de mapas de código aberto (API gratuita)
- OpenStreetMap como provedor de dados de mapa
- LocalStorage para armazenar o histórico de localizações
- API de Geocodificação Reversa do Nominatim para obter informações de endereço

## Como Usar

1. Acesse o site através do GitHub Pages (link abaixo)
2. Clique no botão "Localizar-me" para obter sua localização atual
3. Sua posição será exibida no mapa e adicionada ao histórico
4. Você pode visualizar localizações anteriores clicando no botão "Ver" ao lado de cada entrada no histórico

## Limitações

- O aplicativo requer permissão de localização do navegador
- O histórico é armazenado apenas localmente (no dispositivo do usuário)
- Limitado às restrições de uso da API Nominatim (máximo de 1 requisição por segundo)

## Demonstração

O site está disponível em: [https://toddyivon.github.io/MapFindMe](https://toddyivon.github.io/MapFindMe)

## Instalação Local

Para executar o projeto localmente:

1. Clone o repositório:
   ```
   git clone https://github.com/toddyivon/MapFindMe.git
   ```

2. Abra o arquivo `index.html` em seu navegador

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.