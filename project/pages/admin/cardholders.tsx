import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, User, Phone, Mail, Building2, Calendar, Loader2, Clock, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Header } from '../../components/Layout/Header';
import { Sidebar } from '../../components/Layout/Sidebar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Cardholder } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CardholderList() {
  const { state, deleteCardholder, fetchUsers } = useApp();
  const { state: authState } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardholderToDelete, setCardholderToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (authState.isInitialized && !authState.isAuthenticated) {
      router.push('/login');
    }
  }, [authState.isInitialized, authState.isAuthenticated, router]);

  // Fetch users when the page loads and whenever we navigate to it
  useEffect(() => {
    if (authState.isAuthenticated && router.isReady && !state.isLoading) {
      fetchUsers();
    }
  }, [authState.isAuthenticated, router.isReady, router.pathname, fetchUsers]);

  // Filter cardholders based on search term
  const filteredCardholders = state.cardholders.filter(
    (cardholder) =>
      cardholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cardholder.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cardholder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cardholder.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string, name: string) => {
    setCardholderToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cardholderToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCardholder(cardholderToDelete.id);
      showSuccess('Deleted Successfully', `${cardholderToDelete.name} has been removed`);
      setDeleteDialogOpen(false);
      setCardholderToDelete(null);
    } catch {
      showError('Delete Failed', 'Could not delete cardholder. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCardholderToDelete(null);
  };

  const handleEdit = (cardholder: Cardholder) => {
    router.push(`/profile?id=${cardholder.id}`);
  };

  const handleView = (cardholder: Cardholder) => {
    if (cardholder.publicUrl) {
      window.open(cardholder.publicUrl, '_blank');
    }
  };

  // Show loading state
  if (!authState.isInitialized || state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!authState.isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>Cardholders - NFC Digital Profile</title>
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onMenuClick={toggleSidebar} />
        <div className="pt-16">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          
          <div className="lg:ml-64">
            <main className="p-3 sm:p-4 md:p-6 min-h-screen">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cardholders</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Manage all registered cardholders ({filteredCardholders.length} total)
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search cardholders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-64 transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => router.push('/admin/add')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                    >
                      Add New
                    </button>
                  </div>
                </div>

                {/* Table View for Desktop */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Cardholder
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Analytics
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence>
                          {filteredCardholders.map((cardholder, index) => (
                            <motion.tr
                              key={cardholder.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {cardholder.profilePhoto ? (
                                    <img
                                      src={cardholder.profilePhoto}
                                      alt={cardholder.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                      {cardholder.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {cardholder.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {cardholder.jobTitle}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {cardholder.email}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {cardholder.phone}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {cardholder.company}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {cardholder.totalViews?.toLocaleString() || '0'}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                      <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {cardholder.totalContactSaves?.toLocaleString() || '0'}
                                      </span>
                                    </div>
                                  </div>
                                  {cardholder.lastViewedAt && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400" title={`Last viewed: ${new Date(cardholder.lastViewedAt).toLocaleString()}`}>
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      {new Date(cardholder.lastViewedAt).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(cardholder.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleView(cardholder)}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="View Public Card"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(cardholder)}
                                    className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edit Cardholder"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(cardholder.id, cardholder.name)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete Cardholder"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {filteredCardholders.length === 0 && (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                        {searchTerm ? 'No cardholders found matching your search.' : 'No cardholders yet.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => router.push('/admin/add')}
                          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Add Your First Cardholder
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Card View for Mobile */}
                <div className="md:hidden grid gap-4">
                  <AnimatePresence>
                    {filteredCardholders.map((cardholder, index) => (
                      <motion.div
                        key={cardholder.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            {cardholder.profilePhoto ? (
                              <img
                                src={cardholder.profilePhoto}
                                alt={cardholder.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {cardholder.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{cardholder.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{cardholder.jobTitle}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Building2 className="w-4 h-4 mr-2" />
                            <span>{cardholder.company}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 mr-2" />
                            <span className="truncate">{cardholder.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{cardholder.phone}</span>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{new Date(cardholder.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                  {cardholder.totalViews?.toLocaleString() || '0'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {cardholder.totalContactSaves?.toLocaleString() || '0'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(cardholder)}
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          <button
                            onClick={() => handleEdit(cardholder)}
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-sm font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cardholder.id, cardholder.name)}
                            className="px-3 py-2 rounded-lg transition-colors bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredCardholders.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                      <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {searchTerm ? 'No cardholders found.' : 'No cardholders yet.'}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => router.push('/admin/add')}
                          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Add Cardholder
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </main>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Cardholder"
          message={`Are you sure you want to delete ${cardholderToDelete?.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          loading={isDeleting}
        />
      </div>
    </>
  );
}
