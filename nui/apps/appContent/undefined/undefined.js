document.addEventListener('DOMContentLoaded', () => {
    // Simulación de datos
    const totalRoutes = 125;
    const totalLoads = 200;
    const performance = 85;

    // Actualización del dashboard
    document.getElementById('total-routes').innerText = totalRoutes;
    document.getElementById('total-loads').innerText = totalLoads;
    document.getElementById('performance').innerText = performance + '%';
});
