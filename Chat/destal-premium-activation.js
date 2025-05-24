// Botão para limpar localStorage para premium
$('#sidebar .sidebar-content').prepend(`
  <div class="sidebar-section">
    <button id="clearPremiumStorage" class="btn btn-warning btn-sm btn-block mb-2">
      Reset Premium (Clear Storage)
    </button>
  </div>
`);

$(document).on('click', '#clearPremiumStorage', function() {
  localStorage.removeItem('destal-premium');
  alert('Premium storage cleared! Reloading...');
  location.reload();
});
