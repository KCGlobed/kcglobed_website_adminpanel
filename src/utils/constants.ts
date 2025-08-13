// src/utils/baseUrl.ts

let BASE_URL: string;
let Website_URL: string;
const DEV_URL = 'https://backend-dev-254015706580.asia-south2.run.app/api/';
const PROD_URL = 'https://backend-prod-254015706580.asia-south2.run.app/api/';
const LOCAL_URL = 'https://kcglobed-website-427233911753.europe-west1.run.app';
const DEPLOYED_URL = 'https://kcglobed.com';

const savedMode = localStorage.getItem('app_mode');
if (savedMode === 'production') {
  BASE_URL = PROD_URL;
  Website_URL = DEPLOYED_URL;
} else {
  BASE_URL = PROD_URL;
  Website_URL = DEPLOYED_URL;
}

export const changeMode = (isProd: boolean, reload: boolean = true): void => {
  localStorage.setItem('app_mode', isProd ? 'production' : 'development');
  BASE_URL = isProd ? PROD_URL : DEV_URL;
  if (reload) {
    window.location.reload();
  }
};

export const getBaseUrl = (): string => BASE_URL;
export { BASE_URL, Website_URL };


const PAGE_TYPES = [
  { value: 'homepage', label: 'Home Page' },
  { value: 'course_main', label: 'Main Course Page' },
  { value: 'course_cpa', label: 'CPA Page' },
  { value: 'course_cma', label: 'CMA Page' },
  { value: 'course_ea', label: 'EA Page' }
];

const SECTION_TYPES = [
  { value: 'banner', label: 'Banner' },
  { value: 'course_section', label: 'Course Section' },
  { value: 'teee_section', label: 'Experience Educational Section' },
  { value: 'demo3', label: 'Demo3' },
];

export { PAGE_TYPES, SECTION_TYPES }