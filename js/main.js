document.addEventListener('DOMContentLoaded', function() {
    // Affichage d'une bannière d'aide pour installation iPhone (Safari)
    function isIos() {
        return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    }
    function isInStandaloneMode() {
        return ('standalone' in window.navigator) && window.navigator.standalone;
    }
    if (isIos() && !isInStandaloneMode()) {
        const iosBanner = document.createElement('div');
        iosBanner.style.position = 'fixed';
        iosBanner.style.bottom = '30px';
        iosBanner.style.left = '50%';
        iosBanner.style.transform = 'translateX(-50%)';
        iosBanner.style.zIndex = '9999';
        iosBanner.style.background = '#222';
        iosBanner.style.color = '#fff';
        iosBanner.style.padding = '1.5em 2em';
        iosBanner.style.borderRadius = '12px';
        iosBanner.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
        iosBanner.style.textAlign = 'center';
        iosBanner.style.fontSize = '1.1em';
        iosBanner.innerHTML = `Pour installer l'application sur votre iPhone :<br>1. Touchez <span style="font-size:1.3em">&#x1F5D2;&#xFE0F;</span> ou <span style="font-size:1.3em">&#x2191;</span> en bas de Safari<br>2. Puis "Sur l'écran d'accueil"`;
        const closeIos = document.createElement('button');
        closeIos.textContent = 'OK';
        closeIos.style.marginTop = '1em';
        closeIos.style.padding = '0.5em 1.2em';
        closeIos.style.background = '#4caf50';
        closeIos.style.color = '#fff';
        closeIos.style.border = 'none';
        closeIos.style.borderRadius = '6px';
        closeIos.style.fontSize = '1em';
        closeIos.addEventListener('click', () => iosBanner.remove());
        iosBanner.appendChild(document.createElement('br'));
        iosBanner.appendChild(closeIos);
        document.body.appendChild(iosBanner);
    }
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');

    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        toggle.textContent = menu.classList.contains('active') ? '✕' : '☰';
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Pour "accueil", scroller tout en haut
                if (this.getAttribute('href') === '#accueil') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                menu.classList.remove('active');
                toggle.textContent = '☰';
            }
        });
    });


    // PWA install prompt (Android) toujours affiché
    function isAndroid() {
        return /android/i.test(window.navigator.userAgent);
    }
        function isAndroidMobile() {
            return /android/i.test(window.navigator.userAgent) && /mobile/i.test(window.navigator.userAgent);
        }
    let deferredPrompt;
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '30px';
    popup.style.right = '30px';
    popup.style.zIndex = '9999';
    popup.style.background = '#222';
    popup.style.color = '#fff';
    popup.style.padding = '1.5em 2em';
    popup.style.borderRadius = '12px';
    popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
    popup.style.display = 'none';
    popup.style.textAlign = 'center';
    popup.innerHTML = `Voulez-vous installer l'application ?<br><br>`;
    const btnOui = document.createElement('button');
    btnOui.textContent = 'Oui';
    btnOui.style.margin = '0 1em 0 0';
    btnOui.style.padding = '0.5em 1.2em';
    btnOui.style.background = '#4caf50';
    btnOui.style.color = '#fff';
    btnOui.style.border = 'none';
    btnOui.style.borderRadius = '6px';
    btnOui.style.fontSize = '1em';
    const btnNon = document.createElement('button');
    btnNon.textContent = 'Non';
    btnNon.style.padding = '0.5em 1.2em';
    btnNon.style.background = '#f44336';
    btnNon.style.color = '#fff';
    btnNon.style.border = 'none';
    btnNon.style.borderRadius = '6px';
    btnNon.style.fontSize = '1em';
    popup.appendChild(btnOui);
    popup.appendChild(btnNon);
    document.body.appendChild(popup);

    // Fonction utilitaire pour savoir si l'app est déjà installée (standalone)
    function isStandalone() {
        return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
    }
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (isAndroidMobile() && !isStandalone()) {
            popup.style.display = 'block';
        }
    });

    // Afficher le prompt même si beforeinstallprompt n'est pas déclenché
        if (isAndroidMobile() && !isStandalone()) {
            popup.style.display = 'block';
        }

    btnOui.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                popup.style.display = 'none';
            }
            deferredPrompt = null;
        } else {
            popup.style.display = 'none';
        }
    });
    btnNon.addEventListener('click', () => {
        popup.style.display = 'none';
        deferredPrompt = null;
    });

    // Animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.programme-card, .actu-card, .stat-card, .trombinoscope-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        }
        
        lastScroll = currentScroll;
    });

    // Trombinoscope
    const trombinoscopeData = [
        { 
            photo: 'photos/emilie.jpeg', 
            text: 'Emilie BOISMAL -<strong> Tête de liste pour la liste "Tous Condéens!"</strong> - 45 ans - Assistante familiale.\nYvelinoise depuis toujours, j\'habite à Condé-sur-Vesgre depuis 14 ans. J\'y ai construit ma vie et je suis profondément attachée à mon village et à sa forêt, que je parcours quotidiennement.\nMon engagement professionnel et associatif m\'a appris le sens des responsabilités, de l\'écoute et du collectif. J\'ai rejoint ce projet, convaincue que la politique locale peut se mener autrement : avec de la présence, du dialogue et beaucoup de bon sens.\n« Je crois que Condé possède déjà tout ce dont on a besoin. Mon envie est simple : aider à révéler ces richesses et les mettre en valeur, avec les habitants, pour l\'avenir du village. »'
        },
        { 
            photo: 'photos/luc.jpeg', 
            text: 'Luc RÉGAL - 37 ans - Responsable grands comptes dans une entreprise d\'optimisation de la performance financière.\nInstallé en famille à Condé-sur-Vesgre depuis bientôt 4 ans, je suis convaincu que l\'action politique locale ne doit pas appartenir qu\'à un cercle fermé. Nous sommes tous responsables de l\'avenir de notre commune.\nCe qui me pousse à agir, c\'est la diversité de cette équipe où chacun apporte ses idées et valeurs. Ensemble, nous sommes motivés pour défendre les intérêts de notre village et renforcer l\'attachement de tous à Condé-sur-Vesgre.\nDans mon métier, l\'écoute, l\'endurance et la capacité à construire des relations durables sont des qualités qui font la différence dans un milieu concurrentiel voire hostile. Ces atouts seront également précieux pour notre village.\n« J\'aimerais que chaque Condéen puisse trouver dans notre démarche une oreille attentive, un conseil avisé, une vision rassurante ou la main tendue dont il a besoin. »'
        },
        { 
            photo: 'photos/sandrine.jpeg', 
            text: 'Sandrine DROZDOWSKI - 51 ans - responsable RH à la "Maison des Sages", association spécialisée dans les habitats partagés pour les personnes atteintes de la maladie d\'Alzheimer.\nMaman de deux jeunes adultes et d\'un adolescent de 13 ans, j\'habite à Condé sur Vesgre depuis dix ans maintenant et je participe activement à la vie associative de la commune en tant que secrétaire et coach au club de football du village, ainsi que bénévole au comité des fêtes.\nJ\'ai rejoint une équipe dont la vision est proche de la mienne : avancer ensemble pour les Condéens, dans un esprit de transparence, d\'écoute et de communication, des valeurs qui guident mon engagement au quotidien.\n« Agir plutôt que critiquer et construire ensemble l\'avenir de notre commune. »'
        },
        { 
            photo: 'photos/olivier.jpeg',
            text: 'Olivier DERBESSE - 46 ans - Directeur Informatique au sein d\'une collectivité territoriale. \nEngagé depuis toujours pour le droit commun (ex-président des Représentants des Parents d\'Elèves du Collège de Houdan), j\'ai rejoint une équipe de Condéens motivés, sans étiquette, qui veulent simplement faire vivre notre village.\nMes atouts ? Pas un politique, mais un représentant impartial, à l\'écoute de tous. Mon expérience associative m\'a appris à agir concrètement pour le lien social.\n« La politique vous éloigne ? Nous, on la rapproche. Rejoignez une liste transparente, citoyenne et tournée vers l\'action – pour Condé, par les Condéens.» '
        },
        { 
            photo: 'photos/karine.jpeg', 
            text: 'Karine RAMAGE - 55 ans - Conseil en affaires et gestion et impliquée dans des projets sportifs équestres.\nInstallée à Condé depuis 4 ans. J\' ai choisi ce village pour son calme, sa ruralité et sa nature. Ce cadre est un bien précieux à préserver.\nAprès 25 années dans des secteurs exigeants (centrale d\'achats grande distribution et industrie pharma), j\'ai acquis la culture du service clients/patients et du résultat. Mon parcours a été axé sur la coordination entre les structures décisionnelles et le terrain. \nC est précisément cette vision que je souhaite impulser. Être à l\'écoute des besoins des condéens et s\'assurer que les décisions y répondent avec justesse et efficacité.\nJ\'ai rejoint cette liste car elle place le tissu associatif et solidaire au coeur de son projet, avec une approche pragmatique : chercher des solutions plutôt que d\'imposer des dogmes.\nMon parcours m\'a appris qu\'une bonne idée n\'est rien sans une exécution efficiente. \nMa devise inspirée de la culture équestre : "Calme en avant, droit".'
        },
        { 
            photo: 'photos/jeanpierre.jpeg', 
            text: 'Jean-Pierre DUVAL - 68 ans - Cadre retraité de l\'Education Nationale. Ancien coordonnateur départemental des Yvelines pour la scolarisation des élèves handicapés.\nCondéen depuis 40 ans déjà ! Depuis ce jour de mai 1985 où, mon épouse et moi-même nous sommes littéralement tombés sous le charme de Condé, de son environnement rural et de ses paysages forestiers clairsemés de rhododendrons en fleurs. Mes enfants puis mes petits-enfants y ont grandi heureux.\nDurant toutes ces années j\'ai pu y rencontrer de magnifiques personnes. Avec certaines d\'entre elles, j\'ai co-animé, durant 8 années durant, le Comité des fêtes puis j\'ai participé, à deux reprises, à la gestion de Condé, comme conseiller municipal d\'abord puis comme premier adjoint ensuite. C\'était il y a quelques années …\nRécemment , lors d\'échanges avec des membres du collectif «  Condé c\'est nous tous » j\'ai pu partagé leurs analyses des besoins et des aspirations des Condéens et leur volonté collective d\'œuvrer pour le seul intérêt général. C\'est la raison pour laquelle j\'ai décidé, enthousiaste,  de rejoindre la liste « Tous Condéens ! ».\n« Je mesure la responsabilité qui est la nôtre afin que tous ensemble nous construisions  le Condé préservé et créatif que vous attendez. »'
        },
        { 
            photo: 'photos/emmanuelle.jpeg', 
            text: 'Emmanuelle JEUFFROY - 50 ans - Pilote Sécurité et Environnement dans le monde de l\'Industrie automobile. \nMaman de 2 ados et aidante familiale, j\'ai été Représentante des Parents d\'Elèves sur les écoles du territoire. Mes responsabilités à la fois personnelles et professionnelles m\'ont appris à être à l\'écoute, bienveillante, empathique, à avoir le sens des priorités et gérer les situations d\'urgence. \nCondéenne depuis 3 ans et demi, et auparavant Adainvilloise pendant 12 ans, je rejoins la liste "Tous Condéens !" pour ses valeurs humaines et son esprit collectif qui a pour volonté de construire un avenir transparent et bienveillant pour la commune et où chaque génération trouvera sa place. \n« Envie d\'un engagement local basé sur votre vécu et vos besoins, rejoignez-nous ! Votre parole compte ! »'
        },
        { 
            photo: 'photos/alexandre.jpeg', 
            text: 'Alexandre PONCHON - 34 ans - Géomètre-géomaticien.\nAncien Représentant des Parents d\'Elèves au Conseil d\'Ecole, mon parcours professionnel m\'a amené à travailler au sein de plusieurs collectivités de taille importante. Je me suis engagé auprès de cette liste car je souhaite participer au changement dont a besoin Condé et que cette liste peut amener. \nJ\'apporte ma rigueur, mes qualités d\'analyste ainsi que mon expérience au sein des collectivités.\n« Faites nous confiance pour votre avenir, nous souhaitons la même chose que vous : vivre encore mieux tout en gardant notre cadre de vie. »'
        },
        { 
            photo: 'photos/sandrinemaillard.jpeg', 
            text: 'Sandrine MAILLARD - 48 ans - Assistante commerciale.\nJ\'ai rejoint cette liste parce qu\'elle est sans étiquette, à l\'écoute des habitants et tournée vers l\'action. J\'apprécie particulièrement l\'esprit collectif qui anime cette équipe : des personnes accessibles, sincères et motivées par l\'intérêt général.\nCondéenne depuis plus de 20 ans, j\'ai le sens de la collectivité, je crée facilement du lien avec les autres et j\'aime m\'impliquer dans les projets communs.\n « Une commune qui se construit avec ses habitants, dans l\'écoute et l\'action. »'
        },
        { 
            photo: 'photos/matthieu.jpeg', 
            text: 'Matthieu JOCK - 42 ans - Enseignant en électrotechnique. \nPapa de deux enfants (13ans et 5 ans) et Condéen depuis 12 ans, j\'ai intégré la liste pour participer aux différents projets d\'évolutions de la commune. \nConscient des implications et de l\'investissement que cet engagement nécessite. Je serai honoré de pouvoir mettre à contribution mes compétences techniques. Pouvoir développer des idées qui améliorent Condé-sur-Vesgre est devenu primordial pour tous les citoyens de cette commune. \nRejoindre "Tous condéens" ce collectif engagé et responsable qui se rassemble pour faire bouger les choses est venu comme une évidence. Participer à ce mouvement solidaire est fondamental pour se faire entendre. Un collectif qui se mobilise pour répondre aux questions, projets, besoins de la population condéenne. \n« Concrétiser aujourd\'hui, c\'est à mon sens, agir pour demain. Parce que, Condé, c\'est nous tous ! »'
        },
        { 
            photo: 'photos/laureline.jpeg', 
            text: 'Laureline RIGAUT - 37 ans - Assistante maternelle sur la commune.\nAncienne Représentante des Parents d\'Elèves au Conseil d\'Ecole, j\'estime être généreuse, empathique et à l\'écoute.\nJ\'ai rejoint la liste "Tous Condéens" car cette liste est composée de personnes d\'expérience qui aiment leur village tout comme moi. Elle est née des habitants eux-mêmes et pas d\'une seule personne ; c\'est pour moi la façon la plus juste de vous représenter chers Condéens. Cette liste reste soutenue par son collectif qui représente un vivier de compétences et une vraie  force ! \n« Pour ensoleiller notre village pour toutes les générations, nous aurons besoin de vous ! Un village qui rassemble est un village heureux ! »'
        },
        { 
            photo: 'photos/sebastien.jpeg', 
            text: 'Sébastien DROZDOWSKI - 48 ans - Responsable commercial France dans le secteur de la métallurgie.\nEngagé dans la vie locale, je suis trésorier et coach de l\'AS Vesgre Football, ainsi que bénévole au comité des fêtes. Ces activités ont forgé en moi l\'esprit d\'équipe, de service et de convivialité.\nJ\'ai choisi de rejoindre cette liste car je partage ses valeurs : confiance, dialogue et engagement dans une véritable cohésion.\n« Rassemblons-nous et avançons ensemble pour l\'avenir de notre commune ! »'
        },
        { 
            photo: 'photos/mounia.jpeg', 
            text: 'Mounia BOUDEDJA - 45 ans - Diplômée du secteur social et ancienne dirigeante d\'un club du troisième âge, actuellement en poste de chargé d\'événementiel \nJe suis installée  sur la commune depuis neuf ans. \nBienveillante et dévouée, j\'ai rejoint la liste: « Tous Condéens ! » car cette liste est composée de personnes intègres, fiables, respectant les principes moraux et priorisant  les intérêts de la communauté et des habitants. \nJe souhaite m\'investir pour notre commune et participer à son développement\n« Nos atouts sont les vôtres. Condé sur Vesgre regorge de valeurs inexploitées, développons les ensemble ! »'
        },
        { 
            photo: 'photos/quentin.jpeg', 
            text: 'Quentin E. - 35 ans - Policier en région parisienne depuis 11 ans et spécialisé dans la police de l\'autoroute et du routier depuis deux ans. \nInstallé depuis 4 ans à Condé, où nous avons choisi de fonder notre famille. \nJ\'ai rejoint le collectif puis la liste pour dynamiser le village avec toutes les bonnes âmes qui souhaitent faire bouger les choses et donner un nouveau souffle à un village qui, comme on a tous pu le constater pendant les fêtes, manque de couleurs et de moments de convivialité. \nC\'est une démarche sans étiquette politique car le but c\'est d\'aller tous dans le même sens pour que les habitants soient fiers de leur commune, qu\'ils s\'y sentent bien et en sécurité. \nCe qui me motive ce sont toutes les idées qui viennent du vécu de chacun qui va permettre de mener à bien la mission qui va nous être confiée j\'en suis certain. \nLe travail en équipe est la base de mon métier, le collectif c\'est ce qui permet d\'atteindre un but précis, chaque avis doit être écouté équitablement et de façon impartiale. \n« Tous Condéens !, c\'est une équipe de Condéen(ne)s motivés derrière une tête de liste qui a de l\'expérience au sein des associations locales et qui va œuvrer dans l\'intérêt commun des habitants de notre petite commune tout en conservant le charme du village qui nous a fait choisir Condé comme résidence. »'
        },
        { 
            photo: 'photos/ana.jpeg', 
            text: 'Ana PEREIRA-CRAVO - 57 ans - Responsable régionale dans l\'archivage.\nJ\'ai rejoint ce collectif par conviction,  persuadée que la transparence,  le dialogue,  le partage et l\'écoute sont indispensables à l\'avenir de notre village.\nBien que novice sur une liste électorale,  je crois fermement que nous TOUS pouvons faire la différence,  portés par une motivation collective plutôt que des intérêts individuels. \n«  Ensemble on va plus loin. »'
        },
        { 
            photo: 'photos/oleg.jpeg', 
            text: 'Oleg LODYGENSKY - 57 ans - Ingénieur de recherche en informatique et directeur technique. \nJe suis à Condé depuis 4 ans. Depuis des années, je participe régulièrement à des activités sociales et associatives. \nJ\'aime le partage d\'idées et c\'est à ce titre que je me suis intéressé au collectif "Tous Condéens ! » : j\'y trouve l\'envie de créer et de mettre en oeuvre l\'intelligence collective, la volonté de faire bouger les choses et une moyenne d\'âge inférieure à 50 ans. Tout ça me parait de très bon augure et me pousse à me présenter comme conseiller sur la liste "tous Condéens"'
        }
    ];

    const trombinoscopeGrid = document.getElementById('trombinoscope-grid');
    const modal = document.getElementById('person-modal');
    const modalPhoto = document.getElementById('modal-photo');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.querySelector('.modal-close');

    // Fonction pour extraire le premier paragraphe
    function getFirstParagraph(text) {
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        return paragraphs.length > 0 ? paragraphs[0] : text;
    }

    // Fonction pour formater le texte complet
    function formatFullText(text) {
        const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    // Créer les cartes
    function loadTrombinoscope() {
        trombinoscopeData.forEach((person, index) => {
            const firstParagraph = getFirstParagraph(person.text);

            const card = document.createElement('div');
            card.className = 'trombinoscope-card';
            card.innerHTML = `
                <img src="${person.photo}" alt="">
                <div class="trombinoscope-card-content">
                    <p>${firstParagraph}</p>
                </div>
            `;

            // Ajouter l'événement de clic
            card.addEventListener('click', () => {
                modalPhoto.src = person.photo;
                modalPhoto.alt = '';
                modalText.innerHTML = formatFullText(person.text);
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });

            trombinoscopeGrid.appendChild(card);
            
            // Appliquer l'animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.05}s`;
            observer.observe(card);
        });
    }

    // Fermer la modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Charger le trombinoscope
    loadTrombinoscope();
	
	
	
	// Mentions légales
		const openLegal = document.getElementById("open-legal");
		const legalModal = document.getElementById("legal-modal");
		const closeLegal = document.getElementById("close-legal");

		if (openLegal) {
			openLegal.addEventListener("click", function (e) {
				e.preventDefault();
				legalModal.style.display = "block";
			});
		}

		if (closeLegal) {
			closeLegal.addEventListener("click", function () {
				legalModal.style.display = "none";
			});
		}

		window.addEventListener("click", function (e) {
			if (e.target === legalModal) {
				legalModal.style.display = "none";
			}
		});


    // Script du bouton Retour en haut (déplacé ici avec vérification)
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.pageYOffset > 300);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Script de la météo (déplacé ici avec vérifications)
    const apiKey = "cf59aa5d576b296eca4320b33d269da1";
    const lat = 48.731;
    const lon = 1.615;
    const openMeteoBtn = document.getElementById("open-meteo");
    const meteoModal = document.getElementById("meteo-modal");
    const closeMeteoBtn = document.getElementById("close-meteo");

    if (openMeteoBtn && meteoModal && closeMeteoBtn) {
        // Ouvrir modal
        openMeteoBtn.addEventListener("click", () => {
            meteoModal.style.display = "flex";
        });

        // Fermer modal
        closeMeteoBtn.addEventListener("click", () => {
            meteoModal.style.display = "none";
        });

        // Fermer en cliquant dehors
        meteoModal.addEventListener("click", (e) => {
            if (e.target === meteoModal) {
                meteoModal.style.display = "none";
            }
        });

        // Récupérer météo actuelle
        async function loadCurrentWeather() {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
                );
                const data = await response.json();

                const table = document.getElementById("meteo-current");
                if (table) {
                    table.innerHTML = `
                        <tr>
                            <td class="meteo-label">Température</td>
                            <td class="meteo-value">${Math.round(data.main.temp)} °C</td>
                        </tr>
                        <tr>
                            <td class="meteo-label">Ressenti</td>
                            <td class="meteo-value">${Math.round(data.main.feels_like)} °C</td>
                        </tr>
                        <tr>
                            <td class="meteo-label">Vent</td>
                            <td class="meteo-value">${Math.round(data.wind.speed * 3.6)} km/h</td>
                        </tr>
                        <tr>
                            <td class="meteo-label">Humidité</td>
                            <td class="meteo-value">${data.main.humidity} %</td>
                        </tr>
                    `;
                }
            } catch (error) {
                console.log('Erreur météo actuelle:', error); // Debug ajouté
                const table = document.getElementById("meteo-current");
                if (table) {
                    table.innerHTML = 
                        `<tr><td colspan="2" style="color: #c33; text-align: center;">Erreur de chargement</td></tr>`;
                }
            }
        }

        // Récupérer prévisions
        async function loadForecast() {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
                );
                const data = await response.json();

                const days = {};
                data.list.forEach(item => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!days[date]) {
                        days[date] = {
                            min: item.main.temp_min,
                            max: item.main.temp_max
                        };
                    } else {
                        days[date].min = Math.min(days[date].min, item.main.temp_min);
                        days[date].max = Math.max(days[date].max, item.main.temp_max);
                    }
                });

                const labels = ["Aujourd'hui", "Demain", "Après-demain"];
                const dates = Object.keys(days).slice(0, 3);

                let html = "";
                dates.forEach((date, i) => {
                    html += `
                        <tr>
                            <td class="meteo-label">${labels[i]}</td>
                            <td class="meteo-value">${Math.round(days[date].min)}° / ${Math.round(days[date].max)}°</td>
                        </tr>
                    `;
                });

                const forecastTable = document.getElementById("meteo-forecast");
                if (forecastTable) {
                    forecastTable.innerHTML = html;
                }
            } catch (error) {
                console.log('Erreur prévisions météo:', error); // Debug ajouté
                const forecastTable = document.getElementById("meteo-forecast");
                if (forecastTable) {
                    forecastTable.innerHTML = 
                        `<tr><td colspan="2" style="color: #c33; text-align: center;">Erreur de chargement</td></tr>`;
                }
            }
        }

        // Charger au démarrage
        loadCurrentWeather();
        loadForecast();
    }
});

