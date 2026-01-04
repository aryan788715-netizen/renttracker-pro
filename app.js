<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// RentTracker Pro - Enterprise Property Management System
// Version 2.0 - Complete Rewrite with Advanced Features

// ==================== DATABASE LAYER ====================
const DB = {
    // Core operations with error handling
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return [];
        }
    },
    
    set: (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            return true;
        } catch (e) {
            console.error(`Error writing ${key}:`, e);
            return false;
        }
    },
    
    getObj: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
            console.error(`Error reading object ${key}:`, e);
            return {};
        }
    },
    
    setObj: (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            return true;
        } catch (e) {
            console.error(`Error writing object ${key}:`, e);
            return false;
        }
    },
    
    // Initialize with demo data
    init: () => {
        // Properties
        if (DB.get('properties').length === 0) {
            DB.set('properties', [
                {
                    id: '1',
                    name: 'Sunset Apartments 101',
                    type: 'apartment',
                    address: '123 Main Street, Mumbai, Maharashtra 400001',
                    rent: 25000,
                    bedrooms: 2,
                    bathrooms: 2,
                    squareFeet: 1200,
                    status: 'occupied',
                    description: 'Modern 2BHK apartment with city view',
                    createdAt: new Date('2024-01-15').toISOString()
                },
                {
                    id: '2',
                    name: 'Green Valley House',
                    type: 'house',
                    address: '456 Park Avenue, Delhi, Delhi 110001',
                    rent: 45000,
                    bedrooms: 3,
                    bathrooms: 3,
                    squareFeet: 2000,
                    status: 'occupied',
                    description: 'Spacious 3BHK house with garden',
                    createdAt: new Date('2024-02-01').toISOString()
                },
                {
                    id: '3',
                    name: 'Downtown Condo 205',
                    type: 'condo',
                    address: '789 Business District, Bangalore, Karnataka 560001',
                    rent: 35000,
                    bedrooms: 2,
                    bathrooms: 2,
                    squareFeet: 1500,
                    status: 'vacant',
                    description: 'Premium condo in business district',
                    createdAt: new Date('2024-03-10').toISOString()
                }
            ]);
        }

        // Tenants
        if (DB.get('tenants').length === 0) {
            DB.set('tenants', [
                {
                    id: '1',
                    name: 'Rajesh Kumar',
                    email: 'rajesh.kumar@email.com',
                    phone: '+91 98765 43210',
                    propertyId: '1',
                    leaseStart: '2024-01-01',
                    leaseEnd: '2024-12-31',
                    deposit: 50000,
                    status: 'active',
                    createdAt: new Date('2024-01-01').toISOString()
                },
                {
                    id: '2',
                    name: 'Priya Sharma',
                    email: 'priya.sharma@email.com',
                    phone: '+91 98765 43211',
                    propertyId: '2',
                    leaseStart: '2024-02-01',
                    leaseEnd: '2025-01-31',
                    deposit: 90000,
                    status: 'active',
                    createdAt: new Date('2024-02-01').toISOString()
                }
            ]);
        }

        // Payments
        if (DB.get('payments').length === 0) {
            const payments = [];
            const tenants = DB.get('tenants');
            const properties = DB.get('properties');
            
            // Generate payment history for last 3 months
            for (let i = 0; i < 3; i++) {
                tenants.forEach(tenant => {
                    const property = properties.find(p => p.id === tenant.propertyId);
                    if (property) {
                        const date = new Date();
                        date.setMonth(date.getMonth() - i);
                        payments.push({
                            id: Date.now().toString() + Math.random(),
                            tenantId: tenant.id,
                            propertyId: property.id,
                            amount: property.rent,
                            date: date.toISOString().split('T')[0],
                            method: i === 0 ? 'upi' : 'bank-transfer',
                            status: i === 0 ? 'pending' : 'paid',
                            notes: `Rent for ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
                            createdAt: date.toISOString()
                        });
                    }
                });
            }
            DB.set('payments', payments);
        }

        // Maintenance
        if (DB.get('maintenance').length === 0) {
            DB.set('maintenance', [
                {
                    id: '1',
                    propertyId: '1',
                    title: 'Leaking Faucet',
                    description: 'Kitchen faucet is leaking and needs repair',
                    priority: 'medium',
                    status: 'in-progress',
                    cost: 2000,
                    createdAt: new Date('2024-11-20').toISOString()
                },
                {
                    id: '2',
                    propertyId: '2',
                    title: 'AC Not Working',
                    description: 'Air conditioner in master bedroom not cooling',
                    priority: 'high',
                    status: 'pending',
                    cost: 5000,
                    createdAt: new Date('2024-12-01').toISOString()
                }
            ]);
        }

        // Settings
        if (!localStorage.getItem('settings')) {
            DB.setObj('settings', {
                currency: '₹',
                dateFormat: 'DD/MM/YYYY',
                notifications: true,
                autoBackup: true
            });
        }
    },
    
    // Backup and restore
    backup: () => {
        const data = {
            properties: DB.get('properties'),
            tenants: DB.get('tenants'),
            payments: DB.get('payments'),
            maintenance: DB.get('maintenance'),
            settings: DB.getObj('settings'),
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(data);
    },
    
    restore: (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            DB.set('properties', data.properties || []);
            DB.set('tenants', data.tenants || []);
            DB.set('payments', data.payments || []);
            DB.set('maintenance', data.maintenance || []);
            DB.setObj('settings', data.settings || {});
            return true;
        } catch (e) {
            console.error('Restore failed:', e);
            return false;
        }
    }
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    // Format currency
    formatCurrency: (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    },
    
    // Format date
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },
    
    // Calculate days between dates
    daysBetween: (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = Math.abs(d2 - d1);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    
    // Generate unique ID
    generateId: () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },
    
    // Show notification
    showNotification: (message, type = 'success') => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '10000';
        alert.style.minWidth = '300px';
        alert.innerHTML = `
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    },
    
    // Export to CSV
    exportToCSV: (data, filename) => {
        if (data.length === 0) {
            Utils.showNotification('No data to export', 'error');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        Utils.showNotification('Data exported successfully!', 'success');
    },
    
    // Search function
    search: (data, query, fields) => {
        if (!query) return data;
        query = query.toLowerCase();
        return data.filter(item => 
            fields.some(field => 
                String(item[field]).toLowerCase().includes(query)
            )
        );
    }
};

// ==================== DASHBOARD FUNCTIONS ====================
const Dashboard = {
    load: () => {
        const properties = DB.get('properties');
        const tenants = DB.get('tenants');
        const payments = DB.get('payments');
        const maintenance = DB.get('maintenance');
        
        // Calculate stats
        const totalProperties = properties.length;
        const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
        const vacantProperties = properties.filter(p => p.status === 'vacant').length;
        const totalTenants = tenants.filter(t => t.status === 'active').length;
        
        const thisMonthPayments = payments.filter(p => {
            const paymentDate = new Date(p.date);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear();
        });
        
        const monthlyRevenue = thisMonthPayments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        
        const pendingPayments = payments.filter(p => p.status === 'pending').length;
        const pendingMaintenance = maintenance.filter(m => m.status !== 'completed').length;
        
        // Occupancy rate
        const occupancyRate = totalProperties > 0 
            ? ((occupiedProperties / totalProperties) * 100).toFixed(1) 
            : 0;
        
        // Render stats
        document.getElementById('dashboardStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Total Properties</div>
                        <div class="stat-value">${totalProperties}</div>
                        <div class="stat-change positive">
                            <span>↑</span>
                            <span>${occupiedProperties} Occupied</span>
                        </div>
                    </div>
                    <div class="stat-icon blue">🏠</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Active Tenants</div>
                        <div class="stat-value">${totalTenants}</div>
                        <div class="stat-change positive">
                            <span>↑</span>
                            <span>${occupancyRate}% Occupancy</span>
                        </div>
                    </div>
                    <div class="stat-icon green">👥</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Monthly Revenue</div>
                        <div class="stat-value">${Utils.formatCurrency(monthlyRevenue)}</div>
                        <div class="stat-change ${pendingPayments > 0 ? 'negative' : 'positive'}">
                            <span>${pendingPayments > 0 ? '⚠️' : '✓'}</span>
                            <span>${pendingPayments} Pending</span>
                        </div>
                    </div>
                    <div class="stat-icon purple">💰</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-label">Maintenance</div>
                        <div class="stat-value">${pendingMaintenance}</div>
                        <div class="stat-change ${pendingMaintenance > 0 ? 'negative' : 'positive'}">
                            <span>${pendingMaintenance > 0 ? '⚠️' : '✓'}</span>
                            <span>${pendingMaintenance > 0 ? 'Needs Attention' : 'All Clear'}</span>
                        </div>
                    </div>
                    <div class="stat-icon orange">🔧</div>
                </div>
            </div>
        `;
        
        // Recent activity
        Dashboard.renderRecentActivity();
        Dashboard.renderUpcomingPayments();
        
        // Update counts
        document.getElementById('propertiesCount').textContent = totalProperties;
        document.getElementById('tenantsCount').textContent = totalTenants;
        document.getElementById('maintenanceCount').textContent = pendingMaintenance;
        document.getElementById('notificationCount').textContent = pendingPayments + pendingMaintenance;
    },
    
    renderRecentActivity: () => {
        const payments = DB.get('payments').slice(-5).reverse();
        const maintenance = DB.get('maintenance').slice(-5).reverse();
        const tenants = DB.get('tenants');
        const properties = DB.get('properties');
        
        const activities = [
            ...payments.map(p => ({
                type: 'payment',
                date: p.createdAt,
                tenant: tenants.find(t => t.id === p.tenantId),
                property: properties.find(pr => pr.id === p.propertyId),
                data: p
            })),
            ...maintenance.map(m => ({
                type: 'maintenance',
                date: m.createdAt,
                property: properties.find(p => p.id === m.propertyId),
                data: m
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        if (activities.length === 0) {
            document.getElementById('recentActivity').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <div class="empty-title">No Recent Activity</div>
                </div>
            `;
            return;
        }
        
        document.getElementById('recentActivity').innerHTML = activities.map(a => `
            <div class="alert alert-info" style="margin-bottom: 10px;">
                <span>${a.type === 'payment' ? '💰' : '🔧'}</span>
                <div>
                    <strong>${a.type === 'payment' ? 'Payment' : 'Maintenance'}</strong><br>
                    ${a.type === 'payment' 
                        ? `${a.tenant?.name} - ${a.property?.name} - ${Utils.formatCurrency(a.data.amount)}`
                        : `${a.property?.name} - ${a.data.title}`
                    }<br>
                    <small style="color: var(--gray);">${Utils.formatDate(a.date)}</small>
                </div>
            </div>
        `).join('');
    },
    
    renderUpcomingPayments: () => {
        const payments = DB.get('payments')
            .filter(p => p.status === 'pending')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const tenants = DB.get('tenants');
        const properties = DB.get('properties');
        
        if (payments.length === 0) {
            document.getElementById('upcomingPayments').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">✅</div>
                    <div class="empty-title">All Payments Up to Date</div>
                </div>
            `;
            return;
        }
        
        document.getElementById('upcomingPayments').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${payments.map(p => {
                        const tenant = tenants.find(t => t.id === p.tenantId);
                        const property = properties.find(pr => pr.id === p.propertyId);
                        const daysUntil = Utils.daysBetween(new Date(), new Date(p.date));
                        const isOverdue = new Date(p.date) < new Date();
                        
                        return `
                            <tr>
                                <td><strong>${tenant?.name || 'Unknown'}</strong></td>
                                <td>${property?.name || 'Unknown'}</td>
                                <td><strong>${Utils.formatCurrency(p.amount)}</strong></td>
                                <td>${Utils.formatDate(p.date)}</td>
                                <td>
                                    <span class="badge ${isOverdue ? 'badge-danger' : 'badge-warning'}">
                                        ${isOverdue ? 'OVERDUE' : `${daysUntil} days`}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
};

// ==================== PROPERTIES FUNCTIONS ====================
const Properties = {
    render: () => {
        const properties = DB.get('properties');
        const tenants = DB.get('tenants');
        
        if (properties.length === 0) {
            document.getElementById('propertiesTable').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🏠</div>
                    <div class="empty-title">No Properties</div>
                    <p>Add your first property to get started</p>
                </div>
            `;
            return;
        }
        
        document.getElementById('propertiesTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Rent</th>
                        <th>Beds/Baths</th>
                        <th>Status</th>
                        <th>Tenant</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${properties.map(p => {
                        const tenant = tenants.find(t => t.propertyId === p.id && t.status === 'active');
                        return `
                            <tr>
                                <td><strong>${p.name}</strong></td>
                                <td><span class="badge badge-info">${p.type.toUpperCase()}</span></td>
                                <td>${p.address}</td>
                                <td><strong>${Utils.formatCurrency(p.rent)}</strong></td>
                                <td>${p.bedrooms || 0} / ${p.bathrooms || 0}</td>
                                <td>
                                    <span class="badge ${
                                        p.status === 'occupied' ? 'badge-success' : 
                                        p.status === 'vacant' ? 'badge-warning' : 
                                        'badge-danger'
                                    }">
                                        ${p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>${tenant ? tenant.name : '-'}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="Properties.edit('${p.id}')">Edit</button>
                                    <button class="btn btn-sm btn-danger" onclick="Properties.delete('${p.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    edit: (id) => {
        const properties = DB.get('properties');
        const property = properties.find(p => p.id === id);
        
        if (!property) return;
        
        document.getElementById('propertyModalTitle').textContent = 'Edit Property';
        document.getElementById('propertyId').value = property.id;
        document.getElementById('propertyName').value = property.name;
        document.getElementById('propertyType').value = property.type;
        document.getElementById('propertyAddress').value = property.address;
        document.getElementById('propertyRent').value = property.rent;
        document.getElementById('propertyBedrooms').value = property.bedrooms || '';
        document.getElementById('propertyBathrooms').value = property.bathrooms || '';
        document.getElementById('propertySquareFeet').value = property.squareFeet || '';
        document.getElementById('propertyStatus').value = property.status;
        document.getElementById('propertyDescription').value = property.description || '';
        
        document.getElementById('propertyModal').classList.add('active');
    },
    
    delete: (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        
        const properties = DB.get('properties').filter(p => p.id !== id);
        DB.set('properties', properties);
        
        Utils.showNotification('Property deleted successfully!', 'success');
        Properties.render();
        Dashboard.load();
    }
};

// ==================== TENANTS FUNCTIONS ====================
const Tenants = {
    render: () => {
        const tenants = DB.get('tenants');
        const properties = DB.get('properties');
        
        if (tenants.length === 0) {
            document.getElementById('tenantsTable').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <div class="empty-title">No Tenants</div>
                    <p>Add your first tenant to get started</p>
                </div>
            `;
            return;
        }
        
        document.getElementById('tenantsTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Property</th>
                        <th>Lease Period</th>
                        <th>Deposit</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tenants.map(t => {
                        const property = properties.find(p => p.id === t.propertyId);
                        return `
                            <tr>
                                <td><strong>${t.name}</strong></td>
                                <td>${t.email}</td>
                                <td>${t.phone}</td>
                                <td>${property?.name || 'Unknown'}</td>
                                <td>${Utils.formatDate(t.leaseStart)} - ${Utils.formatDate(t.leaseEnd)}</td>
                                <td><strong>${Utils.formatCurrency(t.deposit || 0)}</strong></td>
                                <td>
                                    <span class="badge ${t.status === 'active' ? 'badge-success' : 'badge-danger'}">
                                        ${t.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-primary" onclick="Tenants.edit('${t.id}')">Edit</button>
                                    <button class="btn btn-sm btn-danger" onclick="Tenants.delete('${t.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    edit: (id) => {
        const tenants = DB.get('tenants');
        const tenant = tenants.find(t => t.id === id);
        
        if (!tenant) return;
        
        document.getElementById('tenantModalTitle').textContent = 'Edit Tenant';
        document.getElementById('tenantId').value = tenant.id;
        document.getElementById('tenantName').value = tenant.name;
        document.getElementById('tenantEmail').value = tenant.email;
        document.getElementById('tenantPhone').value = tenant.phone;
        document.getElementById('tenantProperty').value = tenant.propertyId;
        document.getElementById('tenantLeaseStart').value = tenant.leaseStart;
        document.getElementById('tenantLeaseEnd').value = tenant.leaseEnd;
        document.getElementById('tenantDeposit').value = tenant.deposit || '';
        document.getElementById('tenantStatus').value = tenant.status;
        
        document.getElementById('tenantModal').classList.add('active');
    },
    
    delete: (id) => {
        if (!confirm('Are you sure you want to delete this tenant?')) return;
        
        const tenants = DB.get('tenants').filter(t => t.id !== id);
        DB.set('tenants', tenants);
        
        Utils.showNotification('Tenant deleted successfully!', 'success');
        Tenants.render();
        Dashboard.load();
    },
    
    loadPropertyOptions: () => {
        const properties = DB.get('properties');
        const select = document.getElementById('tenantProperty');
        
        select.innerHTML = '<option value="">Select Property</option>' + 
            properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
};

// ==================== PAYMENTS FUNCTIONS ====================
const Payments = {
    render: () => {
        const payments = DB.get('payments');
        const tenants = DB.get('tenants');
        const properties = DB.get('properties');
        
        if (payments.length === 0) {
            document.getElementById('paymentsTable').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💰</div>
                    <div class="empty-title">No Payments</div>
                    <p>Record your first payment to get started</p>
                </div>
            `;
            return;
        }
        
        document.getElementById('paymentsTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => {
                        const tenant = tenants.find(t => t.id === p.tenantId);
                        const property = properties.find(pr => pr.id === p.propertyId);
                        
                        return `
                            <tr>
                                <td>${Utils.formatDate(p.date)}</td>
                                <td><strong>${tenant?.name || 'Unknown'}</strong></td>
                                <td>${property?.name || 'Unknown'}</td>
                                <td><strong>${Utils.formatCurrency(p.amount)}</strong></td>
                                <td><span class="badge badge-info">${p.method.toUpperCase()}</span></td>
                                <td>
                                    <span class="badge ${
                                        p.status === 'paid' ? 'badge-success' : 
                                        p.status === 'pending' ? 'badge-warning' : 
                                        'badge-danger'
                                    }">
                                        ${p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-danger" onclick="Payments.delete('${p.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    delete: (id) => {
        if (!confirm('Are you sure you want to delete this payment?')) return;
        
        const payments = DB.get('payments').filter(p => p.id !== id);
        DB.set('payments', payments);
        
        Utils.showNotification('Payment deleted successfully!', 'success');
        Payments.render();
        Dashboard.load();
    },
    
    loadTenantOptions: () => {
        const tenants = DB.get('tenants').filter(t => t.status === 'active');
        const select = document.getElementById('paymentTenant');
        
        select.innerHTML = '<option value="">Select Tenant</option>' + 
            tenants.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    }
};

// ==================== MAINTENANCE FUNCTIONS ====================
const Maintenance = {
    render: () => {
        const maintenance = DB.get('maintenance');
        const properties = DB.get('properties');
        
        if (maintenance.length === 0) {
            document.getElementById('maintenanceTable').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔧</div>
                    <div class="empty-title">No Maintenance Requests</div>
                    <p>Create your first maintenance request</p>
                </div>
            `;
            return;
        }
        
        document.getElementById('maintenanceTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Cost</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${maintenance.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(m => {
                        const property = properties.find(p => p.id === m.propertyId);
                        
                        return `
                            <tr>
                                <td><strong>${property?.name || 'Unknown'}</strong></td>
                                <td>${m.title}</td>
                                <td>
                                    <span class="badge ${
                                        m.priority === 'high' ? 'badge-danger' : 
                                        m.priority === 'medium' ? 'badge-warning' : 
                                        'badge-info'
                                    }">
                                        ${m.priority.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge ${
                                        m.status === 'completed' ? 'badge-success' : 
                                        m.status === 'in-progress' ? 'badge-warning' : 
                                        'badge-info'
                                    }">
                                        ${m.status.toUpperCase()}
                                    </span>
                                </td>
                                <td><strong>${Utils.formatCurrency(m.cost || 0)}</strong></td>
                                <td>${Utils.formatDate(m.createdAt)}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger" onclick="Maintenance.delete('${m.id}')">Delete</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    delete: (id) => {
        if (!confirm('Are you sure you want to delete this maintenance request?')) return;
        
        const maintenance = DB.get('maintenance').filter(m => m.id !== id);
        DB.set('maintenance', maintenance);
        
        Utils.showNotification('Maintenance request deleted successfully!', 'success');
        Maintenance.render();
        Dashboard.load();
    },
    
    loadPropertyOptions: () => {
        const properties = DB.get('properties');
        const select = document.getElementById('maintenanceProperty');
        
        select.innerHTML = '<option value="">Select Property</option>' + 
            properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
};

// ==================== MODAL FUNCTIONS ====================
function openPropertyModal() {
    document.getElementById('propertyModalTitle').textContent = 'Add Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('propertyId').value = '';
    document.getElementById('propertyModal').classList.add('active');
}

function closePropertyModal() {
    document.getElementById('propertyModal').classList.remove('active');
}

function openTenantModal() {
    document.getElementById('tenantModalTitle').textContent = 'Add Tenant';
    document.getElementById('tenantForm').reset();
    document.getElementById('tenantId').value = '';
    Tenants.loadPropertyOptions();
    document.getElementById('tenantModal').classList.add('active');
}

function closeTenantModal() {
    document.getElementById('tenantModal').classList.remove('active');
}

function openPaymentModal() {
    document.getElementById('paymentForm').reset();
    Payments.loadTenantOptions();
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function openMaintenanceModal() {
    document.getElementById('maintenanceForm').reset();
    Maintenance.loadPropertyOptions();
    document.getElementById('maintenanceModal').classList.add('active');
}

function closeMaintenanceModal() {
    document.getElementById('maintenanceModal').classList.remove('active');
}

// ==================== FORM HANDLERS ====================
document.getElementById('propertyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const properties = DB.get('properties');
    const id = document.getElementById('propertyId').value;
    
    const propertyData = {
        id: id || Utils.generateId(),
        name: document.getElementById('propertyName').value,
        type: document.getElementById('propertyType').value,
        address: document.getElementById('propertyAddress').value,
        rent: parseInt(document.getElementById('propertyRent').value),
        bedrooms: parseInt(document.getElementById('propertyBedrooms').value) || 0,
        bathrooms: parseInt(document.getElementById('propertyBathrooms').value) || 0,
        squareFeet: parseInt(document.getElementById('propertySquareFeet').value) || 0,
        status: document.getElementById('propertyStatus').value,
        description: document.getElementById('propertyDescription').value,
        createdAt: id ? properties.find(p => p.id === id).createdAt : new Date().toISOString()
    };
    
    if (id) {
        const index = properties.findIndex(p => p.id === id);
        properties[index] = propertyData;
    } else {
        properties.push(propertyData);
    }
    
    DB.set('properties', properties);
    closePropertyModal();
    Properties.render();
    Dashboard.load();
    Utils.showNotification(`Property ${id ? 'updated' : 'added'} successfully!`, 'success');
});

document.getElementById('tenantForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tenants = DB.get('tenants');
    const id = document.getElementById('tenantId').value;
    
    const tenantData = {
        id: id || Utils.generateId(),
        name: document.getElementById('tenantName').value,
        email: document.getElementById('tenantEmail').value,
        phone: document.getElementById('tenantPhone').value,
        propertyId: document.getElementById('tenantProperty').value,
        leaseStart: document.getElementById('tenantLeaseStart').value,
        leaseEnd: document.getElementById('tenantLeaseEnd').value,
        deposit: parseInt(document.getElementById('tenantDeposit').value) || 0,
        status: document.getElementById('tenantStatus').value,
        createdAt: id ? tenants.find(t => t.id === id).createdAt : new Date().toISOString()
    };
    
    if (id) {
        const index = tenants.findIndex(t => t.id === id);
        tenants[index] = tenantData;
    } else {
        tenants.push(tenantData);
    }
    
    DB.set('tenants', tenants);
    closeTenantModal();
    Tenants.render();
    Dashboard.load();
    Utils.showNotification(`Tenant ${id ? 'updated' : 'added'} successfully!`, 'success');
});

document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const payments = DB.get('payments');
    const tenantId = document.getElementById('paymentTenant').value;
    const tenant = DB.get('tenants').find(t => t.id === tenantId);
    
    const paymentData = {
        id: Utils.generateId(),
        tenantId: tenantId,
        propertyId: tenant.propertyId,
        amount: parseInt(document.getElementById('paymentAmount').value),
        date: document.getElementById('paymentDate').value,
        method: document.getElementById('paymentMethod').value,
        status: document.getElementById('paymentStatus').value,
        notes: document.getElementById('paymentNotes').value,
        createdAt: new Date().toISOString()
    };
    
    payments.push(paymentData);
    DB.set('payments', payments);
    
    closePaymentModal();
    Payments.render();
    Dashboard.load();
    Utils.showNotification('Payment recorded successfully!', 'success');
});

document.getElementById('maintenanceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const maintenance = DB.get('maintenance');
    
    const maintenanceData = {
        id: Utils.generateId(),
        propertyId: document.getElementById('maintenanceProperty').value,
        title: document.getElementById('maintenanceTitle').value,
        description: document.getElementById('maintenanceDescription').value,
        priority: document.getElementById('maintenancePriority').value,
        status: document.getElementById('maintenanceStatus').value,
        cost: parseInt(document.getElementById('maintenanceCost').value) || 0,
        createdAt: new Date().toISOString()
    };
    
    maintenance.push(maintenanceData);
    DB.set('maintenance', maintenance);
    
    closeMaintenanceModal();
    Maintenance.render();
    Dashboard.load();
    Utils.showNotification('Maintenance request created successfully!', 'success');
});

// ==================== PAGE NAVIGATION ====================
function showPage(page) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Update content
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        properties: 'Properties',
        tenants: 'Tenants',
        payments: 'Payments',
        maintenance: 'Maintenance',
        reports: 'Reports',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    
    document.getElementById('pageTitle').textContent = titles[page];
    document.getElementById('breadcrumbPage').textContent = titles[page];
    
    // Load page data
    if (page === 'dashboard') Dashboard.load();
    else if (page === 'properties') Properties.render();
    else if (page === 'tenants') Tenants.render();
    else if (page === 'payments') Payments.render();
    else if (page === 'maintenance') Maintenance.render();
}

// ==================== EXPORT FUNCTION ====================
function exportData(type) {
    const data = DB.get(type);
    Utils.exportToCSV(data, type);
}

// ==================== FILTER FUNCTIONS ====================
function filterProperties() {
    // Implement filtering logic
    Properties.render();
}

function filterPayments() {
    // Implement filtering logic
    Payments.render();
}

function filterMaintenance() {
    // Implement filtering logic
    Maintenance.render();
}

// ==================== SEARCH ====================
document.getElementById('globalSearch').addEventListener('input', (e) => {
    const query = e.target.value;
    // Implement global search
    console.log('Searching for:', query);
});

// ==================== INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', () => {
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('dashboard').classList.add('active');
        
        // Initialize database
        DB.init();
        
        // Load dashboard
        Dashboard.load();
    }, 1500);
});
</body>
</html>