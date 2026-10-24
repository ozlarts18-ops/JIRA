import React from 'react';

// Official Jira Brand Logo (Iconic 3-step overlapping vectors)
export const JiraLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="jira-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2684ff" />
        <stop offset="100%" stopColor="#0052cc" />
      </linearGradient>
      <linearGradient id="jira-mid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0052cc" />
        <stop offset="100%" stopColor="#0747a6" />
      </linearGradient>
    </defs>
    <path
      d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005z"
      fill="url(#jira-blue-grad)"
    />
    <path
      d="M17.294 5.757H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001z"
      fill="url(#jira-mid-grad)"
    />
    <path
      d="M23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z"
      fill="url(#jira-blue-grad)"
    />
  </svg>
);

// Top-left Sidebar Toggle Icon (Panel / Sidebar menu toggle)
export const SidebarToggleIcon = ({ size = 18, color = "#44546f" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

// 9-dot App Switcher
export const AppSwitcherIcon = ({ size = 18, color = "#44546f" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" color={color}>
    <circle cx="4" cy="4" r="1.8" />
    <circle cx="10" cy="4" r="1.8" />
    <circle cx="16" cy="4" r="1.8" />
    <circle cx="4" cy="10" r="1.8" />
    <circle cx="10" cy="10" r="1.8" />
    <circle cx="16" cy="10" r="1.8" />
    <circle cx="4" cy="16" r="1.8" />
    <circle cx="10" cy="16" r="1.8" />
    <circle cx="16" cy="16" r="1.8" />
  </svg>
);

// For You Icon (Person inside rounded badge silhouette)
export const ForYouIcon = ({ size = 18, color = "#0c66e4" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="2.2" />
    <path d="M15 8.5h2" />
    <path d="M15 12.5h2" />
    <path d="M6.5 16.5c0-1.6 1.2-2.5 2.5-2.5s2.5.9 2.5 2.5" />
  </svg>
);

// Spaces Icon in sidebar
export const SpacesSidebarIcon = ({ size = 18, color = "#44546f" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 21h12a2 2 0 0 0 2-2V7" />
  </svg>
);

// Confluence Logo (Rounded soft blue container with two blue waves)
export const ConfluenceLogo = ({ size = 42 }) => (
  <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="42" height="42" rx="8" fill="#deebff" />
    <path
      d="M13.4 24.6c-.4.5-.4 1.2 0 1.7l3.6 4.6c.4.5 1 .8 1.7.5l7-2.4c.8-.3 1-.1 1.8-.8l-1.6-5c-.3-.8-1-1-1.8-.8l-8 2.6c-.7.2-1.2.2-1.7.6z"
      fill="#0052cc"
    />
    <path
      d="M28.6 17.4c.4-.5.4-1.2 0-1.7l-3.6-4.6c-.4-.5-1-.8-1.7-.5l-7 2.4c-.8.3-1 .1-1.8.8l1.6 5c.3.8 1 1 1.8.8l8-2.6c.7-.2 1.2-.2 1.7-.6z"
      fill="#2684ff"
    />
  </svg>
);

// Space 1 Icon (Pract7: 40px Cyan rounded container with beaker/coffee cup & red indicator)
export const Pract7Icon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#00a3bf" />
    <path d="M13 12h14v5a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-5z" fill="#ffffff" />
    <rect x="15" y="25" width="10" height="2.5" rx="1.25" fill="#ffffff" />
    <circle cx="20" cy="17" r="2.8" fill="#de350b" />
  </svg>
);

// Space 2 Icon (pract 6: 40px Vibrant teal with eye/camera/robot circle)
export const Pract6Icon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#00b8d9" />
    <circle cx="20" cy="20" r="9" fill="#ffffff" />
    <circle cx="20" cy="20" r="5" fill="#5243aa" />
    <circle cx="21.5" cy="18.5" r="1.8" fill="#ffffff" />
  </svg>
);

// Space 3 Icon (Smart Building: 40px Blue gradient with mountain/audit building symbol)
export const SmartBuildingIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad40" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4c9aff" />
        <stop offset="1" stopColor="#0052cc" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="8" fill="url(#blueGrad40)" />
    <path d="M10 28l7-10 5 6 3-4 5 8H10z" fill="#ffffff" opacity="0.95" />
    <circle cx="27" cy="14" r="3" fill="#ffab00" />
  </svg>
);

// Collect IT requests icon (sidebar)
export const CollectITIcon = () => (
  <div style={{
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: '#8777d9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 'bold',
    flexShrink: 0
  }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  </div>
);
