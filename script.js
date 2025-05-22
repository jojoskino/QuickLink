// Fonction pour afficher la boîte de formulaire et l'overlay
function afficherFormulaire() {
    const formBox = document.getElementById('formBox');  // Sélectionner l'élément de la boîte de formulaire
    const overlay = document.getElementById('overlay');  // Sélectionner l'élément overlay
    formBox.style.display = 'block';  // Afficher la boîte
    overlay.style.display = 'block';  // Afficher l'overlay
}

// Ajouter un gestionnaire d'événement sur le formulaire
document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer la valeur du champ de l'URL
    const url = document.getElementById('urlInput').value.trim();  // Supprime les espaces avant et après l'URL

    // Vérifier si l'URL est valide avec une expression régulière
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;  // Modèle pour les URL valides
    if (!urlPattern.test(url)) {  // Si l'URL ne correspond pas au modèle
        alert("Veuillez entrer une URL valide !");  // Afficher un message d'erreur
        return;  // Sortir de la fonction
    }

    // Ajouter "https://" si manquant
    const completeUrl = url.startsWith('http') ? url : 'https://' + url;  // Ajouter "https://" si absent

    try {
        // Appel API Bitly pour raccourcir l'URL
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',  // Utiliser la méthode POST
            headers: {
                'Authorization': 'Bearer 241e9aff9620e59eae1856c8daed85f4923c61c0',  // Ton token d'accès Bitly ici
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "long_url": completeUrl  // Envoyer l'URL complète
            })
        });

        // Si la réponse n'est pas OK, on jette une erreur
        if (!response.ok) {  // Si la réponse n'est pas "ok"
            throw new Error("Erreur lors du raccourcissement du lien.");  // Lever une erreur
        }

        // Récupérer la réponse JSON et le lien raccourci
        const data = await response.json();  // Convertir la réponse en JSON
        const shortenedLink = data.link;  // Obtenir le lien raccourci

        // Afficher le lien raccourci dans l'input readonly
        const linkElement = document.getElementById('shortenedLink');  // Sélectionner l'élément input
        linkElement.value = shortenedLink;  // Définir la valeur de l'input au lien raccourci

        // Rendre le lien cliquable
        linkElement.onclick = function() {
            window.open(shortenedLink, '_blank');  // Ouvrir le lien raccourci dans un nouvel onglet
        };

        // Afficher la section de partage social après le raccourcissement du lien
        document.getElementById('socialShare').style.display = 'block';  // Afficher la section de partage social

    } catch (error) {
        console.error(error);  // Afficher l'erreur dans la console
        alert("Une erreur s'est produite.");  // Afficher une alerte d'erreur
    }
});

// Vérifier si l'URL a un paramètre ?url= pour redirection
const params = new URLSearchParams(window.location.search);  // Récupérer les paramètres de l'URL
if (params.has('url')) {  // Si un paramètre "url" existe
    const originalUrl = atob(params.get('url'));  // Décoder l'URL de l'original
    window.location.href = originalUrl;  // Redirection vers l'URL d'origine
}

// Copier le texte après le raccourcissement
function copierTexte(){
    const texte = document.getElementById("shortenedLink");  // Sélectionner l'input contenant le lien raccourci
    texte.select();  // Sélectionner le texte dans l'input
    document.execCommand("copy");  // Copier le texte
    alert("Lien copié");  // Alerte indiquant que le lien a été copié
}

// Fonction pour fermer la boîte et l'overlay
document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('formBox').style.display = 'none';  // Masquer la boîte
    document.getElementById('overlay').style.display = 'none';  // Masquer l'overlay
});

// Fonction pour changer de thème (clair/sombre)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');  // Basculer entre le thème clair et sombre
}

// Animation sur le bouton "Raccourcir" pendant le processus
document.getElementById('form').addEventListener('submit', function() {
    const button = document.querySelector('button[type="submit"]');  // Sélectionner le bouton de soumission
    button.innerHTML = 'Chargement...';  // Changer le texte du bouton pendant le chargement
    button.disabled = true;  // Désactiver le bouton pendant le chargement
    setTimeout(function() {
        button.innerHTML = 'Raccourcir';  // Réinitialiser le texte du bouton
        button.disabled = false;  // Réactiver le bouton
    }, 2000);  // Animation de 2 secondes
});
