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
    
    // Handle add FAQ form
    const addFaqForm = document.getElementById('addFaqForm');
    if (addFaqForm) {
        addFaqForm.addEventListener('submit', function(e) {
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
            
            // Get files and subfolder name
            const screenshotFiles = document.getElementById('faqScreenshots').files;
            const videoFile = document.getElementById('faqVideo').files[0];
            const subfolder = formData.abbr.replace(/\s+/g, '');
            
            // First upload screenshots if any
            const uploadPromises = [];
            
            if (screenshotFiles.length > 0) {
                uploadPromises.push(
                    uploadFiles(screenshotFiles, subfolder).then(screenshots => {
                        formData.screenshots = screenshots.map(file => `../screenshots/${subfolder}/${file.name}`);
                    }).catch(error => {
                        console.error('Screenshot upload failed:', error);
                        throw error;
                    })
                );
            }
            
            // Then upload video if any
            if (videoFile) {
                uploadPromises.push(
                    uploadFiles([videoFile], subfolder).then(videos => {
                        formData.video = `../screenshots/${subfolder}/${videos[0].name}`;
                    }).catch(error => {
                        console.error('Video upload failed:', error);
                        throw error;
                    })
                );
            }
            
            // When all uploads complete, save FAQ
            Promise.all(uploadPromises)
                .then(() => saveFAQ(formData, 'add'))
                .catch(error => {
                    alert('Error uploading files: ' + error.message);
                });
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

function uploadFiles(files, subfolder) {
    const promises = [];
    
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('subfolder', subfolder);
        
        promises.push(
            fetch('upload.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    return { name: data.filename, path: data.path };
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            })
        );
    }
    
    return Promise.all(promises);
}

function saveFAQ(data, action) {
    fetch('manage-faqs.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=${action}&data=${encodeURIComponent(JSON.stringify(data))}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('FAQ saved successfully!');
            document.getElementById('addFaqForm').reset();
            document.getElementById('previewContainer').innerHTML = '';
            
            // Refresh edit list if we're on that tab
            if (document.querySelector('.tab-btn[data-tab="edit"]').classList.contains('active')) {
                loadFAQsForEditing();
            }
        } else {
            alert('Error: ' + (data.error || 'Failed to save FAQ'));
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
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