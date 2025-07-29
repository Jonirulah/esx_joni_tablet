const date = new Date();
const app = new Vue({
    el: '#tablet',
    data: {
        opened: true,
        currentPage: 'main',
        Calendar: {
            day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
            numDay: date.toLocaleDateString('es-ES', { day: 'numeric' }),
            month: date.toLocaleDateString('es-ES', { month: 'long' })
        },
        appList: [],
        pageStates: {}
    },
    mounted() {
        this.loadConfig()
        let initial = document.getElementById(this.currentPage);
        initial.style.opacity = 1;
        console.log("Tablet is loaded")
    },
    methods: {
        // Async Methods
        async loadConfig() {
            try {
                const response = await fetch('../apps/appDefinitions.json');
                const data = await response.json();
                for (let i = 0; i < data.length; i++) {
                    this.appList.push(data[i]);
                    if (this.appList[i].external == false) {
                        this.appList[i].href = `../apps/appContent/${this.appList[i].id}/${this.appList[i].id}.html`;
                    };
                };
            } catch (error) {
                console.error('Error loading config:', error);
            };
        },
        async post(url, data = {}) {
            const response = await fetch(`https://${GetParentResourceName()}/${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        },
        // Check for duplication
        registerApp(appData) {
            let duplicated = false;
            for (let index = 0; index < this.appList.length; index++) {
                const element = this.appList[index];
                if (element.id == appData.data.id) {
                    duplicated = true;
                    return;
                };
            };
            console.log("pushing app", appData.data)
            this.appList.push(appData.data);
        },
        unregisterApp(appData) {
            let found = false;
            for (let index = 0; index < this.appList.length; index++) {
                const element = this.appList[index];
                if (element.id == appData.unregisterApp) {
                    // App found, remove it
                    try {
                        document.getElementById("iframe-" + appData.unregisterApp).remove();
                    } catch {}
                    this.appList.splice(index, 1);
                    delete this.pageStates[appData.unregisterApp];
                    if (this.currentPage === appData.unregisterApp) {
                        this.switchPage('main', true);
                        delete this.pageStates[appData.unregisterApp];
                    };
                    found = true;
                    break;
                };
            };
            if (!found) {
                console.debug("App with id", appData.unregisterApp, "not found.");
            };
        },
        switchPage(page) {
            let found = false
            if (this.currentPage === page) {
                document.getElementById('app').style.display = 'none';
                app.post('close')
                return;
            };
            // Check if the page exists
            for (let i = 0; i < this.appList.length; i++) {
                if (this.appList[i].id == page) {
                    found = true
                };
            };
            playSound('app-open');

            if (!found && page != 'main') {
                console.warn('Tried to open an app that doesnt exist', page)
            };

            // Hides all iframes and saves the
            this.appList.forEach(app => {
                let iframe = document.getElementById(app.id);
                if (iframe) {
                    iframe.style.display = 'none';
                    iframe.style.opacity = '0';
                };
            });
            if (!this.pageStates[this.currentPage]) {
                this.pageStates[this.currentPage] = true;
            };

            if (!this.pageStates[page]) {
                for (let i = 0; i < this.appList.length; i++) {
                    if (this.appList[i].id == page) {
                        OnFirstAppOpen(page, this.appList[i].resourceName);
                        break;
                    };
                };
            };

            window.currentApp = page;

            // Hide current page
            let currentElement = document.getElementById(this.currentPage);
            if (currentElement) {
                currentElement.style.display = 'none';
                currentElement.style.opacity = '0';
            };

            if (page === 'main') {
                this.currentPage = 'main';
                setTimeout(() => {
                    let mainPage = document.getElementById('main');
                    loadUserSettings();
                    if (mainPage) {
                        mainPage.style.display = 'grid';
                        mainPage.style.opacity = '1';
                        window.currentApp = 'main';
                    }
                }, 25);
            } else {
                this.currentPage = page;
                setTimeout(() => {
                    let newPage = document.getElementById(page);
                    isExternal = newPage.getAttribute('external')
                    if (newPage) {
                        newPage.style.display = 'contents';
                        newPage.style.opacity = '1';
                        processQueuedMessages();
                        for (let i = 0; i < this.appList.length; i++) {
                            if (this.appList[i].id == page) {
                                onAppOpen(page, isExternal, this.appList[i].resourceName);
                                break;
                            };
                        };
                    }
                }, 100);
            };
        }
    }
});


window.currentApp = 'main';