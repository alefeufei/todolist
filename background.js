function updateBackground() {
    const hora = new Date().getHours();
    const body = document.body;
    
    if (hora >= 6 && hora < 12) {
        // Manhã
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3')";
        body.style.backgroundColor = "#f4f4f4";
    } else if (hora >= 12 && hora < 18) {
        // Tarde
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3')";
        body.style.backgroundColor = "#f4f4f4";
    } else {
        // Noite
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1507502707541-f369a3b18502?ixlib=rb-4.0.3')";
        body.style.backgroundColor = "#2c3e50";
    }
}

// Atualiza o fundo quando a página carrega
updateBackground();

// Atualiza o fundo a cada minuto
setInterval(updateBackground, 60000);