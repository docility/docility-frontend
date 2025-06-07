import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('Sidebar', () => {
  const showSidebar = ref(true);
  const showLogoutModal = ref(false);
  const activeSubMenu = ref(null);
  const activeMenu = ref(null);
  const allowedRouteNames = JSON.parse(sessionStorage.getItem('accessModule')).map(item => item.path) || [];
  const dashBoardMenu = ref([]); // Use ref to make it reactive
  function refreshMenu() {  
  // allowedRouteNames.push('Subscription'); // Ensure Dashboard is always included
   dashBoardMenu.value = [
    { name: 'Dashboard', to: '/dashboard/home', subMenu: [] },
    { name: 'Supplier', to: '/dashboard/supplier', subMenu: [] },
    {
      name: 'Risk Assessment',
      to: '',
      subMenu: [
        { name: 'Asset Category', to: '/dashboard/asset-category' },
        { name: 'Risk Category', to: '/dashboard/risk-category' },
        { name: 'Control Domain', to: '/dashboard/control-domain' },
        { name: 'Control Assessment', to: '/dashboard/control-assessment' },
        { name: 'Risk Treatment', to: '/dashboard/create-risk-treatment' }, 
        { name: 'Risks Register', to: '/dashboard/risks'}, 
      ],
    },
    {
      name: "Manage",
      to: '',
      subMenu: [
        { name: 'Customer', to: 'customer-management', subMenu: [] },
        { name: 'Record', to: '/dashboard/record-management', subMenu: [] },
        { name: 'Company', to: '/dashboard/company-management', subMenu: [] },
        {name: 'Subscription', to: '/dashboard/subscription-management', subMenu: []},
      ]
    },
    { name: 'Questionnaire', to: '/dashboard/questionnaire-management', subMenu: [] },
  ].filter(menu => {
    // Always include Dashboard
    if (menu.to === '/dashboard') return true;
    // If has subMenu, filter subMenu items
    if (menu.subMenu && menu.subMenu.length) {
      menu.subMenu = menu.subMenu.filter(sub => isAllowed(sub.to));
      return menu.subMenu.length > 0;
    }
    // Otherwise, check main menu name
    return isAllowed(menu.to);
  });
    
  return dashBoardMenu.value;
  }

  console.log('Dashboard Menu:', dashBoardMenu);

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  function isAllowed(name) {
  const isAllowed = allowedRouteNames.includes(name)
  console.log('Checking if allowed:', name, isAllowed, allowedRouteNames);
  return isAllowed;
}


  function handleLogout(router) {
    sessionStorage.clear();
    showLogoutModal.value = false;
    activeSubMenu.value = null;
    activeMenu.value = null;
    dashBoardMenu.value = [];
    router.push('/signin');
    refreshMenu()
  }

  function handleMenuClick(index, item, router) {
    if (item.subMenu.length) {
      activeSubMenu.value = activeSubMenu.value === index ? null : index;
      activeMenu.value = item.name;
    } else {
      activeMenu.value = item.name;
      router.push(item.to);
      refreshMenu()
    }
  }
refreshMenu()
  return {
    showSidebar,
    showLogoutModal,
    activeSubMenu,
    activeMenu,
    dashBoardMenu,
    toggleSidebar,
    handleLogout,
    refreshMenu,
    handleMenuClick,
  };
});
