import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('Sidebar', () => {
  const showSidebar = ref(true);
  const showLogoutModal = ref(false);
  const activeSubMenu = ref(null);
  const activeMenu = ref(null);

  const dashBoardMenu = [
    { name: 'Dashboard', to: '/dashboard/home', subMenu: [] },
    { name: 'Supplier', to: '/dashboard/supplier', subMenu: [] },
    {
      name: 'Risk Assessment',
      to: '',
      subMenu: [
        { name: 'New Asset Category', to: '/dashboard/asset-category' },
        { name: 'New Risk Category', to: '/dashboard/risk-category' },
        // { name: 'Control Domain', to: '/dashboard/control-domain' },
        { name: 'New Risk Treatment', to: '/dashboard/risk-treatment' },
        // { name: 'Control Assessment', to: '/dashboard/create-control' },
        // { name: 'New Control Assessment', to: '/dashboard/create-control-assessment' },
        // { name: 'New Assessment Checklist', to: '/dashboard/create-control-assessment' },
        // { name: 'Information Asset', to: '/dashboard/create-information-asset' },
        // { name: 'New Risk', to: '/dashboard/risk' },
        { name: 'Risk Register', to: '/dashboard/risks'},
        // { name: 'Risk Category', to: '/dashboard/create-risk-category' },
        { name: 'New Risk Treatment', to: '/dashboard/create-risk-treatment' },
        // { name: 'Risks List', to: '/dashboard/risk-register' }, 
      ],
    },
    
    { name: 'Customer Management', to: '/dashboard/customer-management', subMenu: [] },
    { name: 'Company Management', to: '/dashboard/company-management', subMenu: [] },
    { name: 'Questionnaire', to: '/dashboard/questionnaire-management', subMenu: [] },
  ];

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  function handleLogout(router) {
    sessionStorage.clear();
    router.push('/signin');
  }

  function handleMenuClick(index, item, router) {
    if (item.subMenu.length) {
      activeSubMenu.value = activeSubMenu.value === index ? null : index;
      activeMenu.value = item.name;
    } else {
      activeMenu.value = item.name;
      router.push(item.to);
    }
  }

  return {
    showSidebar,
    showLogoutModal,
    activeSubMenu,
    activeMenu,
    dashBoardMenu,
    toggleSidebar,
    handleLogout,
    handleMenuClick,
  };
});
