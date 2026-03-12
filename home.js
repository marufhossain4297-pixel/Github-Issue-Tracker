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

const Search = () => {
    const searchText = document.getElementById('search-input').value;

    if (searchText) {
        manageSpinner(true);
        const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                switchTab('all');
                displayLoadData(data.data, dataContainer);

                if (data.data.length === 0) {
                    dataContainer.innerHTML = `<h1 class="text-2xl text-center col-span-4 mt-10">No issues found for "${searchText}"</h1>`;
                }
            })
    }
};

document.getElementById('search-btn').addEventListener('click', Search);

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        Search();
    }
});

const loadData = () => {
    manageSpinner(true)
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues'
    fetch(url)
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;
            switchTab('all');
        })
}

const displayLoadData = (datas, targetContainer = dataContainer) => {
    targetContainer.innerHTML = ''
    document.getElementById('issue-count').innerText = `${datas.length} Issues`;

    datas.forEach(data => {
        const priority = data.priority.toUpperCase()
        const priorityClass = priority === 'HIGH'
            ? 'bg-[#FECEC6] text-[#EF4444] py-[5px] px-[24px] rounded-[100px]'
            : priority === 'MEDIUM'
                ? 'bg-[#FFF6D1] text-[#F59E0B] py-[5px] px-[24px] rounded-[100px]'
                : 'bg-[#EEEFF2] text-[#9CA3AF] py-[5px] px-[24px] rounded-[100px]';

        const dataCard = document.createElement('div')
        const border = data.status === 'open' ? 'border-t-4 border-[#00A96E]' : 'border-t-4 border-[#8b5cf6]';

        dataCard.innerHTML = `
            <div class="bg-white ${border} p-4 rounded-xl shadow-sm h-[284px] cursor-pointer" onclick="loadModal(${data.id})">
                <div class="flex justify-between mb-3">
                    <p>${data.status === "open" ? '<img src="./images/Open-Status.png" alt="">' : '<img src="./images/Closed- Status .png" alt="">'}</p>
                    <p class="text-[12px] font-medium items-center ${priorityClass}">${priority}</p>
                </div>
                <div class="mb-3">
                    <h2 class="mb-2 text-[16px] font-semibold">${data.title} </h2>
                    <p class="text-[13px] text-[#64748B]">${data.description.slice(0, 59)}... </p>
                </div>
                <div class="border-b border-gray-200 pb-4">
                    <button class="flex gap-3.5 flex-wrap">${createElements(data.labels)}</button>
                </div>
                <div class="p-4 text-[12px] text-[#64748B] flex justify-between">
                    <div><p>#${data.id} <span class="font-bold">${data.author}</span> </p></div>
                    <div><p>${formatDate(data.createdAt)}</p></div>
                </div>
            </div>
        `
        targetContainer.append(dataCard)
    });
    manageSpinner(false)
}

const createElements = (arr) => {
    return arr.map((el) => {
        const lavcol = el === 'bug' ? 'text-[#EF4444] bg-[#FEECEC] border' : el === 'help wanted' ? 'text-[#FF6900] bg-[#FFF8DB] border' : el === 'enhancement' ? 'text-[#00A96E] bg-[#DEFCE8] border' : el === 'documentation' ? 'text-[#226BF0] bg-[#E9F0FE] border' : 'text-[#702459] bg-[#FDF2F8] border'
        let content = el.toUpperCase();
        if (el === 'bug') content = '<i class="fa-solid fa-bug"></i> BUG';
        else if (el === 'enhancement') content = '<i class="fa-solid fa-wand-magic-sparkles"></i> ENHANCEMENT';

        return `<span class="text-[9.8px] font-semibold rounded-[100px] px-2 py-1 ${lavcol}">${content}</span>`;
    }).join(" ");
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US');
};

const manageSpinner = (status) => {
    const spinner = document.getElementById('spinner');
    if (status) {
        spinner.classList.remove('hidden');
        dataContainer.classList.add('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

const loadModal = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(json => displayModal(json.data))
}

const displayModal = (card) => {
    const priority = card.priority.toUpperCase();
    const priorityClass = priority === 'HIGH' ? 'bg-[#EF4444] text-white' : priority === 'MEDIUM' ? 'bg-[#F59E0B] text-white' : 'bg-[#946179] text-white';
    const bg = card.status === 'open' ? 'bg-[#00A96E] text-white' : 'bg-[#A755F7] text-white';

    document.getElementById('details-card').innerHTML = `
        <div class="p-2">
            <h2 class="text-[24px] font-bold mb-2">${card.title}</h2>
            <div class="flex items-center gap-2.5 mb-4">
                <p class="${bg} text-[12px] font-medium rounded-full px-2 py-1">${card.status.toUpperCase()}</p>
                <p class="text-[14px] text-[#64748B]">Opened by <b>${card.author}</b></p>
                <p class="text-[14px] text-[#64748B]">${formatDate(card.updatedAt)}</p>
            </div>
            <div class="my-3 flex gap-2">${createElements(card.labels)}</div>
            <p class="mb-6 text-[#64748B]">${card.description}</p>
            <div class="flex bg-[#F8FAFC] py-4 px-4 rounded-2xl">
                <div class="w-1/2">
                    <p class="text-[#64748B]">Assignee:</p>
                    <h3 class="font-medium">${card.assignee || 'Unassigned'}</h3>
                </div>
                <div>
                    <p class="text-[#64748B]">Priority:</p>
                    <h3 class="${priorityClass} px-6 py-1 rounded-full">${priority}</h3>
                </div>
            </div>
        </div>
    `;
    document.getElementById('card_modal').showModal();
}

document.getElementById('logout').addEventListener('click', () => window.location.replace('./index.html'));

loadData();

