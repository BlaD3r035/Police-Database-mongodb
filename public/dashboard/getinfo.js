function setLoadingOn() {
    document.getElementById('loading').style.display = 'flex';
}

function setLoadingOff() {
    document.getElementById('loading').style.display = 'none';
}

async function getIdByDoc() {
    setLoadingOn();
    const i_value = document.getElementById('input').value;
    const digitCount = i_value.length;

    if (digitCount === 7) {
        // Case plate
        const response = await fetch(`/v1/plate?plate=${i_value}`);
        if (!response.ok) {
            setLoadingOff();
            return alert('No plate found');
        }
        const userId = await response.json();
        if (userId.length === 0) {
            setLoadingOff();
            return alert('No plate found');
        }
        fetchUserData(userId.owner);
    } else {
        // Case user document
        const response = await fetch(`/v1/user?documentId=${i_value}`);
        if (!response.ok) {
            setLoadingOff();
            return alert('No document found');
        }
        const userId = await response.json();
        if (userId.length === 0) {
            setLoadingOff();
            return alert('No document found');
        }
        fetchUserData(userId.userId);
    }
    
}

async function fetchUserData(userident) {
    const params = new URLSearchParams({
        userId: userident,
        vehicles: true,
        arrestRecord: true,
        tickets: true,
        //add more parameters if you need It!
    });

    try {
        const response = await fetch(`/v1/getUserData?${params}`);
        if (!response.ok) {
            setLoadingOff();
            return alert('Error searching data');
        }

        const data = await response.json();

        const documentData = data.documentData;
        if (documentData) {
            searchPerson = documentData.documentId;
            personInfo = documentData;
            const form = document.getElementById('form-tickets');
            const form2 = document.getElementById('form-arrest');
            form.style.display = 'none';
            form2.style.display = 'none';
            document.getElementById('avatar').src = documentData.avatarUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            document.getElementById('name').innerText = documentData.nombreic || 'N/A';
            document.getElementById('last-name').innerText = documentData.apellido1ic + " "+documentData.apellido2ic || 'N/A';
            document.getElementById('nacionality').innerText = documentData.lugaredenacimiento || 'N/A';
            document.getElementById('height').innerText = documentData.estaturaic || 'N/A';
            document.getElementById('sex').innerText = documentData.sexoic || 'N/A';
            document.getElementById('birthdate').innerText = documentData.fechadenacimiento || 'N/A';
            document.getElementById('age').innerText = documentData.edadic || 'N/A';
            document.getElementById('bg').innerText = documentData.tipodesangre || 'N/A';
            document.getElementById('username').innerText = documentData.username || 'N/A';
            document.getElementById('ndoc').innerText = documentData.documentId || 'N/A';
            document.getElementById('byc').innerText = documentData.byc || '';
        }

        populateTable('table-licence', data.driverLicence, ['status', 'tipo', 'exp', 'restriccion']);
        populateTable('table-vehicles', data.vehicles, ['nombredelvehiculo', 'placa', 'color']);
        populateTable('table-records', data.arrestRecord, ['articulos', 'tiempo', 'agente', 'created_at']);
        populateTable('table-tickets', data.tickets, ['articulos', 'placa', 'valor', 'agente', 'created_at']);
        populateTable('table-warnings', data.warnings, ['observaciones']);
    } catch (error) {
        console.error(error);
        setLoadingOff();
        alert('Error retrieving user data');
    }
}

function populateTable(tableId, dataArray, columns) {
    const table = document.getElementById(tableId);

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    if (!dataArray || dataArray.length === 0) {
        const row = table.insertRow();
        columns.forEach(() => {
            const cell = row.insertCell();
            cell.innerText = "N/A";
        });
        setLoadingOff();
        return;
    }

    dataArray.forEach(data => {
        const row = table.insertRow();
        columns.forEach(column => {
            const cell = row.insertCell();
            cell.innerText = data[column] !== undefined ? data[column] : "N/A";  
        });
    });
    setLoadingOff();
}
