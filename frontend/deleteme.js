const API_URL = 'http://127.0.0.1:8000';
const itemsContainer = document.getElementById('itemsContainer');

// Initialize Bootstrap modal
const editModalElement = document.getElementById('editModal');
const editModal = new bootstrap.Modal(editModalElement);
const editForm = document.getElementById('editForm');

// Initialize Bootstrap toast
const toastElement = document.getElementById('successToast');
const toast = new bootstrap.Toast(toastElement);

// Load and display items
async function loadItems() {
  try {
    const response = await fetch(`${API_URL}/items/`);
    const items = await response.json();
    
    itemsContainer.innerHTML = items.map(item => `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text mb-1">
              <strong>Price:</strong> 
              <span class="text-success">$${item.price}</span>
            </p>
            <p class="card-text">
              <strong>Offered:</strong> 
              <span class="badge ${item.is_offered ? 'bg-success' : 'bg-danger'}">
                ${item.is_offered ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          <div>
            <button 
              class="btn btn-primary btn-sm me-2 edit-btn" 
              data-id="${item.id}"
            >
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button 
              class="btn btn-danger btn-sm delete-btn" 
              data-id="${item.id}"
            >
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading items:', error);
    itemsContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load items. Please try again.
      </div>
    `;
  }
}

// Open edit modal with item data
async function openEditModal(itemId) {
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`);
    const item = await response.json();
    
    // Populate form fields
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editName').value = item.name;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editIsOffered').checked = item.is_offered || false;
    
    // Show modal using Bootstrap's JS API
    editModal.show();
  } catch (error) {
    console.error('Error loading item:', error);
    showNotification('Failed to load item data', 'danger');
  }
}

// Handle form submission (PATCH request)
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const itemId = document.getElementById('editItemId').value;
  const submitButton = e.submitter;
  const originalText = submitButton.innerHTML;
  
  // Show loading state
  submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
  submitButton.disabled = true;
  
  // Get form data
  const formData = {
    name: document.getElementById('editName').value,
    price: parseFloat(document.getElementById('editPrice').value),
    is_offered: document.getElementById('editIsOffered').checked
  };
  
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      editModal.hide();
      await loadItems();
      showNotification('Item updated successfully!', 'success');
    } else {
      const error = await response.json();
      showNotification(`Error: ${error.detail}`, 'danger');
    }
  } catch (error) {
    console.error('Error updating item:', error);
    showNotification('Failed to update item', 'danger');
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
});

// Handle delete
async function deleteItem(itemId) {
  // Use Bootstrap's modal for confirmation (optional)
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      await loadItems();
      showNotification('Item deleted successfully!', 'success');
    } else {
      showNotification('Failed to delete item', 'danger');
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    showNotification('Failed to delete item', 'danger');
  }
}

// Show notification using Bootstrap Toast
function showNotification(message, type = 'success') {
  const toastBody = document.getElementById('toastMessage');
  const toastElement = document.getElementById('successToast');
  
  // Change toast color based on type
  toastElement.className = `toast align-items-center text-bg-${type} border-0`;
  toastBody.textContent = message;
  
  toast.show();
}

// Event delegation for edit and delete buttons
itemsContainer.addEventListener('click', (e) => {
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  
  if (editBtn) {
    const itemId = editBtn.dataset.id;
    openEditModal(itemId);
  }
  
  if (deleteBtn) {
    const itemId = deleteBtn.dataset.id;
    deleteItem(itemId);
  }
});

// Load items on page load
loadItems();