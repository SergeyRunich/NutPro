import React from 'react'
// import Authorize from 'components/LayoutComponents/Authorize'
import { FormattedMessage } from 'react-intl'

export async function getLeftMenuData() {
  return [
    {
      title: 'Main',
      key: 'dbMain',
      url: '/main',
      icon: 'icmn icmn-home',
      roles: [],
      denied: ['Ksenia', 'Daniel', 'Vitaly'],
    },
    {
      title: 'Kitchen',
      key: 'dbKitchen',
      url: '/dashboard/kitchen',
      icon: 'icmn icmn-spoon-knife',
      roles: ['root', 'admin', 'salesDirector', 'finance'],
      denied: ['Yana', 'Ksenia', 'Daniel'],
    },
    {
      title: 'Sales Dashboard',
      key: 'dbSales',
      url: '/dashboard/sales',
      icon: 'icmn icmn-credit-card',
      roles: ['root', 'sales', 'salesDirector', 'finance'],
    },
    {
      title: 'Production Dashboard',
      key: 'dbProd',
      url: '/dashboard/production-dashboard',
      icon: 'icmn icmn-display',
      roles: ['root', 'admin', 'finance'],
      denied: ['Daniel'],
    },
    {
      divider: true,
      denied: ['Ksenia'],
    },
    {
      title: <FormattedMessage id="menu.customers" />,
      key: 'usersPage',
      url: '/users',
      icon: 'icmn icmn-users',
      roles: ['root', 'sales', 'salesDirector'],
    },
    {
      title: <FormattedMessage id="menu.orders" />,
      key: 'ordersPage',
      url: '/orders',
      icon: 'icmn icmn-file-text',
      roles: ['root', 'sales', 'salesDirector', 'finance'],
      denied: ['Vitaly', 'Ksenia', 'Daniel'],
    },
    {
      title: <FormattedMessage id="menu.promocodes" />,
      key: 'promocodes',
      url: '/promocodes',
      roles: ['root', 'sales', 'salesDirector'],
      icon: 'icmn icmn-gift',
    },
    {
      title: 'Other',
      key: 'other',
      icon: 'icmn icmn-stack',
      roles: ['root', 'sales', 'salesDirector'],
      children: [
        {
          title: 'Vouchers',
          key: 'vouchers',
          url: '/vouchers',
          roles: ['root', 'sales', 'salesDirector'],
          icon: 'icmn icmn-ticket',
        },
        {
          title: 'Pick-Up points',
          key: 'pickup-points',
          url: '/pickup-points',
          roles: ['root', 'salesDirector'],
          icon: 'icmn icmn-box-remove',
        },
        {
          title: 'Checking Pauses',
          key: 'checking-pauses',
          url: '/checking-pauses',
          roles: ['root', 'sales', 'salesDirector'],
          icon: 'icmn icmn-pause',
        },
      ],
    },

    // {
    //   title: 'Algorithm settings',
    //   key: 'algoSettings',
    //   url: '/settings/algo',
    //   icon: 'icmn icmn-equalizer2',
    // },
    {
      title: 'Events',
      key: 'events',
      url: '/events',
      roles: ['root', 'admin', 'sales', 'salesDirector'],
      icon: 'icmn icmn-bullhorn',
      denied: ['Vitaly'],
    },
    {
      divider: true,
      roles: ['root', 'admin', 'finance'],
      denied: ['Ksenia'],
    },
    {
      title: 'Week template',
      key: 'week-template1',
      url: '/erp/week-template',
      roles: ['finance', 'sales'],
      denied: ['Yana', 'Ksenia', 'Dave', 'Daniel'],
      icon: 'icmn icmn-stack',
    },
    {
      title: 'ERP',
      key: 'erp',
      icon: 'icmn icmn-stack',
      roles: ['root', 'admin', 'finance'],
      denied: ['Yana', 'Ksenia', 'Daniel'],
      children: [
        {
          title: 'Managing templates',
          key: 'week-template',
          url: '/erp/week-template',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'ERP settings',
          key: 'erpTest',
          url: '/settings/erpTest',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: <FormattedMessage id="menu.sendDocuments" />,
          key: 'documentsPrint',
          url: '/documents/send',
          roles: ['root', 'admin', 'finance'],
          denied: ['Yana', 'Ksenia', 'Daniel'],
        },
        {
          title: 'Groups of ingredients',
          key: 'groupsIngredientMenu',
          url: '/erp/groupIngredient',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Ingredients',
          key: 'ingredientsMenu',
          url: '/erp/ingredient',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Ingredient Tags',
          key: 'ingredientTags',
          url: '/erp/tags',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Techcards',
          key: 'techcardsMenu',
          url: '/erp/techcard',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Day templates',
          key: 'templatesMenu',
          url: '/erp/template',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Week templates',
          key: 'weekTemplate',
          url: '/erp/weekTemplate',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Calendar menu',
          key: 'calendarMenu',
          url: '/erp/calendar',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Weekly calendar',
          key: 'calendarWeekly',
          url: '/erp/calendar/weekly',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Materials',
          key: 'materials',
          url: '/materials',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        {
          title: 'Logs',
          key: 'logs',
          url: '/logs/erp',
          roles: ['root', 'admin'],
          denied: ['Vitaly'],
        },
        // {
        //   title: 'Kitchen workload',
        //   key: 'kitchenWorkload',
        //   url: '/erp/kitchen-workload',
        //   roles: ['root', 'admin'],
        // },
      ],
    },
    {
      divider: true,
    },
    {
      title: <FormattedMessage id="menu.settings" />,
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
      denied: ['Ksenia'],
    },
    {
      divider: true,
      denied: ['Ksenia', 'Daniel'],
    },
    {
      title: 'Ratings',
      key: 'ratings',
      icon: 'icmn icmn-star-half',
      roles: ['root', 'admin', 'finance', 'salesDirector'],
      denied: ['Ksenia', 'Daniel', 'Vitaly'],
      children: [
        {
          title: 'Dishes',
          key: 'dishes',
          url: '/ratings',
          roles: ['root', 'admin', 'finance', 'salesDirector'],
          denied: ['Daniel', 'Vitaly'],
        },
        {
          title: 'Customers',
          key: 'customers',
          url: '/ratings-by-customers',
          roles: ['root', 'admin', 'finance', 'salesDirector'],
          denied: ['Daniel', 'Vitaly'],
        },
        {
          title: 'Feedbacks',
          key: 'feedbacks',
          url: '/feedback',
          roles: ['root', 'admin', 'finance', 'sales', 'salesDirector'],
          denied: ['Daniel', 'Vitaly'],
        },
      ],
    },
    {
      title: 'Sales Target Fulfilment',
      key: 'dbSTF',
      url: '/dashboard/stf',
      roles: ['root', 'finance', 'salesDirector'],
      icon: 'icmn icmn-calculator',
    },
    {
      title: 'Price Modeling Tool',
      key: 'dbPMT',
      url: '/dashboard/pmt',
      roles: ['root', 'salesDirector'],
      icon: 'icmn icmn-price-tag',
    },
    {
      title: 'List Of Debtors',
      key: 'dbLOD',
      url: '/dashboard/lod',
      roles: ['root', 'finance', 'salesDirector', 'readonlySearch'],
      denied: ['Daniel'],
      icon: 'icmn icmn-list-numbered',
    },
    {
      title: 'Finance',
      key: 'dbFinance',
      url: '/dashboard/finance',
      roles: ['root', 'finance', 'salesDirector'],
      icon: 'icmn icmn-coin-dollar',
      denied: ['Ksenia'],
    },
    {
      title: 'Refund invoices',
      key: 'refundInv',
      url: '/refund-invoice',
      icon: 'icmn icmn-list-numbered',
      roles: ['root', 'finance', 'salesDirector'],
      denied: ['Ksenia', 'Vitaly', 'Yana', 'Daniel'],
      // icon: 'icmn icmn-calculator',
    },
    {
      title: 'Payments',
      key: 'payments',
      url: '/payments',
      roles: ['root', 'finance', 'salesDirector'],
      denied: ['Daniel'],
      icon: 'icmn icmn-coin-dollar',
    },
    {
      title: 'COO Dashboard',
      key: 'cooBoard',
      url: '/dashboard/kpi',
      roles: ['root', 'finance'],
      denied: ['Ksenia', 'Yana', 'Daniel'],
      icon: 'icmn icmn-meter',
    },
  ]
}
export async function getTopMenuData() {
  return [
    {
      title: 'Main',
      key: 'dbMain',
      url: '/main',
      icon: 'icmn icmn-home',
      roles: [],
      denied: ['Ksenia', 'Daniel'],
    },
    {
      title: 'Kitchen',
      key: 'dbKitchen',
      url: '/dashboard/kitchen',
      icon: 'icmn icmn-spoon-knife',
      roles: ['root', 'admin', 'salesDirector', 'finance'],
      denied: ['Yana', 'Ksenia', 'Daniel'],
    },
    {
      title: 'Sales Dashboard',
      key: 'dbSales',
      url: '/dashboard/sales',
      icon: 'icmn icmn-credit-card',
      roles: ['root', 'sales', 'salesDirector', 'finance'],
    },
    {
      title: 'Production Dashboard',
      key: 'dbProd',
      url: '/dashboard/production-dashboard',
      icon: 'icmn icmn-display',
      roles: ['root', 'admin', 'finance'],
      denied: ['Daniel'],
    },
    {
      divider: true,
      denied: ['Ksenia'],
    },
    {
      title: <FormattedMessage id="menu.customers" />,
      key: 'usersPage',
      url: '/users',
      icon: 'icmn icmn-users',
      roles: ['root', 'sales', 'salesDirector'],
    },
    {
      title: <FormattedMessage id="menu.orders" />,
      key: 'ordersPage',
      url: '/orders',
      icon: 'icmn icmn-file-text',
      roles: ['root', 'sales', 'salesDirector', 'finance'],
      denied: ['Vitaly', 'Ksenia', 'Daniel'],
    },
    {
      title: <FormattedMessage id="menu.promocodes" />,
      key: 'promocodes',
      url: '/promocodes',
      roles: ['root', 'sales', 'salesDirector'],
      icon: 'icmn icmn-gift',
    },
    {
      title: 'Other',
      key: 'other',
      icon: 'icmn icmn-stack',
      roles: ['root', 'sales', 'salesDirector'],
      children: [
        {
          title: 'Vouchers',
          key: 'vouchers',
          url: '/vouchers',
          roles: ['root', 'sales', 'salesDirector'],
          icon: 'icmn icmn-ticket',
        },
        {
          title: 'Pick-Up points',
          key: 'pickup-points',
          url: '/pickup-points',
          roles: ['root', 'salesDirector'],
          icon: 'icmn icmn-box-remove',
        },
        {
          title: 'Checking Pauses',
          key: 'checking-pauses',
          url: '/checking-pauses',
          roles: ['root', 'sales', 'salesDirector'],
          icon: 'icmn icmn-pause',
        },
      ],
    },

    // {
    //   title: 'Algorithm settings',
    //   key: 'algoSettings',
    //   url: '/settings/algo',
    //   icon: 'icmn icmn-equalizer2',
    // },
    {
      title: 'Events',
      key: 'events',
      url: '/events',
      roles: ['root', 'admin', 'sales', 'salesDirector'],
      icon: 'icmn icmn-bullhorn',
    },
    {
      divider: true,
      roles: ['root', 'admin', 'finance'],
      denied: ['Ksenia'],
    },
    {
      title: 'Week template',
      key: 'week-template1',
      url: '/erp/week-template',
      roles: ['finance', 'sales'],
      denied: ['Yana', 'Ksenia', 'Dave', 'Daniel'],
      icon: 'icmn icmn-stack',
    },
    {
      title: 'ERP',
      key: 'erp',
      icon: 'icmn icmn-stack',
      roles: ['root', 'admin', 'finance'],
      denied: ['Yana', 'Ksenia', 'Daniel'],
      children: [
        {
          title: 'Managing templates',
          key: 'week-template',
          url: '/erp/week-template',
          roles: ['root', 'admin'],
        },
        {
          title: 'ERP settings',
          key: 'erpTest',
          url: '/settings/erpTest',
          roles: ['root', 'admin'],
        },
        {
          title: <FormattedMessage id="menu.sendDocuments" />,
          key: 'documentsPrint',
          url: '/documents/send',
          roles: ['root', 'admin', 'finance'],
          denied: ['Yana', 'Ksenia'],
        },
        {
          title: 'Groups of ingredients',
          key: 'groupsIngredientMenu',
          url: '/erp/groupIngredient',
          roles: ['root', 'admin'],
        },
        {
          title: 'Ingredients',
          key: 'ingredientsMenu',
          url: '/erp/ingredient',
          roles: ['root', 'admin'],
        },
        {
          title: 'Ingredient Tags',
          key: 'ingredientTags',
          url: '/erp/tags',
          roles: ['root', 'admin'],
        },
        {
          title: 'Techcards',
          key: 'techcardsMenu',
          url: '/erp/techcard',
          roles: ['root', 'admin'],
        },
        {
          title: 'Day templates',
          key: 'templatesMenu',
          url: '/erp/template',
          roles: ['root', 'admin'],
        },
        {
          title: 'Week templates',
          key: 'weekTemplate',
          url: '/erp/weekTemplate',
          roles: ['root', 'admin'],
        },
        {
          title: 'Calendar menu',
          key: 'calendarMenu',
          url: '/erp/calendar',
          roles: ['root', 'admin'],
        },
        {
          title: 'Weekly calendar',
          key: 'calendarWeekly',
          url: '/erp/calendar/weekly',
          roles: ['root', 'admin'],
        },
        {
          title: 'Materials',
          key: 'materials',
          url: '/materials',
          roles: ['root', 'admin'],
        },
        {
          title: 'Logs',
          key: 'logs',
          url: '/logs/erp',
          roles: ['root', 'admin'],
        },
        // {
        //   title: 'Kitchen workload',
        //   key: 'kitchenWorkload',
        //   url: '/erp/kitchen-workload',
        //   roles: ['root', 'admin'],
        // },
      ],
    },
    {
      divider: true,
    },
    {
      title: <FormattedMessage id="menu.settings" />,
      key: 'settings',
      icon: 'icmn icmn-cog utils__spin-delayed--pseudo-selector',
      denied: ['Ksenia'],
    },
    {
      divider: true,
      denied: ['Ksenia', 'Daniel'],
    },
    {
      title: 'Ratings',
      key: 'ratings',
      icon: 'icmn icmn-star-half',
      roles: ['root', 'admin', 'finance', 'salesDirector'],
      denied: ['Ksenia', 'Daniel'],
      children: [
        {
          title: 'Dishes',
          key: 'dishes',
          url: '/ratings',
          roles: ['root', 'admin', 'finance', 'salesDirector'],
        },
        {
          title: 'Customers',
          key: 'customers',
          url: '/ratings-by-customers',
          roles: ['root', 'admin', 'finance', 'salesDirector'],
        },
        {
          title: 'Feedbacks',
          key: 'feedbacks',
          url: '/feedback',
          roles: ['root', 'admin', 'finance', 'sales', 'salesDirector'],
        },
      ],
    },
    {
      title: 'Sales Target Fulfilment',
      key: 'dbSTF',
      url: '/dashboard/stf',
      roles: ['root', 'finance', 'salesDirector'],
      icon: 'icmn icmn-calculator',
    },
    {
      title: 'Price Modeling Tool',
      key: 'dbPMT',
      url: '/dashboard/pmt',
      roles: ['root', 'salesDirector'],
      icon: 'icmn icmn-price-tag',
    },
    {
      title: 'List Of Debtors',
      key: 'dbLOD',
      url: '/dashboard/lod',
      roles: ['root', 'finance', 'salesDirector', 'readonlySearch'],
      icon: 'icmn icmn-list-numbered',
    },
    {
      title: 'Finance',
      key: 'dbFinance',
      url: '/dashboard/finance',
      roles: ['root', 'finance', 'salesDirector'],
      icon: 'icmn icmn-coin-dollar',
      denied: ['Ksenia'],
    },
    {
      title: 'Refund invoices',
      key: 'refundInv',
      url: '/refund-invoice',
      icon: 'icmn icmn-list-numbered',
      roles: ['root', 'finance', 'salesDirector'],
      denied: ['Ksenia', 'Vitaly', 'Yana', 'Daniel'],
      // icon: 'icmn icmn-calculator',
    },
    {
      title: 'Payments',
      key: 'payments',
      url: '/payments',
      roles: ['root', 'finance', 'salesDirector'],
      denied: ['Daniel'],
      icon: 'icmn icmn-coin-dollar',
    },
    {
      title: 'COO Dashboard',
      key: 'cooBoard',
      url: '/dashboard/kpi',
      roles: ['root', 'finance'],
      denied: ['Ksenia', 'Yana', 'Daniel'],
      icon: 'icmn icmn-meter',
    },
  ]
}
