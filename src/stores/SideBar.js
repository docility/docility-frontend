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
        { name: 'Control Domain', to: '/dashboard/control-domain' },
        { name: 'Control Assessment', to: '/dashboard/control-assessment' },
        { name: 'New Risk Treatment', to: '/dashboard/risk-treatment' }, 
        { name: 'Risk Register', to: '/dashboard/risks'}, 
      ],
    },
    {
      name: "Manage",
      to: '',
      subMenu: [
        { name: 'Customer', to: '/dashboard/customer-management', subMenu: [] },
        { name: 'Record', to: '/dashboard/record-management', subMenu: [] },
        { name: 'Company', to: '/dashboard/company-management', subMenu: [] },
        {name: 'Subscription', to: '/dashboard/subscription-management', subMenu: []},
      ]
    },
    { name: 'Questionnaire', to: '/dashboard/questionnaire-management', subMenu: [] },
  ];

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  function handleLogout(router) {
    sessionStorage.clear();
    showLogoutModal.value = false;
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
