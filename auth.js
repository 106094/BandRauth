function handleCredentialResponse(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const email = payload.email.toLowerCase();
  const SHEET_ID='1AQ4cvZ_SjbIkW-ZwJz2QbB_67Sepo4RUUtlkyNGsutE';
  const SHEET_Name='authname'
  // Save to localStorage the moment we know they are allowed
  fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_Name}&range=A:A`)
    .then(r => r.text())
    .then(csv => {
      const allowedEmails = csv.split(',').map(e => e.trim().toLowerCase().replace(/"/g,''));
      
      if (allowedEmails.includes(email)) {
        localStorage.setItem('authorizedUser', JSON.stringify(payload));  // ← remember forever
        showLoggedInScreen(payload);
      } else {
        document.getElementById('blocked').style.display = 'block';
      }
    });
}

// Run this immediately when the page loads
window.addEventListener('load', () => {
  const saved = localStorage.getItem('authorizedUser');
  if (saved) {
    const user = JSON.parse(saved);
    showLoggedInScreen(user);               // ← skip login completely
    return;
  }
  
  // otherwise show the normal Google button
  google.accounts.id.initialize({ ... });
  google.accounts.id.renderButton(...);
});

function showLoggedInScreen(user) {
  document.querySelector('.g_id_signin').style.display = 'none';
  document.getElementById('content').style.display = 'block';
  document.getElementById('name').textContent = user.name || user.email;
}