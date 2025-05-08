document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
   // Update the form submission handler in the DOMContentLoaded event
const addFaqForm = document.getElementById('addFaqForm');
if (addFaqForm) {
    addFaqForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            group: document.getElementById('faqGroup').value,
            abbr: document.getElementById('faqAbbr').value,
            tag: document.getElementById('faqTag').value,
            q: document.getElementById('faqQuestion').value,
            answer: document.getElementById('faqAnswer').value.split('\n').filter(step => step.trim() !== ''),
            notes: document.getElementById('faqNotes').value,
            requiresPermission: document.getElementById('faqRequiresPermission').checked
        };
        
        const screenshotFiles = document.getElementById('faqScreenshots').files;
        const videoFile = document.getElementById('faqVideo').files[0];
        const subfolder = formData.abbr.replace(/\s+/g, '');
        
        try {
            // Reset uploadedFiles array
            uploadedFiles = [];
            
            // Populate uploadedFiles from selected files
            Array.from(screenshotFiles).forEach((file, index) => {
                uploadedFiles.push({
                    file: file,
                    stepNumber: index + 1,
                    previewElement: null // Will be set in preview creation
                });
            });
            
            // Upload screenshots if any
            if (uploadedFiles.length > 0) {
                formData.screenshots = await uploadFiles(subfolder);
            }
            
            // Upload video if any
            if (videoFile) {
                const videoResults = await uploadFiles([videoFile], subfolder);
                formData.video = videoResults[0];
            }
            
            // Save FAQ data
            const saveResponse = await saveFAQ(formData, 'add');
            
            if (saveResponse && saveResponse.success) {
                alert('FAQ saved successfully!');
                document.getElementById('addFaqForm').reset();
                document.getElementById('previewContainer').innerHTML = '';
                uploadedFiles = [];
                
                if (document.querySelector('.tab-btn[data-tab="edit"]').classList.contains('active')) {
                    loadFAQsForEditing();
                }
            } else {
                throw new Error(saveResponse?.error || 'Failed to save FAQ');
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error: ' + error.message);
        }
    });
}
    // Load FAQs for editing
    if (document.getElementById('faqList')) {
        loadFAQsForEditing();
        
        // Search functionality
        document.getElementById('searchFaqs').addEventListener('input', function() {
            filterFAQs(this.value, document.getElementById('filterGroup').value);
        });
        
        document.getElementById('filterGroup').addEventListener('change', function() {
            filterFAQs(document.getElementById('searchFaqs').value, this.value);
        });
    }
});

async function uploadFiles(files, subfolder) {  // Add files parameter
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subfolder', subfolder);
        formData.append('stepNumber', i + 1); // Use index + 1 as step number
        
        try {
            const response = await fetch('upload.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || `Upload failed for step ${i + 1}`);
            }
            
            results.push({
                stepNumber: i + 1,
                path: data.path
            });
            
        } catch (error) {
            console.error(`Error uploading file for step ${i + 1}:`, error);
            throw error;
        }
    }
    
    return results.map(item => item.path);
}

// Global variable to track uploaded files with their order
let uploadedFiles = [];

// Single uploadFiles function that handles drag-and-drop ordering
async function uploadFiles(subfolder) {
    const results = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
        const fileData = uploadedFiles[i];
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('subfolder', subfolder);
        formData.append('stepNumber', fileData.stepNumber);
        
        try {
            const response = await fetch('../admin/upload.php', {  // Fixed path
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.error || `Upload failed for step ${fileData.stepNumber}`);
            }
            
            results.push({
                stepNumber: fileData.stepNumber,
                path: data.path
            });
            
        } catch (error) {
            console.error(`Error uploading file for step ${fileData.stepNumber}:`, error);
            throw error;
        }
    }
    
    // Sort by step number before returning
    return results.sort((a, b) => a.stepNumber - b.stepNumber).map(item => item.path);
}

// File input change handler with preview and drag-and-drop setup
document.getElementById('faqScreenshots').addEventListener('change', function(e) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    uploadedFiles = [];
    
    Array.from(this.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.draggable = true;
            preview.dataset.index = index;
            
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <div class="step-number">Step ${index + 1}</div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
            
            // Add drag event listeners
            preview.addEventListener('dragstart', handleDragStart);
            preview.addEventListener('dragover', handleDragOver);
            preview.addEventListener('drop', handleDrop);
            preview.addEventListener('dragend', handleDragEnd);
            
            previewContainer.appendChild(preview);
            
            // Store file reference with initial order
            uploadedFiles.push({
                file: file,
                stepNumber: index + 1,
                previewElement: preview
            });
        };
        reader.readAsDataURL(file);
    });
});

// Drag and Drop Handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const fromIndex = e.dataTransfer.getData('text/plain');
    const toIndex = this.dataset.index;
    
    if (fromIndex !== toIndex) {
        // Swap files in our array
        const movedFile = uploadedFiles[fromIndex];
        uploadedFiles.splice(fromIndex, 1);
        uploadedFiles.splice(toIndex, 0, movedFile);
        
        // Update UI and step numbers
        updatePreviewOrder();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.preview-item').forEach(el => {
        el.classList.remove('drag-over');
    });
}

// Update preview order after drag-and-drop
function updatePreviewOrder() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
    
    uploadedFiles.forEach((fileData, index) => {
        // Update step number to reflect new position
        fileData.stepNumber = index + 1;
        fileData.previewElement.dataset.index = index;
        fileData.previewElement.querySelector('.step-number').textContent = `Step ${index + 1}`;
        previewContainer.appendChild(fileData.previewElement);
    });
}

