export const environment = {
  clientId: 'HRM_CLIENT_DEV',
  keyCookie: 'DEV',
  production: false,
  bgLogin: '/assets/img/HUCE.jpg',
  favicon: 'assets/icon/sidebar/logo-collapsed.png',
  logoIcon: '/assets/icon/sidebar/logo.png',
  title: 'HCM',
  isPinMenu: false,
  isRequiredTaxNo: true,
  frontend: 'http://localhost:4200/',
  backend: {
    websocket: 'http://localhost:8080/ws-service/ws',
    admin: 'http://localhost:8868/admin-service',
    hrm: 'http://localhost:8869/hrm-service',
    kpi: 'http://localhost:8879/kpi-service',
  }
};
