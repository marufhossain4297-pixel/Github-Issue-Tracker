let currentTab = 'all'
const tabActive = ['bg-primary', 'text-white']
const tabInactive = ['bg-transparent', 'text-black', 'hover:bg-gray-200']
let allIssues = [];

const dataContainer = document.getElementById('data-container')
const closeContainer = document.getElementById('close-container')
const opencontainer = document.getElementById('open-container')

const switchTab = (tab) => {
    const tabs = ['all', 'open', 'close']

    for (const t of tabs) {
        const tabNames = document.getElementById('tab-' + t)
        if (t === tab) {
            tabNames.classList.remove(...tabInactive)
            tabNames.classList.add(...tabActive)
        }
        else {
            tabNames.classList.remove(...tabActive)
            tabNames.classList.add(...tabInactive)
        }
    }

    if (tab === 'all') {
        dataContainer.classList.remove('hidden')
        closeContainer.classList.add('hidden')
        opencontainer.classList.add('hidden')
        displayLoadData(allIssues, dataContainer)
    }
    else if (tab === 'open') {
        opencontainer.classList.remove('hidden')
        closeContainer.classList.add('hidden')
        dataContainer.classList.add('hidden')
        const openIssue = allIssues.filter(i => i.status === 'open')
        displayLoadData(openIssue, opencontainer)
    }
    else if (tab === 'close') {
        closeContainer.classList.remove('hidden')
        opencontainer.classList.add('hidden')
        dataContainer.classList.add('hidden')
        const closeIssue = allIssues.filter(i => i.status.toLowerCase().includes('close'))
        displayLoadData(closeIssue, closeContainer)
    }
}