// Handle remove button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        e.preventDefault();
        const index = e.target.dataset.index;
        uploadedFiles.splice(index, 1);
        updatePreviewOrder();
        
        // Update the file input to reflect removed files
        const fileInput = document.getElementById('faqScreenshots');
        const newFileList = new DataTransfer();
        uploadedFiles.forEach(fileData => {
            newFileList.items.add(fileData.file);
        });
        fileInput.files = newFileList.files;
    }
});

// Update the saveFAQ function to properly handle the response
async function saveFAQ(data, action) {
    try {
        const response = await fetch('../admin/manage-faqs.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=${encodeURIComponent(action)}&data=${encodeURIComponent(JSON.stringify(data))}`
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function loadFAQsForEditing() {
    fetch('manage-faqs.php')
        .then(response => response.json())
        .then(faqs => {
            const tbody = document.querySelector('#faqList tbody');
            tbody.innerHTML = '';
            
            faqs.forEach(faq => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${faq.id}</td>
                    <td>${faq.q}</td>
                    <td>${faq.group}</td>
                    <td>
                        <button class="edit-btn" data-id="${faq.id}">Edit</button>
                        <button class="delete-btn" data-id="${faq.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    editFAQ(id, faqs);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this FAQ?')) {
                        const id = this.getAttribute('data-id');
                        deleteFAQ(id);
                    }
                });
            });
        });
}

function editFAQ(id, faqs) {
    const faq = faqs.find(f => f.id == id);
    if (!faq) return;
    
    const editContainer = document.getElementById('editFormContainer');
    editContainer.classList.remove('hidden');
    editContainer.innerHTML = `
        <h2>Edit FAQ #${faq.id}</h2>
        <form id="editFaqForm">
            <input type="hidden" id="editId" value="${faq.id}">
            
            <div class="form-group">
                <label for="editGroup">Group</label>
                <select id="editGroup" required>
                    <option value="Operations" ${faq.group === 'Operations' ? 'selected' : ''}>Operations</option>
                    <option value="System" ${faq.group === 'System' ? 'selected' : ''}>System</option>
                    <option value="Data Entry" ${faq.group === 'Data Entry' ? 'selected' : ''}>Data Entry</option>
                    <option value="Reports" ${faq.group === 'Reports' ? 'selected' : ''}>Reports</option>
                    <option value="Other" ${faq.group === 'Other' ? 'selected' : ''}>Other</option>
                    <option value="RDLC Report" ${faq.group === 'RDLC Report' ? 'selected' : ''}>RDLC Report</option>
                    <option value="EndOfSession" ${faq.group === 'EndOfSession' ? 'selected' : ''}>EndOfSession</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="editAbbr">Abbreviation</label>
                <input type="text" id="editAbbr" value="${faq.abbr || ''}" required>
            </div>
            
            <div class="form-group">
                <label for="editTag">Tag</label>
                <input type="text" id="editTag" value="${faq.tag || ''}">
            </div>
            
            <div class="form-group">
                <label for="editQuestion">Question</label>
                <textarea id="editQuestion" required>${faq.q}</textarea>
            </div>
            
            <div class="form-group">
                <label for="editAnswer">Answer Steps (one per line)</label>
                <textarea id="editAnswer" rows="6" required>${faq.answer.join('\n')}</textarea>
            </div>
            
            <div class="form-group">
                <label for="editNotes">Notes</label>
                <textarea id="editNotes">${faq.notes || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="editRequiresPermission" ${faq.requiresPermission ? 'checked' : ''}>
                    Requires Permission
                </label>
            </div>
            
            <button type="submit">Update FAQ</button>
            <button type="button" id="cancelEdit">Cancel</button>
        </form>
    `;
    
    // Handle form submission
    document.getElementById('editFaqForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            id: document.getElementById('editId').value,
            group: document.getElementById('editGroup').value,
            abbr: document.getElementById('editAbbr').value,
            tag: document.getElementById('editTag').value,
            q: document.getElementById('editQuestion').value,
            answer: document.getElementById('editAnswer').value.split('\n').filter(step => step.trim() !== ''),
            notes: document.getElementById('editNotes').value,
            requiresPermission: document.getElementById('editRequiresPermission').checked
        };
        
        saveFAQ(formData, 'update');
    });
    
    // Handle cancel
    document.getElementById('cancelEdit').addEventListener('click', function() {
        editContainer.classList.add('hidden');
    });
    
    // Scroll to edit form
    editContainer.scrollIntoView({ behavior: 'smooth' });
}

function deleteFAQ(id) {
    fetch('manage-faqs.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=delete&data=${encodeURIComponent(JSON.stringify({ id: parseInt(id) }))}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('FAQ deleted successfully!');
            loadFAQsForEditing();
        } else {
            alert('Error: ' + (data.error || 'Failed to delete FAQ'));
        }
    });
}

function filterFAQs(searchTerm, groupFilter) {
    const rows = document.querySelectorAll('#faqList tbody tr');
    
    rows.forEach(row => {
        const question = row.cells[1].textContent.toLowerCase();
        const group = row.cells[2].textContent;
        const matchesSearch = searchTerm === '' || question.includes(searchTerm.toLowerCase());
        const matchesGroup = groupFilter === '' || group === groupFilter;
        
        if (matchesSearch && matchesGroup) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}