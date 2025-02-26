document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o mapa com uma localização padrão (Brasil)
    const map = L.map('map').setView([-15.77972, -47.92972], 5);
    let userMarker = null;
    const maxHistoryItems = 10;
    const storageKey = 'mapfindme_history';
    
    // Inicializar o mapa usando o OpenStreetMap como fonte de dados
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Botão para localizar o usuário
    const locateBtn = document.getElementById('locate-btn');
    const statusMessage = document.getElementById('status-message');
    const locationHistory = document.getElementById('location-history');

    // Carregar histórico de localizações do localStorage
    let locationData = loadLocationHistory();
    updateLocationHistoryUI();

    // Adicionar evento ao botão de localização
    locateBtn.addEventListener('click', requestLocation);

    // Solicitar localização do usuário
    function requestLocation() {
        statusMessage.textContent = 'Solicitando sua localização...';
        
        if (!navigator.geolocation) {
            statusMessage.textContent = 'Geolocalização não é suportada pelo seu navegador.';
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }

    // Callback de sucesso para a geolocalização
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        // Exibir mensagem de sucesso
        statusMessage.textContent = `Localização encontrada com precisão de ${accuracy.toFixed(2)} metros`;

        // Atualizar o mapa
        updateMap(latitude, longitude);

        // Salvar a localização no histórico
        saveLocation(latitude, longitude);
    }

    // Callback de erro para a geolocalização
    function error(err) {
        let errorMessage = 'Erro ao obter sua localização';
        
        if (err.code === 1) {
            errorMessage = 'Permissão para acessar localização foi negada';
        } else if (err.code === 2) {
            errorMessage = 'Localização indisponível';
        } else if (err.code === 3) {
            errorMessage = 'Tempo limite para obter localização excedido';
        }
        
        statusMessage.textContent = errorMessage;
    }

    // Atualizar o mapa com a nova localização
    function updateMap(lat, lng) {
        // Centralizar o mapa na localização
        map.setView([lat, lng], 15);

        // Remover marcador antigo se existir
        if (userMarker) {
            map.removeLayer(userMarker);
        }

        // Adicionar novo marcador
        userMarker = L.marker([lat, lng]).addTo(map);
        userMarker.bindPopup('Você está aqui').openPopup();

        // Adicionar um círculo para mostrar a área aproximada
        L.circle([lat, lng], {
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.15,
            radius: 500
        }).addTo(map);
    }

    // Carregar histórico de localizações do localStorage
    function loadLocationHistory() {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    // Salvar nova localização no histórico
    function saveLocation(lat, lng) {
        // Obter informações adicionais da localização usando API de geocodificação reversa
        fetchLocationInfo(lat, lng).then(locationName => {
            // Criar novo item de histórico
            const newLocation = {
                lat: lat,
                lng: lng,
                name: locationName || 'Localização desconhecida',
                timestamp: new Date().toISOString()
            };

            // Adicionar ao início do array
            locationData.unshift(newLocation);

            // Limitar o tamanho do histórico
            if (locationData.length > maxHistoryItems) {
                locationData = locationData.slice(0, maxHistoryItems);
            }

            // Salvar no localStorage
            localStorage.setItem(storageKey, JSON.stringify(locationData));

            // Atualizar a UI
            updateLocationHistoryUI();
        });
    }

    // Obter nome da localização usando geocodificação reversa
    async function fetchLocationInfo(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            return data.display_name ? data.display_name.split(',').slice(0, 3).join(', ') : null;
        } catch (error) {
            console.error('Erro ao obter informações da localização:', error);
            return null;
        }
    }

    // Atualizar a interface do usuário com o histórico de localizações
    function updateLocationHistoryUI() {
        // Limpar a lista atual
        locationHistory.innerHTML = '';

        // Se não houver histórico, mostrar mensagem
        if (locationData.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = 'Nenhuma localização registrada ainda';
            locationHistory.appendChild(emptyItem);
            return;
        }

        // Adicionar cada item do histórico à lista
        locationData.forEach((location, index) => {
            const item = document.createElement('li');
            const date = new Date(location.timestamp);
            const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
            
            item.innerHTML = `
                <div class="location-item">
                    <span class="location-name">${location.name}</span>
                    <span class="location-coords">Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}</span>
                    <span class="location-time">${formattedDate}</span>
                </div>
                <button class="view-btn" data-index="${index}">Ver</button>
            `;
            
            locationHistory.appendChild(item);
        });

        // Adicionar eventos aos botões de visualização
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const location = locationData[index];
                updateMap(location.lat, location.lng);
            });
        });
    }

    // Verificar se o usuário permite compartilhar a localização automaticamente ao carregar
    function checkAutoLocate() {
        const autoLocate = localStorage.getItem('mapfindme_autolocate');
        
        if (autoLocate === 'true') {
            requestLocation();
        } else {
            statusMessage.textContent = 'Clique no botão para localizar sua posição atual';
        }
    }

    // Verificar localização automática ao carregar
    checkAutoLocate();
});