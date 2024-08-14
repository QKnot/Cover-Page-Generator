function addInputListeners() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updateContent);
    });
}

function updateContent() {
    const fields = [
        'courseTitle', 'courseCode', 'titleName', 'submissionDate',
        'teacherName', 'studentName', 'studentId', 'section', 'session'
    ];
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        document.getElementById(field + 'Text').textContent = value;
    });

    const submissionDate = document.getElementById('submissionDate').value;
    const formattedDate = submissionDate ? formatDate(submissionDate) : '';
    document.getElementById('submissionDateText').textContent = formattedDate;

    const coverType = document.getElementById('coverType').value;
    document.getElementById('coverTypeText').textContent = coverType;

    const teacherDesignation = document.getElementById('teacherDesignation').value;
    document.getElementById('teacherDesignationText').textContent = teacherDesignation;

    const departmentSelect = document.getElementById('department');
    const selectedDepartment = departmentSelect.options[departmentSelect.selectedIndex].text;
    document.querySelector('#departmentText span').textContent = 'Department of ' + selectedDepartment;
  
    const departmentAbbreviations = {
        computer_science: "CSE",
        civil_engineering: "CE",
        electrical_engineering: "EEE",
        architecture: "Arch",
        business_administration: "BBA",
        economics: "Econ",
        bangla: "Bangla",
        english: "English",
        journalism: "JMC"
    };
    const departmentAbbreviation = departmentAbbreviations[departmentSelect.value] || "N/A";
    document.getElementById('departmentAbbreviationText').textContent = departmentAbbreviation;
}

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function fillDemoData() {
    document.querySelectorAll('.demo-input').forEach(input => {
        input.value = input.dataset.demo;
        input.dispatchEvent(new Event('input'));
    });
}

function areAllFieldsFilled() {
    const requiredFields = [
        'courseTitle', 'courseCode', 'coverType', 'titleName', 'submissionDate',
        'teacherName', 'teacherDesignation', 'studentName', 'studentId', 'section', 'session'
    ];

    for (let field of requiredFields) {
        const value = document.getElementById(field).value.trim();
        if (!value) {
            return false;
        }
    }

    const departmentValue = document.getElementById('department').value;
    if (departmentValue === "") {
        return false;
    }

    return true;
}

document.getElementById('fillDemo').addEventListener('click', fillDemoData);

document.getElementById('download').addEventListener('click', () => {
    if (!areAllFieldsFilled()) {
        alert("Please fill in all input fields before downloading the PDF.");
        return;
    }

    const element = document.getElementById('content');
    var coverPageName = document.getElementById('coverpagename').value;
    var sanitizedFileName = coverPageName.replace(/\s+/g, '_');
    if (!element) {
        console.error("Content element not found");
        alert("Error: Content element not found");
        return;
    }
    if (typeof jspdf === 'undefined') {
        console.error("jsPDF library not loaded");
        alert("Error: PDF library not loaded");
        return;
    }
    try {
        const doc = new jspdf.jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        });
        const scale = 2.5;  
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        html2canvas(element, {
            scale: scale,
            logging: false,
            useCORS: true,
            letterRendering: true,  
            allowTaint: true,  
            backgroundColor: null  
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 0.8); 
            doc.addImage(imgData, 'JPEG', 0, 0, width, height);
            doc.save(`${sanitizedFileName}.pdf`);
        }).catch(err => {
            console.error("Error in html2canvas:", err);
            alert("Error creating PDF. Please check console for details.");
        });
    } catch (err) {
        console.error("Error creating PDF:", err);
        alert("Error creating PDF. Please check console for details.");
    }
});

document.querySelectorAll('.demo-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.setAttribute('placeholder', this.dataset.demo);
    });

    input.addEventListener('blur', function() {
        this.setAttribute('placeholder', '');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    addInputListeners();
    updateContent(); 
});





function generateShareableLink() {
    const inputs = document.querySelectorAll('.input-section input, .input-section select');
    const data = {};
    inputs.forEach(input => {
        data[input.id] = input.value;
    });
    const encodedData = encodeURIComponent(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
}


function shareLink() {
    const shareableLink = generateShareableLink();
    
    if (navigator.share) {
        navigator.share({
            title: 'Cover Page Generator Data',
            text: 'Check out my cover page data!',
            url: shareableLink,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        prompt('Copy this link to share:', shareableLink);
    }
}


function loadSharedData() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
        try {
            const data = JSON.parse(decodeURIComponent(sharedData));
            Object.keys(data).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                    element.dispatchEvent(new Event('input'));
                }
            });
        } catch (error) {
            console.error('Error loading shared data:', error);
        }
    }
}


document.getElementById('shareButton').addEventListener('click', shareLink);


document.addEventListener('DOMContentLoaded', () => {
    addInputListeners();
    updateContent();
    loadSharedData(); 
});